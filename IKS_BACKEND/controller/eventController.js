import event from "../model/event.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUtils.js";

// Helper to parse the JSON strings sent from the frontend
const parseExistingArray = (val) => {
  if (!val) return [];
  const arr = Array.isArray(val) ? val : [val];
  return arr.map(item => {
    try { 
      return typeof item === 'string' ? JSON.parse(item) : item; 
    } catch(e) { 
      // Fallback for old database entries that were just strings
      return { url: item, name: 'Existing File' }; 
    }
  });
};

export const addEvent = async (req, res) => {
  try {
    const { title, speaker, date, time, venue, description, status } = req.body;
    if (!title || !date) return res.status(400).json({ success: false, msg: "Title and date are required" });

    let noticePdfsData = [];
    let imagesData = [];

    // CHANGED: Now saving both URL and original file name
    if (req.files && req.files['noticePdfs']) {
      const pdfPromises = req.files['noticePdfs'].map(async file => {
        const url = await uploadToCloudinary(file, "event-pdfs");
        return { url, name: file.originalname };
      });
      noticePdfsData = await Promise.all(pdfPromises);
    }

    if (req.files && req.files['images']) {
      const imagePromises = req.files['images'].map(async file => {
        const url = await uploadToCloudinary(file, "event-images");
        return { url, name: file.originalname };
      });
      imagesData = await Promise.all(imagePromises);
    }

    const newEvent = await event.create({
      title, speaker, date, time, venue, description,
      status: status || "upcoming",
      noticePdfs: noticePdfsData,
      images: imagesData
    });

    return res.status(201).json({ success: true, msg: "Event added successfully", data: newEvent });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const allEvents = await event.find({}).sort({ date: -1 });
    return res.status(200).json({ success: true, data: allEvents });
  } catch (error) {
    console.error("Error Getting Events:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const existingEvent = await event.findById(id);
    if (!existingEvent) return res.status(404).json({ success: false, msg: "Event not found" });

    const retainedImages = parseExistingArray(req.body.existingImages);
    const retainedPdfs = parseExistingArray(req.body.existingNoticePdfs);

    const retainedImageUrls = retainedImages.map(img => img.url);
    const retainedPdfUrls = retainedPdfs.map(pdf => pdf.url);

    // Filter out files that were deleted, handling old string data formats safely
    const imagesToDelete = existingEvent.images.filter(img => {
        const url = img.url || img; // Backward compatibility
        return !retainedImageUrls.includes(url);
    });
    const pdfsToDelete = existingEvent.noticePdfs.filter(pdf => {
        const url = pdf.url || pdf; // Backward compatibility
        return !retainedPdfUrls.includes(url);
    });

    await Promise.all([
      ...imagesToDelete.map(img => deleteFromCloudinary(img.url || img)),
      ...pdfsToDelete.map(pdf => deleteFromCloudinary(pdf.url || pdf))
    ]);

    let newNoticePdfs = [];
    let newImages = [];

    if (req.files && req.files['noticePdfs']) {
      const pdfPromises = req.files['noticePdfs'].map(async file => {
        const url = await uploadToCloudinary(file, "event-pdfs");
        return { url, name: file.originalname };
      });
      newNoticePdfs = await Promise.all(pdfPromises);
    }

    if (req.files && req.files['images']) {
      const imagePromises = req.files['images'].map(async file => {
        const url = await uploadToCloudinary(file, "event-images");
        return { url, name: file.originalname };
      });
      newImages = await Promise.all(imagePromises);
    }

    const updatedData = {
      title: req.body.title || existingEvent.title,
      speaker: req.body.speaker !== undefined ? req.body.speaker : existingEvent.speaker,
      date: req.body.date || existingEvent.date,
      time: req.body.time !== undefined ? req.body.time : existingEvent.time,
      venue: req.body.venue !== undefined ? req.body.venue : existingEvent.venue,
      description: req.body.description !== undefined ? req.body.description : existingEvent.description,
      status: req.body.status || existingEvent.status,
      noticePdfs: [...retainedPdfs, ...newNoticePdfs],
      images: [...retainedImages, ...newImages]
    };

    if (req.files && req.files['images'] && updatedData.status === "upcoming") {
      updatedData.status = "completed";
    }

    const finalEvent = await event.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    return res.status(200).json({ success: true, msg: "Event updated", data: finalEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const existingEvent = await event.findById(id);
    if (!existingEvent) return res.status(404).json({ success: false, msg: "Event not found" });

    // Handles both new object format and old string format
    await Promise.all([
      ...existingEvent.images.map(img => deleteFromCloudinary(img.url || img)),
      ...existingEvent.noticePdfs.map(pdf => deleteFromCloudinary(pdf.url || pdf))
    ]);
    
    await event.findByIdAndDelete(id);
    return res.status(200).json({ success: true, msg: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, msg: error.message });
  }
};
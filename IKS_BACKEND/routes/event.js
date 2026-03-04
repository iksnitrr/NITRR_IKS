import express from "express";
import multer from "multer";
import { addEvent, getAllEvents, updateEvent, deleteEvent } from "../controller/eventController.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();

// Define limits: 5 PDFs, 20 Images
const cpUpload = upload.fields([
  { name: 'noticePdfs', maxCount: 5 },
  { name: 'images', maxCount: 20 }
]);

// Wrapper to catch Multer file limit errors clearly
const handleUpload = (req, res, next) => {
  cpUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Catches the "Unexpected field" (too many files) error
      return res.status(400).json({ success: false, msg: `Upload limit error: ${err.message}. Max 5 PDFs and 20 Images allowed.` });
    } else if (err) {
      return res.status(500).json({ success: false, msg: err.message });
    }
    next();
  });
};

router.post("/addevent", handleUpload, addEvent);
router.get("/getevents", getAllEvents);
router.put("/update/:id", handleUpload, updateEvent);
router.delete("/delete/:id", deleteEvent);

export default router;
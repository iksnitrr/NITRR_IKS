import Course from "../model/academics.js";

import mongoose from "mongoose";

export const getAllCourses = async (req, res) => {
    try {

        const courses = await Course.find().sort({ createdAt: -1 });

        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found."
            });
        }

        return res.status(200).json({
            success: true,
            totalCourses: courses.length,
            data: courses
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const addCourse = async (req, res) => {

    try {

        const {
            courseCode,
            courseName,
            credits,
            prerequisite,
            courseType,
            objectives,
            units,
            outcomes,
            textbooks,
            referenceBooks
        } = req.body;

        // Required Fields
        if (!courseName) {
            return res.status(400).json({
                success: false,
                message: "Course Name is required."
            });
        }

        // Duplicate Course Code

        if (courseCode) {

            const existingCode = await Course.findOne({
                courseCode: courseCode.trim()
            });

            if (existingCode) {
                return res.status(409).json({
                    success: false,
                    message: "Course Code already exists."
                });
            }
        }

        // Duplicate Course Name

        const existingName = await Course.findOne({
            courseName: courseName.trim()
        });

        if (existingName) {
            return res.status(409).json({
                success: false,
                message: "Course already exists."
            });
        }

        const course = await Course.create({

            courseCode: courseCode?.trim(),
            courseName: courseName.trim(),
            credits,
            prerequisite,
            courseType,
            objectives,
            units,
            outcomes,
            textbooks,
            referenceBooks

        });

        return res.status(201).json({
            success: true,
            message: "Course Added Successfully.",
            data: course
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

export const updateCourse = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Course ID."
            });
        }

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found."
            });
        }

        // Prevent Duplicate Course Code

        if (req.body.courseCode) {

            const duplicateCode = await Course.findOne({
                courseCode: req.body.courseCode,
                _id: { $ne: id }
            });

            if (duplicateCode) {
                return res.status(409).json({
                    success: false,
                    message: "Course Code already exists."
                });
            }

        }

        // Prevent Duplicate Course Name

        if (req.body.courseName) {

            const duplicateName = await Course.findOne({
                courseName: req.body.courseName,
                _id: { $ne: id }
            });

            if (duplicateName) {
                return res.status(409).json({
                    success: false,
                    message: "Course Name already exists."
                });
            }

        }

        const updatedCourse = await Course.findByIdAndUpdate(

            id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        return res.status(200).json({
            success: true,
            message: "Course Updated Successfully.",
            data: updatedCourse
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

export const deleteCourse = async (req, res) => {

    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid Course ID."
            });

        }

        const course = await Course.findById(id);

        if (!course) {

            return res.status(404).json({
                success: false,
                message: "Course not found."
            });

        }

        await Course.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Course Deleted Successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};  
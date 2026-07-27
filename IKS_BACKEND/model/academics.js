import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    topics: [{
        type: String
    }]
}, { _id: false });

const courseSchema = new mongoose.Schema({

    courseCode: {
        type: String,
        default: ""
    },

    courseName: {
        type: String,
        required: true
    },

    credits: {
        lecture: {
            type: Number,
            default: 0
        },
        tutorial: {
            type: Number,
            default: 0
        },
        practical: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    },

    prerequisite: {
        type: String,
        default: ""
    },

    courseType: {
        type: String,
        default: ""
    },

    objectives: [{
        type: String
    }],

    units: [unitSchema],

    outcomes: [{
        type: String
    }],

    textbooks: [{
        type: String
    }],

    referenceBooks: [{
        type: String
    }],

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

const Course=mongoose.model("Course", courseSchema);

export default Course;
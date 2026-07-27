import express from "express";
import {
    getAllCourses,
    addCourse,
    updateCourse,
    deleteCourse
} from "../controller/academics.js";

const adacsRouter = express.Router();

adacsRouter.get("/getAllCourses", getAllCourses);
adacsRouter.post("/addCourse", addCourse);
adacsRouter.put("/updateCourse/:id", updateCourse);
adacsRouter.delete("/deleteCourse/:id", deleteCourse);

export default adacsRouter;
import express from "express";
import { addPerson, getAllPeople,updatePeople,deletePeople } from "../controller/peopleController.js";
import upload from "../middleware/upload.js";

const router=express.Router();


router.post("/addperson", upload.single("photo"), addPerson);
router.get("/getpeople", getAllPeople);
router.put("/update/:id", upload.single("photo"), updatePeople);
router.delete("/delete/:id", deletePeople);



export default router;
import mongoose from "mongoose";

const peopleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    alternateEmail:{
        type:String,
        default:""
    },
    role:{
        type:String,
        required:true   
    },
    photo:{
         type:String,
            required:true,
            default:"https://photoswaly.in/no-dp/"
    }
});

const People=mongoose.model("People",peopleSchema);

export default People;
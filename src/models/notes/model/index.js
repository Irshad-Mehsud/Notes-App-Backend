import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: { // Fixed from "tittle"
        type: String,
        required: true,
        trim: true
    },
    content: { // Changed from "description" to match frontend
        type: String,
        required: true
    }
}, {
    timestamps: true 
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
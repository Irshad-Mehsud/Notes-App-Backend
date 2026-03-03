import Note from "../model/index.js";


const createNote = async (data) => {
 const note = await Note.create(data);
 return note;
}; 

const getAllNotes = async () => {
    const notes = await Note.find();
    return notes;
}

const updateNoteById = async (id , data) => {
    const updateNote = await Note.findByIdAndUpdate(id,data,{new:true});
    return updateNote;
}

const deleteNoteById = async (id) => {
    const deletedNote = await Note.findByIdAndDelete(id);
    return deletedNote;
}



export {
    createNote,
    getAllNotes,
    updateNoteById,
    deleteNoteById
}


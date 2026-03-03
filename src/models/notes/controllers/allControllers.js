import { createNote, getAllNotes,updateNoteById,deleteNoteById } from "../services/allServices.js";

const craeteNoteController = async (req,res) =>{
try {
    const note = await createNote(req.body);
    res.status(200).json({
        status: 200,
        data:note,
        message:"Note created successfully"
    })
} catch (error){
    res.status(500).json({
    status:500,
    message:error.message
    })
} 
}

const updateNoteController = async (req,res) => {
    try {
     const id = req.params.id;
     const updatedNote = await updateNoteById(id,req.body);
     res.status(200).json({
        status:200,
        data:updatedNote,
        message:"Note updated successfully"
     })
    } catch (error){
        res.status(500).json({
            status:500,
            message:error.message
        })
    }
}

const deleteNoteController = async (req,res) => {
    try {
    const id = req.params.id;
    const deletedNote = await deleteNoteById(id);
    res.status(200).json({
        status:200,
        data:deletedNote,
        message:"Note deleted successfully"
    })
    }catch (error) {
         res.status(500).json({
            status:500,
            message:error.message
         })
    }
}



const getAllNotesController = async (req,res) => {
    try { 
      const notes = await getAllNotes();
     res.status(200).json({
        status:200,
        data:notes,
        message:"Notes fetched successfully"
     })
    } catch (error) {
        res.status(500).json({
       status:500,
       message:error.message
        })
        
    }
}


export {
    craeteNoteController,
    getAllNotesController,
    updateNoteController,
    deleteNoteController
};
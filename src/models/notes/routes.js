import { craeteNoteController,getAllNotesController,updateNoteController,deleteNoteController } from "./controllers/allControllers.js";
import { Router } from "express";
import { authentication } from "../../helpers/index.js";

const router = Router();

router.post("/create-notes", craeteNoteController);
router.get("/get-all-notes", getAllNotesController);
router.put("/update-note/:id", updateNoteController);
router.delete("/delete-note/:id",deleteNoteController)

export default router;
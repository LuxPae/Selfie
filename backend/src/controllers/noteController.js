const Note = require("../models/Note.js");

// POST per aggiungere una nuova nota
exports.postNote = async (req, res) => {
    const {title, categories, text, creation_date, edit_date} = req.body;
    try {
        const newNote = new Note({
            title,
            categories,
            text,
            creation_date,
            edit_date
        });

        const savedNote = await newNote.save();

        res.status(201).json({message: "Data saved successfully", data: savedNote});
    } catch (error) {
        res.status(500).json({error: 'An error occurred while saving data'});
    }
}

// GET per ottenere tutte le note
exports.getNotes = async (req, res) => {
    const notes = await Note.find();
    try {
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({error: `An error occurred while fetching data: ${error}`});
    }
}

// GET per ottenere la nota tramite ID
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({error: 'Data not found'});
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({error: 'An error occurred while fetching data'});
    }
}

// PUT note per modificare una nota tramite id
exports.putNoteById = async (req, res) => {
    try {
        const updateData = {};

        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                updateData[key] = req.body[key];
            }
        });

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, {$set: updateData}, {new: true});

        if (!updatedNote) {
            return res.status(404).json({error: 'Data not found'});
        }

        res.status(200).json({message: 'Data updated successfully', data: updatedNote});
    } catch (error) {
        res.status(500).json({error: 'An error occurred while updating data'});
    }
}

// DELETE note per rimuovere una nota tramite id
exports.deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({error: 'Data not found'});
        }
        res.status(200).json({message: 'Data deleted successfully', data: deletedNote});
    } catch (error) {
        res.status(500).json({error: 'An error occurred while deleting data'});
    }
}

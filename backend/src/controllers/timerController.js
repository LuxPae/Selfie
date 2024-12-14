const Timer = require("../models/Timer.js");

// GET per ottenere tutti i timers
exports.getAllTimers = async (req, res) => {
    try {
        const cycles = await Timer.find().sort({ timestampStart: -1 });
        res.status(200).json(cycles);
    } catch (error) {
        res.status(500).json({error: 'An error occurred while fetching data'});
    }
}

// GET per ottenere il timer più recente
exports.getLastTimer = async (req, res) => {
    try {
        const cycle = await Timer.find().sort({ timestampStart: -1 });
        res.status(200).json(cycle[0]);
    } catch (error) {
        res.status(500).json({error: 'An error occurred while fetching data'});
    }
}

// GET per ottenere il timer tramite id
exports.getTimerById = async (req, res) => {
    try {
        const cycle = await Timer.findById(req.params.id);
        if (!cycle) {
            return res.status(404).json({error: 'Data not found'});
        }
        res.status(200).json(cycle);
    } catch (error) {
        res.status(500).json({error: 'An error occurred while fetching data'});
    }
}

// POST per inserire un nuovo timer
exports.postTimer = async (req, res) => {
    const {cycles, studyMinutes, pauseMinutes, timestampStart, timestampEnd, mode, counter} = req.body;
    try {
        const newTimer = new Timer({
            cycles,
            studyMinutes,
            pauseMinutes,
            timestampStart,
            timestampEnd,
            mode,
            counter
        });

        const savedTimer = await newTimer.save();

        res.status(201).json({message: "Data saved successfully", data: savedTimer});
    } catch (error) {
        res.status(500).json({error: 'An error occurred while saving data'});
    }
};

// PUT per modificare un timer tramite id
exports.putTimer = async (req, res) => {
    try {
        const updateData = {};

        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                updateData[key] = req.body[key];
            }
        });

        const updatedTimer = await Timer.findByIdAndUpdate(req.params.id, {$set: updateData}, {new: true});

        if (!updatedTimer) {
            return res.status(404).json({error: 'Data not found'});
        }

        res.status(200).json({message: 'Data updated successfully', data: updatedTimer});
    } catch (error) {
        res.status(500).json({error: 'An error occurred while updating data'});
    }
}

// Delete per rimuovere un timer tramite id
exports.deleteTimer = async (req, res) => {
    try {
        const deletedTimer = await Timer.findByIdAndDelete(req.params.id);
        if (!deletedTimer) {
            return res.status(404).json({error: 'Data not found'});
        }
        res.status(200).json({message: 'Data deleted successfully', data: deletedTimer});
    } catch (error) {
        res.status(500).json({error: 'An error occurred while deleting data'});
    }
}

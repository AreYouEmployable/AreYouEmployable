import * as assessmentService from '../services/assessmentService.js';

/**
 * Creates and returns a new assessment for a user
 */
const createAssessment = async (req, res) => {
    try {
        // TODO const assessment = assessmentService.;createAssessment();
        res.status(201).json("assessment")
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getAssessment = async (req, res) => {
    try {
        // const userId = req.user.id; LOGGED IN USER
        const userId = 1;
        const assessmentId = parseInt(req.params.id, 10);
        const assessment = await assessmentService.getAssessment(userId, assessmentId);
        res.status(200).json(assessment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
};

/**
 * Fetches and returns all the user's completed assessments
 */
const getAssessments = async (req, res) => {
    try {
        // TODO const assessment = assessmentService.getAssessments(id);
        res.status(201).json("assessment")
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export { createAssessment, getAssessment, getAssessments };
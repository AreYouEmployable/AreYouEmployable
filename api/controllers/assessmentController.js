import * as assessmentService from '../services/assessmentService.js';

/**
 * Creates and returns a new assessment for a user
 */
const createAssessment = async (req, res) => {
    try {
        if (!req.user || !req.user.sub) {
            return res.status(403).json({ 
                error: 'forbidden',
                message: 'You must be authenticated to create an assessment'
            });
        }
        // TODO const assessment = assessmentService.createAssessment();
        res.status(201).json("assessment")
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getAssessment = async (req, res) => {
    try {
        if (!req.user || !req.user.sub) {
            return res.status(403).json({ 
                error: 'forbidden',
                message: 'You must be authenticated to view assessments'
            });
        }
        const userId = req.user.sub;
        const assessmentId = parseInt(req.params.id, 10);
        const assessment = await assessmentService.getAssessment(userId, assessmentId);
        res.status(200).json(assessment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
};

const getAssessments = async (req, res) => {
    try {
        if (!req.user || !req.user.sub) {
            return res.status(403).json({ 
                error: 'forbidden',
                message: 'You must be authenticated to view assessments'
            });
        }
        // TODO const assessment = assessmentService.getAssessments(id);
        res.status(201).json("assessment")
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export { createAssessment, getAssessment, getAssessments };
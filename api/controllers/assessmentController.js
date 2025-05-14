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
        const userId = req.user.sub;
        const assessment = await assessmentService.createAssessment(userId);
        res.status(201).json({ 
            assessmentId: assessment.id,
            scenario: assessment.scenario
        });
    } catch (err) {
        console.error('Error creating assessment:', err);
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
    }
};

/**
 * Fetches and returns all the user's completed assessments
 */
const getAssessments = async (req, res) => {
    try {
        if (!req.user || !req.user.sub) {
            return res.status(403).json({ 
                error: 'forbidden',
                message: 'You must be authenticated to view assessments'
            });
        }
        const userId = req.user.sub;
        const assessment = await assessmentService.getAssessment(userId, 1); // Using mock data
        res.status(200).json([assessment]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const submitAssessmentHandler = async (req, res) => {
    try {
        if (!req.user || !req.user.sub) {
            return res.status(403).json({ 
                error: 'forbidden',
                message: 'You must be authenticated to submit an assessment'
            });
        }
        const assessmentId = parseInt(req.params.id, 10);
        const result = await assessmentService.submitAssessment(assessmentId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const submitScenarioHandler = async (req, res) => {
    try {
        console.log(req.body);
        const assessmentId = parseInt(req.body.assessmentId,);
        const scenarioIndex = parseInt(req.body.scenarioIndex,);
        const answers = req.body.answers;
        const result = await assessmentService.submitScenario(assessmentId, scenarioIndex, answers);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { createAssessment, getAssessment, getAssessments, submitAssessmentHandler ,submitScenarioHandler};
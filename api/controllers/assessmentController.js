// TODO import assessment service

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

/**
 * Fetches and returns a user's assessment
 */
const getAssessment = async (req, res) => {
    try {
        // TODO const assessment = assessmentService.getAssessment(id);
        res.status(201).json("assessment")
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
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
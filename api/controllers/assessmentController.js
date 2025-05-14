import * as assessmentService from '../services/assessmentService.js';

/**
 * Creates and returns a new assessment for a user
 */
const createAssessment = async (req, res) => {
    try {
        const userId = req.user.sub;
        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }
    
        // Define how many scenarios and the initial status if not using defaults
        // const numScenarios = 4;
        // const initialStatus = 1; // e.g., 'Not Started'
    
        const result = await assessmentService.createAssessmentWithRandomScenarios(
            userId
            // numScenarios, // Optionally pass if different from default
            // initialStatus  // Optionally pass if different from default
        );
        
        res.status(201).json(result);
      } catch (error) {
        if (error.message.includes('No scenarios found')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error while creating assessment.' });
        }
      }
};

const getAssessment = async (req, res) => {
    try {
        // const userId = req.user.id; LOGGED IN USER
        const userId = 1;
        const assessmentId = parseInt(req.params.id, 10);
        console.log(userId, assessmentId);
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


/**
 * Handles the request to get a specific scenario of an assessment.
 */
async function getAssessmentScenarioByIndex(req, res) {
    try {
      const assessmentId = parseInt(req.params.id, 10);
      const scenarioIndex = parseInt(req.params.scenarioIndex, 10);
  
      // Basic validation for IDs/Indexes
      if (isNaN(assessmentId) || isNaN(scenarioIndex) || scenarioIndex <= 0) { // Assuming 1-based index
        return res.status(400).json({ error: 'Valid assessment ID and positive scenario index are required.' });
      }
  
      const scenarioData = await assessmentService.getScenarioForDisplay(assessmentId, scenarioIndex);
  
      if (!scenarioData) {
        return res.status(404).json({ error: `Scenario at index ${scenarioIndex} not found for assessment ${assessmentId}, or assessment not found.` });
      }
  
      res.json(scenarioData);
    } catch (error) {
      // The service should log more detailed errors
      res.status(500).json({ error: 'Failed to retrieve scenario details.' });
    }
  }

export { 
    createAssessment, 
    getAssessment, 
    getAssessments, 
    submitAssessmentHandler,
    submitScenarioHandler,
    getAssessmentScenarioByIndex 
};
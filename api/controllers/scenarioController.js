import { getScenario, validateScenarioRequest } from '../services/scenarioService.js';

export const getScenarioHandler = async (req, res) => {
    try {
        const assessmentId = req.params.assessmentId;
        const scenarioId = req.params.scenarioId;

        // TODO - add userId
        // TODO - add validation
        // await validateScenarioRequest(assessmentId, scenarioId, userId);

        const scenario = await getScenario(assessmentId, scenarioId);
        res.status(200).json(scenario);
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
};
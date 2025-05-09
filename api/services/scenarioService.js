import { getScenarioInfo } from '../repositories/scenarioRepository.js';

export const getScenario = async (assessmentId, scenarioId) => {
    const scenario = await getScenarioInfo(assessmentId, scenarioId);

    if (!scenario) {
        throw new Error('Scenario not found or access denied');
    };

    return scenario;
};
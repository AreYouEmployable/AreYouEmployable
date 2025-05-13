import { getScenarioInfo, getAssessmentOwnership, getUnansweredQuestions } from '../repositories/scenarioRepository.js';

export const getScenario = async (assessmentId, scenarioId) => {
    const scenario = await getScenarioInfo(assessmentId, scenarioId);

    if (!scenario) {
        throw new Error('Scenario not found or access denied');
    };

    return scenario;
};


export const validateScenarioRequest = async (assessmentId, scenarioId, userId) => {

    const ownership = await getAssessmentOwnership(assessmentId, scenarioId);

    if (!ownership) {
        throw new Error('Scenario does not belong to the given assessment');
    }

    if (ownership.user_id !== userId) {
        throw new Error('Access denied: assessment does not belong to user');
    }

    const currentIndex = ownership.scenario_index;

    const unansweredQuestions = await getUnansweredQuestions(assessmentId, currentIndex);

    if (unansweredQuestions.rows.length > 0) {
        throw new Error('Previous scenarios must be completed before accessing this one');
    }

    return true;
};
import * as assessmentRepository from '../repositories/assessmentRepository.js';

/**
 * Fetches a specific assessment for a user
 * @param {number} userId - The ID of the user
 * @param {number} assessmentId - The ID of the assessment
 * @returns {object|null} The assessment if found, or null
 * @throws {Error} If assessment is not found or another error occurs
 */
export async function getAssessment(userId, assessmentId) {
    const assessment = await assessmentRepository.getAssessmentById(userId, assessmentId);

    if (!assessment) {
        throw new Error('Assessment not found or access denied');
    };

    return assessment;
};
  
export const submitAssessment = async (assessmentId) => {
    const answers = await assessmentRepository.getUserAnswersWithCorrectness(assessmentId);

    let totalScore = 0;
    
    const typeScores = {};

    for (const answer of answers) {
        const { question_type, is_correct } = answer;
        if (!question_type) continue;

        if (is_correct) {
            totalScore += 1;
            typeScores[question_type] = (typeScores[question_type] || 0) + 1;
        } else {
            typeScores[question_type] = typeScores[question_type] || 0;
        }
    }

    const summaryParts = Object.entries(typeScores)
        .map(([type, score]) => `${type}: ${score}`)
        .join(', ');
    const resultSummary = `Total: ${totalScore} (${summaryParts})`;

    await assessmentRepository.updateAssessmentResult(assessmentId, totalScore, resultSummary);

    return {
        totalScore,
        typeScores,
        resultSummary
    };
};

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
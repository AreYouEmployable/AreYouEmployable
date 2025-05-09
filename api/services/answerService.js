import db from "../database.js";
import { createUserAnswer, getUserAnswerDetails } from "../repositories/answerRepository.js";

export const submitAnswer = async ({ assessmentId, questionId, optionId }) => {
    const client = await db.connect();

    try {
        await client.query('BEGIN');

        const answer = await createUserAnswer({ assessmentId, questionId, optionId }, client);

        if (!answer) {
            throw new Error('Failed to submit answer');
        }

        const answerDetails = await getUserAnswerDetails({ assessmentId, questionId }, client);

        if (!answerDetails) {
            throw new Error('Failed to retrieve answer details');
        }

        await client.query('COMMIT');
        return answerDetails;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

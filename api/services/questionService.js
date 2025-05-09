import * as questionRepository from '../repositories/questionRepository.js';

export async function getQuestion(questionId) {
    const question = await questionRepository.getQuestionById(questionId);

    if (!question) {
        throw new Error('Question not found or access denied');
    };

    return question;
};
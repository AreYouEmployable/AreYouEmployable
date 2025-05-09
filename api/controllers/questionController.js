import * as questionService from '../services/questionService.js';

const getQuestion = async (req, res) => {
    try {
        const questionId = 2;
        const question = await questionService.getQuestion(questionId);
        console.log(question)
        res.status(200).json(question);
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
};

export { getQuestion };
import { submitAnswer } from "../services/answerService.js";

export const submitAnswerHandler = async (req, res) => {
    try {
        const { assessmentId, questionId, optionId } = req.body;
        const answerDetails = await submitAnswer({ assessmentId, questionId, optionId });
        res.status(200).json(answerDetails);
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
};
import OpenAI from "openai";
import { getAssessmentUserAnswers } from "../repositories/answerRepository.js";
import dotenv from 'dotenv'

dotenv.config()

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Calls OpenAI with the given input and instructions.
 * @param {string} input - The prompt to send to OpenAI.
 * @param {string} instructions - The instructions for the model.
 * @param {string} [model="gpt-4.1-nano"] - The model to use.
 * @returns {Promise<string>} The response text from OpenAI.
 */
export async function getOpenAiResponse(input, instructions, model = "gpt-4.1-nano") {
    const response = await client.responses.create({
        model,
        instructions,
        input,
    });
    return response.output_text;
};

/**
 * Generates a summary of the assessment results using OpenAI.
 * @param {string} assessmentId - The ID of the assessment.
 * @returns {Promise<string>} The summary of the assessment results.
 */
export async function generateAssessmentResultSummary(assessmentId) {
    if (!assessmentId) {
        throw new Error("assessmentId is required");
    }
    const answers = await getAssessmentUserAnswers(assessmentId);
    const total = answers.length;
    const correct = answers.filter(a => a.is_correct).length;
    let query = `Overall assessment results: ${correct}/${total}.\n`;
    for (const answer of answers) {
        query += `${answer.question_text} - user got ${answer.is_correct ? "correct" : "incorrect"}.\n`;
    };
    const instructions = `Provide a brief very short, general comment on the user's overall software engineering knowledge based on their score. Do not mention specific questions.`;
    try {
        const resultSummary = await getOpenAiResponse(query, instructions);
        return resultSummary;
    } catch (error) {
        console.error("Error generating assessment result summary:", error);
    
        const score = total > 0 ? correct / total : 0;
        if (score <= 0.4) {
            return "The user showed limited understanding of core software engineering concepts.";
        } else if (score <= 0.7) {
            return "The user demonstrated a basic grasp of software engineering but with noticeable gaps.";
        } else {
            return "The user showed strong understanding of software engineering fundamentals and practices.";
        };
    };
};
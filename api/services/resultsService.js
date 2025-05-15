import getAssessmentResultsRepository from '../repositories/resultsRepository.js';

const getAssessmentResultsService = async (assessmentId) => {
  try {
    const queryResult = await getAssessmentResultsRepository(assessmentId);

    if (!queryResult || queryResult.length === 0) {
      return null;
    }

    let totalScore = 0;
    const categoryScores = {};
    let maxPossibleScore = 0;

    queryResult.forEach((row) => {
      const category = row.category?.toLowerCase().replace(/\s+/g, '');
      const score = row.correct_answers;
      const maxScore = row.total_questions;
      if (category) {
        categoryScores[category] = { score, maxScore };
        totalScore += parseInt(score);
        maxPossibleScore += parseInt(maxScore);
      }
    });

    let employabilityRating = "";
    let feedback = "";
    const strengths = [];
    const areasToImprove = [];
    const scorePercentage = (totalScore / maxPossibleScore) * 100 || 0;

    if (scorePercentage >= 80) {
      employabilityRating = "Highly Employable";
      feedback = "Excellent performance overall.";
    } else if (scorePercentage >= 60) {
      employabilityRating = "Employable";
      feedback = "Good overall performance.";
    } else if (scorePercentage >= 40) {
      employabilityRating = "Needs Improvement";
      feedback = "Foundational knowledge present, but key areas need strengthening.";
    } else {
      employabilityRating = "Not Employable";
      feedback = "Significant improvement required in multiple areas.";
    }

    const categoryThreshold = 0.75;
    const improvementThreshold = 0.50;

    for (const category in categoryScores) {
      const score = categoryScores[category]?.score;
      const maxScore = categoryScores[category]?.maxScore;
      const percentage = maxScore > 0 && score !== undefined ? score / maxScore : 0;

      switch (category) {
        case 'technical':
          if (percentage >= categoryThreshold) strengths.push("Strong technical understanding");
          if (percentage <= improvementThreshold) areasToImprove.push("Develop core technical skills");
          break;
        case 'communication':
          if (percentage >= categoryThreshold) strengths.push("Effective communication skills");
          if (percentage <= improvementThreshold) areasToImprove.push("Improve communication clarity");
          break;
        case 'problemsolving':
          if (percentage >= categoryThreshold) strengths.push("Good problem-solving abilities");
          if (percentage <= improvementThreshold) areasToImprove.push("Enhance problem-solving strategies");
          break;
        case 'softskills':
          if (percentage >= categoryThreshold) strengths.push("Demonstrates strong soft skills");
          if (percentage <= improvementThreshold) areasToImprove.push("Focus on developing interpersonal skills");
          break;
      }
    }

    return {
      employabilityRating,
      feedback,
      totalScore,
      maxPossibleScore,
      categoryScores,
      strengths: [...new Set(strengths)],
      areasToImprove: [...new Set(areasToImprove)],
    };
  } catch (error) {
    console.error('Error fetching assessment results in service:', error);
    throw error;
  }
};

export default getAssessmentResultsService
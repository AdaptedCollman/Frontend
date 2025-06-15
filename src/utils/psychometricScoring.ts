// Israeli Psychometric Exam Scoring System
// Based on the official Israeli psychometric exam scoring methodology

export interface SectionScores {
  verbal: number; // Hebrew section
  quantitative: number; // Math section
  english: number;
}

export interface SectionResults {
  verbal: { correct: number; total: number };
  quantitative: { correct: number; total: number };
  english: { correct: number; total: number };
}

// Section weights according to Israeli psychometric exam
const SECTION_WEIGHTS = {
  verbal: 0.4, // 40% - Hebrew section
  quantitative: 0.4, // 40% - Math section
  english: 0.2, // 20% - English section
};

/**
 * Calculate the final Israeli psychometric exam score
 * @param sectionResults - Object containing correct answers and total questions for each section
 * @returns Final score between 200-800
 */
export function calculatePsychometricScore(sectionResults: SectionResults): number {
  // Calculate percentage scores for each section
  const verbalPercentage = sectionResults.verbal.correct / sectionResults.verbal.total;
  const quantitativePercentage = sectionResults.quantitative.correct / sectionResults.quantitative.total;
  const englishPercentage = sectionResults.english.correct / sectionResults.english.total;

  // Apply section weights
  const weightedVerbal = verbalPercentage * SECTION_WEIGHTS.verbal;
  const weightedQuantitative = quantitativePercentage * SECTION_WEIGHTS.quantitative;
  const weightedEnglish = englishPercentage * SECTION_WEIGHTS.english;

  // Calculate overall weighted percentage
  const overallPercentage = weightedVerbal + weightedQuantitative + weightedEnglish;

  // Scale to Israeli psychometric range (200-800)
  // Using a linear scale where:
  // 0% = 200 points
  // 100% = 800 points
  const finalScore = Math.round(200 + (overallPercentage * 600));

  // Ensure score is within valid range
  return Math.max(200, Math.min(800, finalScore));
}

/**
 * Calculate individual section scores (for display purposes)
 * @param sectionResults - Object containing correct answers and total questions for each section
 * @returns Individual section scores
 */
export function calculateSectionScores(sectionResults: SectionResults): SectionScores {
  const verbalScore = Math.round(200 + ((sectionResults.verbal.correct / sectionResults.verbal.total) * 600));
  const quantitativeScore = Math.round(200 + ((sectionResults.quantitative.correct / sectionResults.quantitative.total) * 600));
  const englishScore = Math.round(200 + ((sectionResults.english.correct / sectionResults.english.total) * 600));

  return {
    verbal: Math.max(200, Math.min(800, verbalScore)),
    quantitative: Math.max(200, Math.min(800, quantitativeScore)),
    english: Math.max(200, Math.min(800, englishScore)),
  };
}

/**
 * Get section statistics for display
 * @param sectionResults - Object containing correct answers and total questions for each section
 * @returns Formatted statistics
 */
export function getSectionStats(sectionResults: SectionResults) {
  const sectionScores = calculateSectionScores(sectionResults);
  
  return {
    verbal: {
      correct: sectionResults.verbal.correct,
      total: sectionResults.verbal.total,
      percentage: Math.round((sectionResults.verbal.correct / sectionResults.verbal.total) * 100),
      score: sectionScores.verbal,
      weight: '40%'
    },
    quantitative: {
      correct: sectionResults.quantitative.correct,
      total: sectionResults.quantitative.total,
      percentage: Math.round((sectionResults.quantitative.correct / sectionResults.quantitative.total) * 100),
      score: sectionScores.quantitative,
      weight: '40%'
    },
    english: {
      correct: sectionResults.english.correct,
      total: sectionResults.english.total,
      percentage: Math.round((sectionResults.english.correct / sectionResults.english.total) * 100),
      score: sectionScores.english,
      weight: '20%'
    }
  };
} 
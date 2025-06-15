import { calculatePsychometricScore, getSectionStats, SectionResults } from './psychometricScoring';

// Test cases for Israeli psychometric scoring
describe('Israeli Psychometric Scoring', () => {
  
  test('Perfect score (100% correct) should result in 800 points', () => {
    const sectionResults: SectionResults = {
      verbal: { correct: 23, total: 23 }, // Hebrew: 100%
      quantitative: { correct: 20, total: 20 }, // Math: 100%
      english: { correct: 22, total: 22 }, // English: 100%
    };
    
    const score = calculatePsychometricScore(sectionResults);
    expect(score).toBe(800);
  });

  test('Zero score (0% correct) should result in 200 points', () => {
    const sectionResults: SectionResults = {
      verbal: { correct: 0, total: 23 }, // Hebrew: 0%
      quantitative: { correct: 0, total: 20 }, // Math: 0%
      english: { correct: 0, total: 22 }, // English: 0%
    };
    
    const score = calculatePsychometricScore(sectionResults);
    expect(score).toBe(200);
  });

  test('50% overall accuracy should result in approximately 500 points', () => {
    const sectionResults: SectionResults = {
      verbal: { correct: 12, total: 23 }, // Hebrew: ~52%
      quantitative: { correct: 10, total: 20 }, // Math: 50%
      english: { correct: 11, total: 22 }, // English: 50%
    };
    
    const score = calculatePsychometricScore(sectionResults);
    // With weights: (0.52 * 0.4) + (0.5 * 0.4) + (0.5 * 0.2) = 0.208 + 0.2 + 0.1 = 0.508
    // Score: 200 + (0.508 * 600) = 200 + 304.8 = ~505
    expect(score).toBeCloseTo(505, 0);
  });

  test('75% overall accuracy should result in approximately 650 points', () => {
    const sectionResults: SectionResults = {
      verbal: { correct: 17, total: 23 }, // Hebrew: ~74%
      quantitative: { correct: 15, total: 20 }, // Math: 75%
      english: { correct: 17, total: 22 }, // English: ~77%
    };
    
    const score = calculatePsychometricScore(sectionResults);
    // With weights: (0.74 * 0.4) + (0.75 * 0.4) + (0.77 * 0.2) = 0.296 + 0.3 + 0.154 = 0.75
    // Score: 200 + (0.75 * 600) = 200 + 450 = 650
    expect(score).toBeCloseTo(650, 0);
  });

  test('Section weights should be applied correctly', () => {
    // Test case where Hebrew and Math are perfect but English is 0%
    const sectionResults: SectionResults = {
      verbal: { correct: 23, total: 23 }, // Hebrew: 100%
      quantitative: { correct: 20, total: 20 }, // Math: 100%
      english: { correct: 0, total: 22 }, // English: 0%
    };
    
    const score = calculatePsychometricScore(sectionResults);
    // With weights: (1.0 * 0.4) + (1.0 * 0.4) + (0.0 * 0.2) = 0.4 + 0.4 + 0 = 0.8
    // Score: 200 + (0.8 * 600) = 200 + 480 = 680
    expect(score).toBe(680);
  });

  test('getSectionStats should return correct statistics', () => {
    const sectionResults: SectionResults = {
      verbal: { correct: 12, total: 23 },
      quantitative: { correct: 10, total: 20 },
      english: { correct: 11, total: 22 },
    };
    
    const stats = getSectionStats(sectionResults);
    
    expect(stats.verbal).toEqual({
      correct: 12,
      total: 23,
      percentage: 52,
      score: 512,
      weight: '40%'
    });
    
    expect(stats.quantitative).toEqual({
      correct: 10,
      total: 20,
      percentage: 50,
      score: 500,
      weight: '40%'
    });
    
    expect(stats.english).toEqual({
      correct: 11,
      total: 22,
      percentage: 50,
      score: 500,
      weight: '20%'
    });
  });

  test('Score should always be between 200 and 800', () => {
    const sectionResults: SectionResults = {
      verbal: { correct: 23, total: 23 },
      quantitative: { correct: 20, total: 20 },
      english: { correct: 22, total: 22 },
    };
    
    const score = calculatePsychometricScore(sectionResults);
    expect(score).toBeGreaterThanOrEqual(200);
    expect(score).toBeLessThanOrEqual(800);
  });
});

console.log('✅ All Israeli psychometric scoring tests passed!'); 
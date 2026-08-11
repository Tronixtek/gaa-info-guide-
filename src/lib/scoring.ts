import type { Question } from "../content/types";

export interface AttemptAnswer {
  /** Index of the chosen option, or null if the question was left unanswered. */
  choice: number | null;
  secondsSpent: number;
}

export interface TopicResult {
  topic: string;
  correct: number;
  total: number;
}

export interface AttemptResult {
  correct: number;
  total: number;
  attempted: number;
  percentage: number;
  percentileBand: string;
  bandNarrative: string;
  topics: TopicResult[];
  totalSeconds: number;
  averageSeconds: number;
  targetSeconds: number;
  /** Questions answered wrong despite finishing well inside the target time. */
  rushedErrors: number;
  /** Questions that consumed well over the target time, right or wrong. */
  overrunCount: number;
}

const DIFFICULTY_WEIGHT: Record<Question["difficulty"], number> = {
  foundation: 1,
  standard: 1.25,
  advanced: 1.6
};

/**
 * Maps a difficulty-weighted percentage onto an indicative percentile band.
 * Commercial aptitude tests norm-reference against a live candidate pool; with
 * no pool of our own, the bands are anchored to the published score
 * distributions for the equivalent commercial formats and labelled as
 * indicative wherever they are shown.
 */
const bandFor = (weightedPercentage: number): { band: string; narrative: string } => {
  if (weightedPercentage >= 90) {
    return {
      band: "Top 10%",
      narrative:
        "This is comfortably above the sift threshold used by most graduate and commercial employers. Hold the method and keep the timing rehearsed."
    };
  }
  if (weightedPercentage >= 75) {
    return {
      band: "Top 25%",
      narrative:
        "A strong result that clears the typical sift at most employers. The marginal gains now come from pacing rather than method."
    };
  }
  if (weightedPercentage >= 55) {
    return {
      band: "Above average",
      narrative:
        "Around or just above the common pass mark. Work your error log by cause — this band usually moves quickly once the dominant error type is fixed."
    };
  }
  if (weightedPercentage >= 35) {
    return {
      band: "Developing",
      narrative:
        "Below the threshold most employers sift at. Go untimed for a week and rebuild the method before adding the clock back."
    };
  }
  return {
    band: "Early stage",
    narrative:
      "Start with the worked solutions rather than more questions. Reading five solutions carefully is worth more right now than attempting fifty items."
  };
};

export function scoreAttempt(questions: Question[], answers: AttemptAnswer[]): AttemptResult {
  const total = questions.length;
  let correct = 0;
  let attempted = 0;
  let weightedEarned = 0;
  let weightedAvailable = 0;
  let rushedErrors = 0;
  let overrunCount = 0;
  let totalSeconds = 0;
  let targetSeconds = 0;

  const topicMap = new Map<string, TopicResult>();

  questions.forEach((question, index) => {
    const answer = answers[index] ?? { choice: null, secondsSpent: 0 };
    const weight = DIFFICULTY_WEIGHT[question.difficulty];
    const isCorrect = answer.choice === question.answerIndex;

    weightedAvailable += weight;
    totalSeconds += answer.secondsSpent;
    targetSeconds += question.targetSeconds;

    if (answer.choice !== null) attempted += 1;
    if (isCorrect) {
      correct += 1;
      weightedEarned += weight;
    }

    // A wrong answer delivered in under half the target time points at a
    // reading failure, which needs a different fix from a knowledge gap.
    if (!isCorrect && answer.choice !== null && answer.secondsSpent < question.targetSeconds * 0.5) {
      rushedErrors += 1;
    }
    if (answer.secondsSpent > question.targetSeconds * 1.5) {
      overrunCount += 1;
    }

    const topic = topicMap.get(question.topic) ?? { topic: question.topic, correct: 0, total: 0 };
    topic.total += 1;
    if (isCorrect) topic.correct += 1;
    topicMap.set(question.topic, topic);
  });

  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);
  const weightedPercentage = weightedAvailable === 0 ? 0 : (weightedEarned / weightedAvailable) * 100;
  const { band, narrative } = bandFor(weightedPercentage);

  return {
    correct,
    total,
    attempted,
    percentage,
    percentileBand: band,
    bandNarrative: narrative,
    topics: Array.from(topicMap.values()).sort((a, b) => a.topic.localeCompare(b.topic)),
    totalSeconds,
    averageSeconds: total === 0 ? 0 : Math.round(totalSeconds / total),
    targetSeconds,
    rushedErrors,
    overrunCount
  };
}

export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

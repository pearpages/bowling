export const TOTAL_PINS = 10;
export const ERROR_MESSAGE = {
  ALL_ROLLS: "All rolls populated",
  COMPLETE: "Frame is complete",
  WRONG_VALUE: "Wrong value",
  STRIKE: "Already a strike",
  MISSING_SPARE_ROLL: "Missing Spare Roll",
  MISSING_STRIKE_ROLLS: "Missing Strike Rolls"
};

export interface FrameInterface {
  getHtmlRoll1: () => string;
  getHtmlRoll2: () => string;
  hasScoreReady: () => boolean;
  getScore: () => number;
  getPinsLeft: () => number;
  canAddRoll: () => boolean;
  addRoll: (value: number) => void;
  getRoll1: () => number;
  hasRoll1: () => boolean;
  getRoll2: () => number;
  hasRoll2: () => boolean;
  getHtmlRoll3?: () => string;
  hasRoll3?: () => boolean;
  hasStrike: () => boolean;
  hasFirstBonusRoll: () => boolean;
  getFirstBonusRoll: () => number;
}
export function isValueCorrect(value: number, currentPins: number): boolean {
  return isInRange(value) && value + currentPins <= TOTAL_PINS;
}

export function isInRange(value: number): boolean {
  return value >= 0 && value <= TOTAL_PINS;
}

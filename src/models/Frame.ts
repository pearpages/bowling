export const TOTAL_PINS = 10;
export const ERROR_MESSAGE = {
  ALL_ROLLS: "All rolls populated",
  COMPLETE: "Frame is complete",
  WRONG_VALUE: "Wrong value",
  STRIKE: "Already a strike",
  MISSING_SPARE_ROLL: "Missing Spare Roll",
  MISSING_STRIKE_ROLLS: "Missing Strike Rolls"
};

export function isValueCorrect(value: number, currentPins: number): boolean {
  return (
    value >= 0 && currentPins <= TOTAL_PINS && value + currentPins <= TOTAL_PINS
  );
}

export class Frame {
  private roll1!: number;
  private roll2!: number;

  constructor(private nextFrame?: Frame) {}

  getRoll1(): number {
    return this.roll1 || 0;
  }

  getRoll2(): number {
    return this.roll2 || 0;
  }

  hasRoll1(): boolean {
    return this.roll1 !== undefined;
  }

  hasRoll2(): boolean {
    return this.roll2 !== undefined;
  }

  getNextRoll(): number {
    if (this.nextFrame) {
      return this.nextFrame.getRoll1();
    }
    return 0;
  }

  hasNextRoll(): boolean {
    if (this.nextFrame) {
      return this.nextFrame.hasRoll1();
    }
    return false;
  }

  addRoll(value: number): void {
    if (this.isStrike()) {
      throw new Error(ERROR_MESSAGE.STRIKE);
    } else if (this.hasAllRolls()) {
      throw new Error(ERROR_MESSAGE.ALL_ROLLS);
    } else if (!isValueCorrect(value, this.getRoll1())) {
      throw new Error(ERROR_MESSAGE.WRONG_VALUE);
    }

    if (this.roll1 === undefined) {
      this.roll1 = value;
    } else if (this.roll2 === undefined) {
      this.roll2 = value;
    }
  }

  getScore(): number {
    if (this.isSpare()) {
      if (this.hasSpareRoll()) {
        return TOTAL_PINS + this.getSpareRoll();
      }
      throw new Error(ERROR_MESSAGE.MISSING_SPARE_ROLL);
    } else if (this.isStrike()) {
      if (this.hasStrikeRolls()) {
        return TOTAL_PINS + this.getStrikeRolls();
      }
      throw new Error(ERROR_MESSAGE.MISSING_STRIKE_ROLLS);
    }
    return this.getRoll1() + this.getRoll2();
  }

  isStrike(): boolean {
    return this.getRoll1() === TOTAL_PINS;
  }

  isSpare(): boolean {
    return !this.isStrike() && this.getRoll1() + this.getRoll2() === 10;
  }

  hasAllRolls(): boolean {
    return this.roll1 !== undefined && this.roll2 !== undefined;
  }

  hasSpareRoll(): boolean {
    return !!this.nextFrame && !!this.nextFrame.getRoll1();
  }

  getSpareRoll(): number {
    if (this.nextFrame) {
      return this.nextFrame.getRoll1();
    }
    return 0;
  }

  hasStrikeRolls(): boolean {
    if (!this.nextFrame) {
      return false;
    }
    if (this.nextFrame.isStrike()) {
      return this.nextFrame.hasRoll1() && this.nextFrame.hasNextRoll();
    }
    return this.nextFrame.hasRoll1() && this.nextFrame.hasRoll2();
  }

  getStrikeRolls(): number {
    if (this.nextFrame) {
      if (this.nextFrame.isStrike()) {
        return TOTAL_PINS + this.nextFrame.getNextRoll();
      }
      return this.nextFrame.getRoll1() + this.nextFrame.getRoll2();
    }
    return 0;
  }

  isCompleted(): boolean {
    return (
      (this.hasAllRolls() && !this.isSpare()) ||
      (this.isSpare() && this.hasSpareRoll()) ||
      (this.isStrike() && this.hasStrikeRolls())
    );
  }
}

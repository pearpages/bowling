import {
  iFrame,
  TOTAL_PINS,
  ERROR_MESSAGE,
  isValueCorrect,
  isInRange
} from "./models";

export class LastFrame implements iFrame {
  private roll1!: number;
  private roll2!: number;
  private roll3!: number;
  private previousFrame!: iFrame;

  setPreviousFrame(frame: iFrame) {
    this.previousFrame = frame;
  }

  getRoll1(): number {
    return this.roll1 || 0;
  }

  getRoll2(): number {
    return this.roll2 || 0;
  }

  getRoll3(): number {
    return this.roll3 || 0;
  }

  getHtmlRoll1(): string {
    if (this.roll1 === undefined) {
      return "";
    } else if (this.roll1 === TOTAL_PINS) {
      return "X";
    }
    return this.roll1 + "";
  }

  getHtmlRoll2(): string {
    if (this.roll2 === undefined) {
      return "";
    } else if (this.roll1 + this.roll2 === TOTAL_PINS) {
      return "/";
    } else if (this.roll2 === TOTAL_PINS) {
      return "X";
    }
    return this.roll2 + "";
  }

  getHtmlRoll3(): string {
    if (this.roll3 === undefined) {
      return "";
    } else if (this.roll3 === TOTAL_PINS) {
      return "X";
    }
    return this.roll2 + "";
  }

  hasRoll1(): boolean {
    return this.roll1 !== undefined;
  }

  hasRoll2(): boolean {
    return this.roll2 !== undefined;
  }

  hasRoll3(): boolean {
    return this.roll3 !== undefined;
  }

  getPinsLeft(): number {
    if (this.hasRoll3()) {
      return 0;
    } else if (this.hasSpare()) {
      return TOTAL_PINS;
    } else if (this.hasRoll1() && this.hasRoll2() && this.hasStrike()) {
      return TOTAL_PINS;
    }
    return TOTAL_PINS - this.getRoll1() - this.getRoll2();
  }

  hasSpare(): boolean {
    return this.getRoll1() + this.getRoll2() === TOTAL_PINS;
  }

  hasStrike(): boolean {
    return this.getRoll1() === TOTAL_PINS || this.getRoll2() === TOTAL_PINS;
  }

  canAddRoll(): boolean {
    if (!this.hasRoll1() || !this.hasRoll2()) {
      return true;
    }
    return this.canAdd3rRoll();
  }

  canAdd3rRoll(): boolean {
    return !this.hasRoll3() && (this.hasSpare() || this.hasStrike());
  }

  isValueCorrect(value: number, currentPins: number): boolean {
    if (this.getRoll1() === TOTAL_PINS) {
      return isInRange(value);
    }
    if (!this.hasRoll2()) {
      return isValueCorrect(value, currentPins);
    }
    return isInRange(value);
  }

  addRoll(value: number): void {
    if (!this.canAddRoll()) {
      throw new Error(ERROR_MESSAGE.ALL_ROLLS);
    } else if (!this.isValueCorrect(value, this.getRoll1() + this.getRoll2())) {
      throw new Error(ERROR_MESSAGE.WRONG_VALUE);
    }

    if (!this.hasRoll1()) {
      this.roll1 = value;
    } else if (!this.hasRoll2()) {
      this.roll2 = value;
    } else if (this.canAdd3rRoll()) {
      this.roll3 = value;
    }
  }

  getScore(): number {
    let previousFrameScore = 0;
    if (!!this.previousFrame) {
      previousFrameScore = this.previousFrame.getScore();
    }
    if (this.hasSpare()) {
      if (this.hasSpareRoll()) {
        return previousFrameScore + TOTAL_PINS + this.getSpareRoll();
      }
      throw new Error(ERROR_MESSAGE.MISSING_SPARE_ROLL);
    } else if (this.hasStrike()) {
      if (this.hasStrikeRolls()) {
        return previousFrameScore + TOTAL_PINS + this.getStrikeRolls();
      }
      throw new Error(ERROR_MESSAGE.MISSING_STRIKE_ROLLS);
    }
    return previousFrameScore + this.getRoll1() + this.getRoll2();
  }

  hasSpareRoll(): boolean {
    return this.hasRoll3();
  }

  getSpareRoll(): number {
    return this.getRoll3();
  }

  hasStrikeRolls(): boolean {
    return this.hasRoll2() && this.hasRoll3();
  }

  getStrikeRolls(): number {
    return this.getRoll2() + this.getRoll3();
  }

  isCompleted(): boolean {
    return !this.canAddRoll();
  }

  hasScoreReady(): boolean {
    return !this.canAddRoll();
  }

  hasNextRoll = () => this.hasRoll3();

  getNextRoll = () => this.getRoll3();
}

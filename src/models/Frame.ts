import { TOTAL_PINS, iFrame, ERROR_MESSAGE, isValueCorrect } from "./models";

export class Frame implements iFrame {
  private roll1!: number;
  private roll2!: number;
  private nextFrame!: iFrame;
  private previousFrame!: iFrame;

  setNextFrame(frame: iFrame) {
    this.nextFrame = frame;
  }

  setPreviousFrame(frame: iFrame) {
    this.previousFrame = frame;
  }

  setSiblingFrames(previous: iFrame, next: iFrame) {
    this.previousFrame = previous;
    this.nextFrame = next;
  }

  getRoll1(): number {
    return this.roll1 || 0;
  }

  getRoll2(): number {
    return this.roll2 || 0;
  }

  getHtmlRoll1(): string {
    if (this.roll1 === undefined || this.hasStrike()) {
      return "";
    }
    return this.roll1 + "";
  }
  getHtmlRoll2(): string {
    if (this.hasStrike()) {
      return "X";
    } else if (this.roll2 === undefined) {
      return "";
    } else if (this.isSpare()) {
      return "/";
    } else return this.roll2 + "";
  }

  hasRoll1(): boolean {
    return this.roll1 !== undefined;
  }

  hasRoll2(): boolean {
    return this.roll2 !== undefined;
  }

  getPinsLeft(): number {
    return TOTAL_PINS - this.getRoll1();
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
    if (this.hasStrike()) {
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
    let previousFrameScore = 0;
    if (!!this.previousFrame) {
      previousFrameScore = this.previousFrame.getScore();
    }
    if (this.isSpare()) {
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

  hasStrike(): boolean {
    return this.getRoll1() === TOTAL_PINS;
  }

  isSpare(): boolean {
    return !this.hasStrike() && this.getRoll1() + this.getRoll2() === 10;
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
    if (this.nextFrame.hasStrike()) {
      return this.nextFrame.hasRoll1() && this.nextFrame.hasNextRoll();
    }
    return this.nextFrame.hasRoll1() && this.nextFrame.hasRoll2();
  }

  getStrikeRolls(): number {
    if (this.nextFrame) {
      if (this.nextFrame.hasStrike()) {
        return TOTAL_PINS + this.nextFrame.getNextRoll();
      }
      return this.nextFrame.getRoll1() + this.nextFrame.getRoll2();
    }
    return 0;
  }

  canAddRoll(): boolean {
    return !this.hasAllRolls() && !this.hasStrike();
  }

  hasScoreReady(): boolean {
    return (
      (this.hasAllRolls() && !this.isSpare()) ||
      (this.isSpare() && this.hasSpareRoll()) ||
      (this.hasStrike() && this.hasStrikeRolls())
    );
  }
}

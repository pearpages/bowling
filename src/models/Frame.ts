import { AbstractFrame } from "./AbstractFrame";
import { TOTAL_PINS, ERROR_MESSAGE, isValueCorrect } from "./models";

export class Frame extends AbstractFrame {
  protected nextFrame!: AbstractFrame;

  setNextFrame(frame: AbstractFrame) {
    this.nextFrame = frame;
  }

  setSiblingFrames(previous: AbstractFrame, next: AbstractFrame) {
    this.previousFrame = previous;
    this.nextFrame = next;
  }

  hasAllRolls(): boolean {
    return this.roll1 !== undefined && this.roll2 !== undefined;
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
    } else if (this.hasSpare()) {
      return "/";
    } else return this.roll2 + "";
  }

  getPinsLeft(): number {
    return TOTAL_PINS - this.getRoll1();
  }

  getFirstBonusRoll(): number {
    if (this.nextFrame) {
      return this.nextFrame.getRoll1();
    }
    return 0;
  }

  hasFirstBonusRoll(): boolean {
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

  hasStrike(): boolean {
    return this.getRoll1() === TOTAL_PINS;
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
      return this.nextFrame.hasRoll1() && this.nextFrame.hasFirstBonusRoll();
    }
    return this.nextFrame.hasRoll1() && this.nextFrame.hasRoll2();
  }

  getStrikeRolls(): number {
    if (this.hasStrikeRolls()) {
      if (this.nextFrame.hasStrike()) {
        return TOTAL_PINS + this.nextFrame.getFirstBonusRoll();
      }
      return this.nextFrame.getRoll1() + this.nextFrame.getRoll2();
    }
    throw new Error(ERROR_MESSAGE.MISSING_STRIKE_ROLLS);
  }

  canAddRoll(): boolean {
    return !this.hasAllRolls() && !this.hasStrike();
  }

  hasScoreReady(): boolean {
    return (
      (this.hasAllRolls() && !this.hasSpare()) ||
      (this.hasSpare() && this.hasSpareRoll()) ||
      (this.hasStrike() && this.hasStrikeRolls())
    );
  }
}

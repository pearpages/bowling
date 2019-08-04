import { TOTAL_PINS, ERROR_MESSAGE, FrameInterface } from "./models";

export abstract class AbstractFrame implements FrameInterface {
  protected roll1!: number;
  protected roll2!: number;
  protected previousFrame!: FrameInterface;
  abstract getHtmlRoll1(): string;
  abstract getHtmlRoll2(): string;
  abstract hasScoreReady(): boolean;
  abstract getPinsLeft(): number;
  abstract canAddRoll(): boolean;
  abstract addRoll(value: number): void;
  abstract hasStrike(): boolean;
  abstract hasFirstBonusRoll(): boolean;
  abstract getFirstBonusRoll(): number;
  abstract hasSpareRoll(): boolean;
  abstract getSpareRoll(): number;
  abstract hasStrikeRolls(): boolean;
  abstract getStrikeRolls(): number;

  setPreviousFrame(frame: FrameInterface) {
    this.previousFrame = frame;
  }

  getPreviousFrame(): FrameInterface {
    return this.previousFrame;
  }

  hasPreviousFrame(): boolean {
    return !!this.previousFrame;
  }

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

  hasSpare(): boolean {
    return (
      this.hasRoll1() &&
      this.hasRoll2() &&
      this.getRoll1() + this.getRoll2() === TOTAL_PINS
    );
  }

  getScore(): number {
    let previousFrameScore = 0;
    if (!!this.hasPreviousFrame()) {
      previousFrameScore = this.getPreviousFrame().getScore();
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
}

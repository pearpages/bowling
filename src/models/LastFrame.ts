import { AbstractFrame } from "./AbstractFrame";
import { TOTAL_PINS, ERROR_MESSAGE, isValueCorrect, isInRange } from "./models";

export class LastFrame extends AbstractFrame {
  protected roll3!: number;

  hasRoll3(): boolean {
    return this.roll3 !== undefined;
  }

  getRoll3(): number {
    return this.roll3 || 0;
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
    return this.roll3 + "";
  }

  getPinsLeft(): number {
    if (!this.hasRoll1()) {
      return TOTAL_PINS;
    } else if (!this.hasRoll2() && !this.hasStrike()) {
      return TOTAL_PINS - this.getRoll1();
    } else if (!this.hasRoll2() && this.hasStrike()) {
      return TOTAL_PINS;
    } else if (!this.hasRoll3() && this.hasSpare()) {
      return TOTAL_PINS;
    } else if (!this.hasRoll3() && this.getRoll2() === TOTAL_PINS) {
      return TOTAL_PINS;
    } else if (!this.hasRoll3() && this.getRoll2() !== TOTAL_PINS) {
      return TOTAL_PINS - this.getRoll2();
    } else {
      return 0;
    }
  }

  getFirstBonusRoll = () => this.getRoll3();

  hasFirstBonusRoll = () => this.hasRoll3();

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

  hasStrike(): boolean {
    return this.getRoll1() === TOTAL_PINS || this.getRoll2() === TOTAL_PINS;
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

  canAddRoll(): boolean {
    if (!this.hasRoll1() || !this.hasRoll2()) {
      return true;
    }
    return this.canAdd3rRoll();
  }

  hasScoreReady(): boolean {
    return !this.canAddRoll();
  }
}

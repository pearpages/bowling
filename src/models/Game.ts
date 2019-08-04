import { TOTAL_PINS, iFrame } from "./models";
import { Frame } from "./Frame";
import { LastFrame } from "./LastFrame";

export function roll(): number {
  return Math.floor((TOTAL_PINS + 1) * Math.random());
}

export class Game {
  frames: Array<iFrame>;
  currentFrameIndex = 0;

  constructor() {
    const frame10 = new LastFrame();
    const frame9 = new Frame();
    const frame8 = new Frame();
    const frame7 = new Frame();
    const frame6 = new Frame();
    const frame5 = new Frame();
    const frame4 = new Frame();
    const frame3 = new Frame();
    const frame2 = new Frame();
    const frame1 = new Frame();
    frame1.setNextFrame(frame2);
    frame10.setPreviousFrame(frame9);
    frame2.setSiblingFrames(frame1, frame3);
    frame3.setSiblingFrames(frame2, frame4);
    frame4.setSiblingFrames(frame3, frame5);
    frame5.setSiblingFrames(frame4, frame6);
    frame6.setSiblingFrames(frame5, frame7);
    frame7.setSiblingFrames(frame6, frame8);
    frame8.setSiblingFrames(frame7, frame9);
    frame9.setSiblingFrames(frame8, frame10);
    this.frames = [
      frame1,
      frame2,
      frame3,
      frame4,
      frame5,
      frame6,
      frame7,
      frame8,
      frame9,
      frame10
    ];
  }

  addRoll(value: number) {
    this.getCurrentFrame().addRoll(value);
    if (!this.getCurrentFrame().canAddRoll() && !this.isLastFrame()) {
      this.currentFrameIndex++;
    }
  }

  getCurrentFrame(): iFrame {
    return this.frames[this.currentFrameIndex];
  }

  getCurrentFrameIndex(): number {
    return this.currentFrameIndex;
  }

  getFrames(): iFrame[] {
    return this.frames;
  }

  getFramesCount(): number {
    return this.frames.length;
  }

  isLastFrame(): boolean {
    return this.currentFrameIndex === this.frames.length - 1;
  }

  isCompleted(): boolean {
    if (this.isLastFrame()) {
      return !this.getCurrentFrame().canAddRoll();
    }
    return false;
  }
}

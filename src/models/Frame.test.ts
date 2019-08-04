import { ERROR_MESSAGE, TOTAL_PINS } from "./models";
import { Frame } from "./Frame";

describe("Test Frame", () => {
  describe("Should tell you whether is strike or not", () => {
    let frame: Frame;
    beforeEach(() => {
      frame = new Frame();
    });
    it("Should not be a strike for a new frame", () => {
      expect(frame.hasStrike()).toBe(false);
    });
    it("Should not be a strike if the first roll is not the total pins", () => {
      frame.addRoll(1);
      expect(frame.hasStrike()).toBe(false);
    });
    it("Should be a strike if the first roll is the total pins", () => {
      frame.addRoll(TOTAL_PINS);
      expect(frame.hasStrike()).toBe(true);
    });
  });
  describe("Should tell you wheter is a spare or not", () => {
    let frame: Frame;
    beforeEach(() => {
      frame = new Frame();
    });
    it("Should not be a spare with an empty frame", () => {
      expect(frame.isSpare()).toBe(false);
    });
    it("Should not be a spare when is a strike", () => {
      frame.addRoll(10);
      expect(frame.isSpare()).toBe(false);
    });
    it("Should not be a spare when there is only one reoll", () => {
      frame.addRoll(1);
      expect(frame.isSpare()).toBe(false);
    });
    it("Should be a spare when the two rolls sum up the total spins", () => {
      const roll1 = 1;
      const roll2 = TOTAL_PINS - roll1;
      frame.addRoll(roll1);
      frame.addRoll(roll2);
      expect(frame.isSpare()).toBe(true);
    });
  });
  describe("Should add a value", () => {
    let frame: Frame;
    beforeEach(() => {
      frame = new Frame();
    });
    it("Should not allow negative numbers", () => {
      try {
        frame.addRoll(-1);
      } catch (e) {
        expect(e.message).toBe(ERROR_MESSAGE.WRONG_VALUE);
      }
    });
    it("Should not allow adding more rolls after completion", () => {
      try {
        frame.addRoll(10);
        frame.addRoll(1);
      } catch (e) {
        expect(e.message).toBe(ERROR_MESSAGE.STRIKE);
      }
    });
    it("Should not allow adding a bigger roll of pins left", () => {
      try {
        frame.addRoll(9);
        frame.addRoll(2);
      } catch (e) {
        expect(e.message).toBe(ERROR_MESSAGE.WRONG_VALUE);
      }
    });
  });
  describe("Should tell whether is complete", () => {
    let frame: Frame;
    let nextFrame: Frame;
    beforeEach(() => {
      nextFrame = new Frame();
      frame = new Frame();
      frame.setNextFrame(nextFrame);
    });
    it("Should not be completed when it is just created", () => {
      expect(frame.hasScoreReady()).toBe(false);
    });
    it("is not completed when we only have one result that is not a strike", () => {
      frame.addRoll(4);
      expect(frame.hasScoreReady()).toBe(false);
    });
    it("is completed when we have two result that are not a spare", () => {
      frame.addRoll(3);
      frame.addRoll(3);
      expect(frame.hasScoreReady()).toBe(true);
    });
    it("is not completed when we have a spare but not the next roll", () => {
      frame.addRoll(1);
      frame.addRoll(9);
      expect(frame.hasScoreReady()).toBe(false);
    });
    it("is not completed when we have a strike but not the next two rolls", () => {
      frame.addRoll(10);
      expect(frame.hasScoreReady()).toBe(false);
    });
    it("is completed when we have a spare and the next roll", () => {
      frame.addRoll(1);
      frame.addRoll(9);
      nextFrame.addRoll(3);
      expect(frame.hasScoreReady()).toBe(true);
    });
    it("is not completed when we have a strike but not the next two rolls", () => {
      frame.addRoll(10);
      nextFrame.addRoll(4);
      nextFrame.addRoll(1);
      expect(frame.hasScoreReady()).toBe(true);
    });
  });
  describe("Should get the score", () => {
    let frame: Frame;
    let frame2: Frame;
    let frame3: Frame;
    beforeEach(() => {
      frame3 = new Frame();
      frame2 = new Frame();
      frame = new Frame();
      frame.setNextFrame(frame2);
      frame2.setSiblingFrames(frame, frame3);
      frame3.setPreviousFrame(frame2);
    });
    it("Should have 0 as default score", () => {
      expect(frame.getScore()).toBe(0);
    });
    it("Should sum the scores of two different rolls", () => {
      frame.addRoll(1);
      expect(frame.getScore()).toBe(1);
      frame.addRoll(7);
      expect(frame.getScore()).toBe(8);
    });
    it("Should throw error when there is a spare and not the spare roll", () => {
      try {
        frame.addRoll(1);
        frame.addRoll(9);
        expect(() => frame.getScore()).toThrowError();
        frame.getScore();
      } catch (e) {
        expect(e.message).toBe(ERROR_MESSAGE.MISSING_SPARE_ROLL);
      }
    });
    it("Should return the score of a spare bonus", () => {
      frame.addRoll(1);
      frame.addRoll(9);
      frame2.addRoll(10);
      frame.getScore();
      expect(frame.getScore()).toBe(20);
    });
    it("Should throw error when there is a strike and not the strike rolls", () => {
      try {
        frame.addRoll(10);
        expect(() => frame.getScore()).toThrowError();
        frame.getScore();
      } catch (e) {
        expect(e.message).toBe(ERROR_MESSAGE.MISSING_STRIKE_ROLLS);
      }
    });
    it("Should get the score of a strike when is completed", () => {
      frame.addRoll(10);
      frame2.addRoll(1);
      frame2.addRoll(2);
      expect(frame.getScore()).toBe(13);
      frame.getScore();
    });
    it("Shold get the max frame punctuation", () => {
      frame.addRoll(10);
      frame2.addRoll(10);
      frame3.addRoll(10);
      expect(frame.getScore()).toBe(30);
    });
  });
});

import React, { Component } from "react";

import "./App.scss";
import { Frame, Pins } from "./components";
import { Game, FrameInterface } from "./models";

interface State {
  frames: FrameInterface[];
  game: Game;
}

function getNewGame(): State {
  const game = new Game();
  const state = {
    game,
    frames: game.getFrames()
  };
  return state;
}

export class App extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = getNewGame();
  }

  get currentFrame(): FrameInterface {
    return this.state.game.getCurrentFrame();
  }

  updateFrames = (value: number) => {
    this.state.game.addRoll(value);
    this.setState({ frames: this.state.frames.slice() });
  };

  restartGame = () => {
    this.setState(getNewGame());
  };

  render() {
    return (
      <>
        <div className="bowling">
          <div className="frames">
            {this.state.frames.map((frame: FrameInterface, key: number) => (
              <Frame
                key={key + 1}
                id={key + 1}
                isActive={key === this.state.game.getCurrentFrameIndex()}
                isLast={key === this.state.game.getFramesCount() - 1}
                roll1={frame.getHtmlRoll1()}
                roll2={frame.getHtmlRoll2()}
                roll3={frame.getHtmlRoll3 ? frame.getHtmlRoll3() : ""}
                score={frame.hasScoreReady() ? frame.getScore() : undefined}
              />
            ))}
          </div>
          <Pins
            min={0}
            max={this.currentFrame.getPinsLeft()}
            clickHandler={this.updateFrames}
          />
          {this.state.game.isCompleted() ? (
            <button style={{ marginLeft: "75px" }} onClick={this.restartGame}>
              RESTART
            </button>
          ) : null}
        </div>
      </>
    );
  }
}

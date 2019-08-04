import React from "react";

import "./Frame.scss";
// import { Frame as FrameModel } from "../models/Frame";

function getCSSclasses(options: {
  isActive?: boolean;
  isLast?: boolean;
}): string {
  const classes: string[] = ["frame"];
  if (options.isActive) {
    classes.push("frame--active");
  }
  if (options.isLast) {
    classes.push("frame--last");
  }
  return classes.join(" ");
}

export function Frame(props: {
  roll1: string;
  roll2: string;
  roll3?: string;
  score?: number;
  id: number;
  isActive: boolean;
  isLast: boolean;
}) {
  const { roll1, roll2, score, id, isLast } = props;
  return (
    <div className={getCSSclasses(props)}>
      <div className="frame__header">{id}</div>
      <div className="frame__body">
        <div className="rolls">
          <div className="rolls__roll1">{roll1}</div>
          <div className="rolls__roll2">{roll2}</div>
          {isLast ? (
            <div className="rolls__roll3">{props.roll3 ? props.roll3 : ""}</div>
          ) : null}
        </div>
        <div className="score">{score}</div>
      </div>
    </div>
  );
}

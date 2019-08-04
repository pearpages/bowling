import React from "react";

import "./Pins.scss";

export function Pins(props: {
  min: number;
  max: number;
  clickHandler: (value: number) => void;
}) {
  let { min, max, clickHandler } = props;
  const buttons = [];
  if (min < max) {
    while (min <= max) {
      buttons.push(min);
      min++;
    }
  }

  return (
    <div className="pins">
      {buttons.map((value: number, index: number) => (
        <div key={index}>
          <button
            className="pin-down"
            type="button"
            onClick={() => clickHandler(value)}
          >
            {value}
          </button>
        </div>
      ))}
    </div>
  );
}

import { observer } from "mobx-react-lite";
import React from "react";
import "./InputBar.css";

interface ContainerProps {
  values: number[];
  total: number;
}

const InputBar: React.FC<ContainerProps> = ({ values, total }) => {
  return (
    <div>
      {[...Array(total)].map((value, idx) => {
        if (idx < values.length) {
          return (
            <span key={idx} className="number-value">
              {values[idx]}
            </span>
          );
        }
        return (
          <span key={idx} className="number-value">
            _
          </span>
        );
      })}
    </div>
  );
};

export default observer(InputBar);

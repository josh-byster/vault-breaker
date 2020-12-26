import { IonAlert, IonButton } from "@ionic/react";
import React, { FC, useState, useMemo } from "react";
import "./HintController.css";
interface Props {
  answer: number[];
  enabled: boolean;
  hintUsed: () => void;
}

const getDigit = (): number => {
  return Math.floor(Math.random() * 10);
};

const HintController: React.FC<Props> = ({ answer, enabled, hintUsed }) => {
  const [open, setOpen] = useState(false);

  const hintMessage = useMemo((): string => {
    let randomDigit = getDigit();
    while (answer.indexOf(randomDigit) !== -1) {
      randomDigit = getDigit();
    }
    return `The answer does not contain ${randomDigit}.`;
  }, [answer]);

  return (
    <>
      <IonAlert
        isOpen={open}
        onDidDismiss={() => setOpen(false)}
        header={"Hint"}
        message={hintMessage}
        buttons={["OK"]}
      />
      <IonButton
        className="hint"
        onClick={() => {
          setOpen(true);
          hintUsed();
        }}
        disabled={!enabled}
      >
        Hint
      </IonButton>
    </>
  );
};

export default HintController;

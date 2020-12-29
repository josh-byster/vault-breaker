import { IonAlert, IonButton } from "@ionic/react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { GameState } from "../store/GameState";
import "./HintController.css";
interface Props {
  state: GameState;
}

const HintController: React.FC<Props> = ({ state }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IonAlert
        isOpen={open}
        onDidDismiss={() => setOpen(false)}
        header="Hint"
        message={state.hintMessage}
        buttons={["OK"]}
      />
      <IonButton
        className="hint"
        onClick={() => {
          setOpen(true);
          action(() => (state.hintsLeft = false));
        }}
        disabled={state.hintButtonDisabled}
      >
        Hint
      </IonButton>
    </>
  );
};

export default observer(HintController);

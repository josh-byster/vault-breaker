import React from "react";
import { IonAlert } from "@ionic/react";

interface Props {
  resetHandler: () => void;
  onDismiss: () => void;
  isOpen: boolean;
}

const ResetStatsAlert = ({ isOpen, resetHandler, onDismiss }: Props) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onWillDismiss={onDismiss}
      cssClass="my-custom-class"
      header="Reset Statistics"
      message={`Click OK to reset statistics.`}
      buttons={[
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Ok",
          handler: resetHandler,
        },
      ]}
    />
  );
};

export default ResetStatsAlert;

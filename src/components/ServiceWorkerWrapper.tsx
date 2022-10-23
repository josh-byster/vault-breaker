import React, { FC, useEffect } from "react";
import { IonAlert } from "@ionic/react";
import * as serviceWorker from "../serviceWorker";

const ServiceWorkerWrapper: React.FC = () => {
  const [showReload, setShowReload] = React.useState(false);
  const [
    waitingWorker,
    setWaitingWorker,
  ] = React.useState<ServiceWorker | null>(null);

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    serviceWorker.register({ onUpdate: onSWUpdate });
    console.log("Registered ServiceWorker!");
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    setShowReload(false);
    window.location.reload();
  };
  return (
    <IonAlert
      isOpen={showReload}
      onDidDismiss={() => {
        reloadPage();
      }}
      header={"Update"}
      message={`A new version is available!`}
      buttons={["OK"]}
    />
  );
};

export default ServiceWorkerWrapper;

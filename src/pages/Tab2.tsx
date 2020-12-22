import React, { useEffect, useState } from "react";
import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab2.css";
import { GameStatistics, getInfoOrDefault, resetGameInfo } from "../components/persistence";

const Tab2: React.FC = () => {
  const [stats, setStats] = useState<GameStatistics>();
  useEffect(() => {
    async function fetchData() {
      setStats(await getInfoOrDefault());
    }
    fetchData();
  }, []);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Stats</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>Statistics</IonListHeader>
        
        {stats && (
          <>
            <IonItem>
              <IonLabel>Games Played</IonLabel>
              <IonBadge slot="end">{stats.guesses}</IonBadge>
            </IonItem>

            <IonItem>
              <IonLabel>Average Time</IonLabel>
              <IonBadge slot="end" color="secondary">
                {stats.gamesPlayed === 0 ? 0 : Math.round((stats.time / stats.gamesPlayed) * 100) / 100}
              </IonBadge>
            </IonItem>

            <IonItem>
              <IonLabel>Average # Attempts</IonLabel>
              <IonBadge slot="end" color="success">
                {stats.gamesPlayed === 0 ? 0 :Math.round((stats.guesses / stats.gamesPlayed) * 100) / 100}
              </IonBadge>
            </IonItem>

          </>
        )}
        </IonList>
        <IonButton onClick={resetGameInfo}>Reset</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;

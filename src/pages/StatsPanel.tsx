import React, { useContext, useState } from "react";
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
  useIonViewWillEnter,
} from "@ionic/react";
import "./StatsPanel.css";
import { GameStatistics } from "../components/persistence";
import { StatisticsContext } from "../App";

const Tab2: React.FC = () => {
  const statisticsService = useContext(StatisticsContext);
  const [stats, setStats] = useState<GameStatistics>();

  useIonViewWillEnter(async () => {
    setStats(await statisticsService.getStatistics());
  });

  const resetButtonClicked = async () => {
    setStats(await statisticsService.resetStatistics());
  };
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
                <IonLabel>Total Games Played</IonLabel>
                <IonBadge slot="end">{stats.gamesPlayed}</IonBadge>
              </IonItem>

              <IonItem>
                <IonLabel>Average Time</IonLabel>
                <IonBadge slot="end" color="secondary">
                  {stats.gamesPlayed === 0
                    ? 0
                    : Math.round((stats.time / stats.gamesPlayed) * 100) / 100}
                </IonBadge>
              </IonItem>

              <IonItem>
                <IonLabel>Average # Attempts</IonLabel>
                <IonBadge slot="end" color="success">
                  {stats.gamesPlayed === 0
                    ? 0
                    : Math.round((stats.guesses / stats.gamesPlayed) * 100) /
                      100}
                </IonBadge>
              </IonItem>

              <IonItem>
                <IonLabel>Fastest Win</IonLabel>
                <IonBadge slot="end" color="danger">
                  {stats.fastestWin}
                </IonBadge>
              </IonItem>
              <IonItem>
                <IonLabel>Least Guesses in Game</IonLabel>
                <IonBadge slot="end" color="light">
                  {stats.lowestGuessCount}
                </IonBadge>
              </IonItem>
              <IonItem>
                <IonLabel>Most Guesses in Game</IonLabel>
                <IonBadge slot="end" color="dark">
                  {stats.highestGuessCount}
                </IonBadge>
              </IonItem>
              <IonItem>
                <IonLabel>Last Reset</IonLabel>
                <IonBadge slot="end" color="warning">
                  {new Date(stats.dayStarted).toLocaleDateString("en-US")}
                </IonBadge>
              </IonItem>
            </>
          )}
          <IonButton className="reset-button" onClick={resetButtonClicked}>
            Reset
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;

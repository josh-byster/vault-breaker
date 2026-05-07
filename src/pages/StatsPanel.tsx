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
import { GameStatistics, STREAK_THRESHOLD } from "../services/persistence";
import { StatisticsContext } from "../App";
import ResetStatsAlert from "../components/ResetStatsAlert";

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds * 100) / 100}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60 * 10) / 10}m`;
  return `${Math.round(seconds / 3600 * 10) / 10}h`;
};

const Tab2: React.FC = () => {
  const statisticsService = useContext(StatisticsContext);
  const [stats, setStats] = useState<GameStatistics>();
  const [shouldShowResetAlert, showResetAlert] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  useIonViewWillEnter(async () => {
    setStats(await statisticsService.getStatistics());
  });

  const resetStatistics = async () => {
    showResetAlert(false);
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

              <IonButton
                expand="full"
                fill="clear"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Hide Details" : "More Stats"}
              </IonButton>

              {showMore && (
                <>
                  <IonListHeader>Streaks ({"≤"}{STREAK_THRESHOLD} guesses)</IonListHeader>
                  <IonItem>
                    <IonLabel>Current Streak</IonLabel>
                    <IonBadge slot="end" color="tertiary">
                      {stats.currentStreak}
                    </IonBadge>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Best Streak</IonLabel>
                    <IonBadge slot="end" color="tertiary">
                      {stats.bestStreak}
                    </IonBadge>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Total Time Played</IonLabel>
                    <IonBadge slot="end" color="secondary">
                      {stats.time === 0 ? "—" : formatTime(stats.time)}
                    </IonBadge>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Avg Time Per Guess</IonLabel>
                    <IonBadge slot="end" color="secondary">
                      {stats.guesses === 0
                        ? "—"
                        : `${Math.round((stats.time / stats.guesses) * 100) / 100}s`}
                    </IonBadge>
                  </IonItem>

                  {Object.keys(stats.fastestByGuessCount).length > 0 && (
                    <>
                      <IonListHeader>Best Times by Guess Count</IonListHeader>
                      {Object.entries(stats.fastestByGuessCount)
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([count, time]) => (
                          <IonItem key={count}>
                            <IonLabel>{count} guesses</IonLabel>
                            <IonBadge slot="end" color="secondary">
                              {Math.round((time as number) * 100) / 100}s
                            </IonBadge>
                          </IonItem>
                        ))}
                    </>
                  )}
                </>
              )}
            </>
          )}
          <IonButton
            className="reset-button"
            onClick={() => showResetAlert(true)}
          >
            Reset
          </IonButton>
          <ResetStatsAlert
            isOpen={shouldShowResetAlert}
            onDismiss={() => showResetAlert(false)}
            resetHandler={resetStatistics}
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;

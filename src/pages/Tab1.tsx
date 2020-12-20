import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import GameController from '../components/GameController';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Vault Breaker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <GameController name="Tab 1 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;

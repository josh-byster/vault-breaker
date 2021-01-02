import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, triangle } from "ionicons/icons";
import HomePage from "./pages/Home";
import StatsPanel from "./pages/StatsPanel";
import Tab3 from "./pages/Tab3";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import ServiceWorkerWrapper from "./components/ServiceWorkerWrapper";
import { GameStatisticsService } from "./components/persistence";

const statisticsService = new GameStatisticsService();
export const StatisticsContext = React.createContext(statisticsService);

const App: React.FC = () => (
  <StatisticsContext.Provider value={statisticsService}>
    <IonApp>
      <ServiceWorkerWrapper />
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/home" component={HomePage} exact={true} />
            <Route path="/stats" component={StatsPanel} exact={true} />
            <Route path="/tab3" component={Tab3} />
            <Route
              path="/"
              render={() => <Redirect to="/home" />}
              exact={true}
            />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={triangle} />
              <IonLabel>Game</IonLabel>
            </IonTabButton>
            <IonTabButton tab="stats" href="/stats">
              <IonIcon icon={ellipse} />
              <IonLabel>Stats</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  </StatisticsContext.Provider>
);

export default App;

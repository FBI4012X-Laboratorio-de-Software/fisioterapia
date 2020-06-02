import Menu from './components/Menu';
import React, { useState, useEffect } from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane, IonRow, IonCol, IonSpinner } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import ListaFisioterapeuta from './pages/ListaFisioterapeutas';
import CadastroFisioterapeuta from './pages/Fisioterapeuta';

import { Plugins } from '@capacitor/core';
import Login from './pages/Login';
import Sobre from './pages/Sobre';

const { Storage } = Plugins;

const App: React.FC = () => {
  
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(function() {
    
    Storage.get({ key: 'usuario_id' }).then((value) => {
      
      if (value.value) {
        window.history.replaceState({}, '', '/fisioterapeutas/lista');
      } else {
        window.history.replaceState({}, '', '/login');
      }
      
      setLoading(false);
      
    })
    
  }, [loading])
  
  return (<IonApp>
    {loading && <IonRow>
      <IonCol className="ion-text-center">
        <IonSpinner></IonSpinner>
      </IonCol>
    </IonRow>}
    {!loading && <IonReactRouter>
      <IonSplitPane contentId="main">
        <Menu />
        <IonRouterOutlet id="main">
          <Route path="/fisioterapeuta/:id" component={CadastroFisioterapeuta} />
          <Route path="/fisioterapeutas/lista" component={ListaFisioterapeuta} exact />
          <Route path="/login" component={Login} />
          <Route path="/sobre" component={Sobre} />
          <Redirect from="/" to="/fisioterapeutas/lista" exact />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactRouter>}
  </IonApp>
  );
  
};

export default App;

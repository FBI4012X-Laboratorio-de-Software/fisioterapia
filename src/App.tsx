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
import ListaFisioterapeutas from './pages/ListaFisioterapeutas';
import CadastroFisioterapeuta from './pages/Fisioterapeuta';

import { Plugins } from '@capacitor/core';
import Login from './pages/Login';
import Sobre from './pages/Sobre';
import ListaPacientes from './pages/ListaPacientes';
import Paciente from './pages/Paciente';
import TrocarSenha from './pages/TrocarSenha';
import Avaliacao from './pages/Avaliacao';
import CadastrarAvaliacao from './pages/CadastrarAvaliacao';

const { Storage } = Plugins;

const App: React.FC = (props) => {
  
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(function() {
    
    Storage.get({ key: 'usuario_id' }).then((value) => {
      
      const path = window.location.pathname;
      
      if (value.value) {
        if (path === '/login' || path === '/troca-senha') {
          window.history.replaceState({}, '', '/paciente/novo');
        }
      } else {
        if (path !== '/login' && path !== '/troca-senha') {
          window.history.replaceState({}, '', '/login');
        }
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
          <Route path="/fisioterapeutas/lista" component={ListaFisioterapeutas} exact />
          <Route path="/login" component={Login} />
          <Route path="/trocar-senha" component={TrocarSenha} />
          <Route path="/sobre" component={Sobre} />
          <Route path="/pacientes/lista" component={ListaPacientes} />
          <Route path="/paciente/:id" component={Paciente} />
          <Route path="/avaliacoes" component={Avaliacao} exact />
          <Route path="/avaliacao/:idpaciente" component={CadastrarAvaliacao} />
          <Redirect from="/" to="/avaliacoes/" exact />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactRouter>}
  </IonApp>
  );
  
};

export default App;

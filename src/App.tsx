import Menu from './components/Menu';
import React from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

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
import './theme/style.css';

import ListaFisioterapeutas from './pages/ListaFisioterapeutas';
import CadastroFisioterapeuta from './pages/Fisioterapeuta';

import Login from './pages/Login';
import Sobre from './pages/Sobre';
import ListaPacientes from './pages/ListaPacientes';
import Paciente from './pages/Paciente';
import TrocarSenha from './pages/TrocarSenha';
import Avaliacao from './pages/Avaliacao';
import CadastrarAvaliacao from './pages/CadastrarAvaliacao';
import Inicializando from './pages/Inicializando';

const App: React.FC = props => {
  
  return (<IonApp>
    <IonReactHashRouter >
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
          <Route path="/avaliacao/:idpaciente" component={CadastrarAvaliacao} exact/>
          <Route path="/avaliacao/:idpaciente/:idavaliacao" component={CadastrarAvaliacao} exact/>
          <Route path="/inicializando" component={Inicializando} exact/>
          <Redirect from="/" to="/inicializando" exact />
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactHashRouter >
  </IonApp>
  );
  
};

export default App;

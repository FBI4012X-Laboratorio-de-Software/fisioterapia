import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonButton,
} from '@ionic/react';

import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { people, personOutline, documentTextOutline, ribbonOutline } from 'ionicons/icons';
import './Menu.css';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

interface AppPage {
  url: string;
  title: string;
  icone: string;
}

const appPages: AppPage[] = [
  {
    title: 'Fisioterapeutas',
    url: '/fisioterapeutas/lista',
    icone: people
  },
  {
    title: 'Pacientes',
    url: '/pacientes/lista',
    icone: personOutline
  },
  {
    title: 'Avaliações',
    url: '/avaliacaoes/novo',
    icone: documentTextOutline
  },
  {
    title: 'Sobre o App',
    url: '/sobre',
    icone: ribbonOutline
  }
];

const Menu: React.FC = () => {
  
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  const location = useLocation();
  const history = useHistory();
  
  const finalizarSessao = () => {
    Storage.remove({ key: 'usuario_id' });
    Storage.remove({ key: 'usuario_email' });
    history.replace('/login');
  };
  
  if (!userName) {
    Storage.get({ key: 'usuario_nome' }).then(nome => {
      if (nome.value) {
        setUserName(nome.value);
      }
    })
    Storage.get({ key: 'usuario_email' }).then(emailUsu => {
      if (emailUsu.value) {
        setEmail(emailUsu.value);
      }
    })
  }
  const mostraMenu = (location.pathname !== '/login');
  
  if (!mostraMenu) {
    return (
      <div />
    );
  }
  
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          
          <IonListHeader>{ userName }</IonListHeader>
          <IonNote>{ email }</IonNote>
          
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" icon={appPage.icone} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
        
        <IonButton color="primary" class="ion-margin-top" onClick={finalizarSessao}>
          Finalizar sessão
        </IonButton>
        
      </IonContent>
    </IonMenu>
  );
};

export default Menu;

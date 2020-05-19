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

import React from 'react';
import { useLocation } from 'react-router-dom';
import { people } from 'ionicons/icons';
import './Menu.css';

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
  }
];

// const appPages: AppPage[] = [
//   {
//     title: 'Inbox',
//     url: '/page/Inbox',
//     iosIcon: mailOutline,
//     mdIcon: mailSharp
//   },
//   {
//     title: 'Outbox',
//     url: '/page/Outbox',
//     iosIcon: paperPlaneOutline,
//     mdIcon: paperPlaneSharp
//   },
//   {
//     title: 'Favorites',
//     url: '/page/Favorites',
//     iosIcon: heartOutline,
//     mdIcon: heartSharp
//   },
//   {
//     title: 'Archived',
//     url: '/page/Archived',
//     iosIcon: archiveOutline,
//     mdIcon: archiveSharp
//   },
//   {
//     title: 'Trash',
//     url: '/page/Trash',
//     iosIcon: trashOutline,
//     mdIcon: trashSharp
//   },
//   {
//     title: 'Spam',
//     url: '/page/Spam',
//     iosIcon: warningOutline,
//     mdIcon: warningSharp
//   }
// ];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          
          <IonListHeader>Nome do usuário</IonListHeader>
          <IonNote>e-mail do usuário</IonNote>
          
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
        
        <IonButton color="primary" class="ion-margin-top">
          Finalizar sessão
        </IonButton>
        
      </IonContent>
    </IonMenu>
  );
};

export default Menu;

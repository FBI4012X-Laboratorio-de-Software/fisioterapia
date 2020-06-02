import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonText, IonLabel, IonIcon } from '@ionic/react';
import { callOutline, mailOutline } from 'ionicons/icons';

const Sobre: React.FC = () => {
  
  const routeName = 'Sobre o App';
  
  return (
    <IonPage>
      
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
            <IonTitle>{ routeName }</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        
        <IonList className="ion-margin-bottom">
          <IonListHeader>
            Clinica App
          </IonListHeader>
          <IonItem className="ion-text-center">
            <IonText>
              O aplicativo foi desenvolvido para mostrar a avaliação postural completa para o acompanhamento das imagens gravadas com respectivo relatório comparativo de evolução.
            </IonText>
          </IonItem>
        </IonList>
        
        <IonList className="ion-margin-bottom">
          <IonListHeader>
            Desenvolvedores
          </IonListHeader>
          <IonItem className="ion-text-center">
            <IonLabel>
              Andrei Martini
              <br/>
              Eduardo Donelli Pellenz
              <br/>
              Jaqueline Ampessan Jardin
              <br/>
              Thales Mulazzani Pandolphi
            </IonLabel>
          </IonItem>
        </IonList>
        
        <IonList className="ion-margin-bottom">
          <IonItem>
            <IonIcon icon={callOutline} slot="start" />
            (54) 3200 - 0010
          </IonItem>
          <IonItem>
            <IonIcon icon={mailOutline} slot="start" />
            dra.jaquelinepereira@yahoo.com.br
          </IonItem>
        </IonList>
        
      </IonContent>
        
    </IonPage>
  );
  
}

export default Sobre;

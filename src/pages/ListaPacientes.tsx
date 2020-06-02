import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonPage, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { add, searchCircle, searchOutline } from 'ionicons/icons';

const ListaPacientes: React.FC = (props : any) => {
  
  const routeName = 'Lista Pacientes';
  
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
      
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => props.history.push('/fisioterapeuta/novo')}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      
    </IonContent>
    
  </IonPage>
  );
}

export default ListaPacientes;
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import React from 'react';
import { add } from 'ionicons/icons';

const ListaFisioterapeuta: React.FC = (props: any) => {
  
  const routeName = 'Lista fisioterapeutas';
  
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

      <IonContent>
        
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => props.history.push('/fisioterapeuta/novo')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        
        {/* Lista de fisioterapeutas */}
        
      </IonContent>
      
    </IonPage>
  );
};

export default ListaFisioterapeuta;


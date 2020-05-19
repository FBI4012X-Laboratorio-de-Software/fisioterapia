import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import React from 'react';
import { RouteComponentProps } from 'react-router';

interface FisioterapeutaProps extends RouteComponentProps<{
  id: string;
}> {}

const Fisioterapeuta: React.FC<FisioterapeutaProps> = (props) => {
  
  const novoCadastro = props.match.params.id === 'novo';
  const routeName = novoCadastro ? 'Novo fisioterapeuta' : 'Editar fisioterapeuta';
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{routeName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{routeName}</IonTitle>
          </IonToolbar>
        </IonHeader>
        
      </IonContent>
    </IonPage>
  );
};

export default Fisioterapeuta;


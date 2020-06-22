import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonButton } from '@ionic/react';
import { usePhotoGallery } from '../hooks/usePhotoGallery';

const CadastrarAvaliacao: React.FC = () => {
  
  const routeName = 'Cadastrar avaliação'
  const { takePhoto } = usePhotoGallery();
  
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
        
        <IonButton onClick={() => { takePhoto() }}>
          Tirar foto
        </IonButton>
        
      </IonContent>
      
    </IonPage>
  );
}

export default CadastrarAvaliacao;

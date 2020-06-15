import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonPage, IonFab, IonFabButton, IonIcon, useIonViewWillEnter } from '@ionic/react';
import { add } from 'ionicons/icons';
import { getUltimosPacientesCadastrados } from '../config/firebase';

const ListaPacientes: React.FC = (props : any) => {
  
  const [dados, setDados] = useState<Array<{key: string, nome: string, cpf: string}>>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [carregaPrimeiraVez, setCarregaPrimeira] = useState<boolean>(true);
  
  const routeName = 'Lista Pacientes';
  
  // useIonViewWillEnter(() => {
  //   carregaDados();
  // });
  
  // function carregaDados() {
  //   setCarregando(true);
  //   getUltimosPacientesCadastrados(null).then(e => gotData(e)).finally(() => {
  //     setCarregaPrimeira(false);
  //   });
  // }
  
  // function gotData(data: []) {
    
    
    
  // }
  
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
        <IonFabButton onClick={() => props.history.push('/paciente/novo')}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      
    </IonContent>
    
  </IonPage>
  );
}

export default ListaPacientes;
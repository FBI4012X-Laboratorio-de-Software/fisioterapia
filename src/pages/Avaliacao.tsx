import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonLabel, IonSelect, IonSelectOption, IonItem, IonList } from '@ionic/react';
import { RouteComponentProps } from 'react-router';

interface FisioterapeutaProps extends RouteComponentProps<{
  idPaciente?: string;
  idAvaliacao?: string;
}> {}

interface paciente {
  nome: string;
  codigo: string;
}

const Avaliacao: React.FC<FisioterapeutaProps> = props => {
  
  const [listaPacientes, setListaPacientes] = useState<paciente[]>([]);
  const [paciente, setPaciente] = useState();
  
  const idPaciente = props.match.params.idPaciente;
  const idAvaliacao = props.match.params.idAvaliacao;
  
  const routeName = 'Avaliações';
  
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
        
        <IonList>
          <IonItem>
            
            <IonLabel position="floating">Paciente</IonLabel>
            <IonSelect value={paciente} onIonChange={e => setPaciente(e.detail.value!)}>
              {listaPacientes.map((paciente, key) => 
                <IonSelectOption key={key} value={paciente.codigo}>{ paciente.nome }</IonSelectOption>
              )}
            </IonSelect>
            
          </IonItem>
        </IonList>
        
        
        
      </IonContent>
    </IonPage>
  );
}

export default Avaliacao;

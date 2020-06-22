import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonLabel, IonItem, IonList, IonModal, IonButton, IonRow, IonCol, useIonViewWillEnter, IonSearchbar, IonSpinner, IonRadioGroup, IonRadio, IonListHeader } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { getUltimosPacientesCadastrados, buscaAvaliacoesDoPaciente } from '../config/firebase';

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
  const [paciente, setPaciente] = useState<paciente | null>(null);
  const [showModalSelecPaciente, setShowModalSelecPaciente] = useState<boolean>(false);
  const [carregandoPacientes, setCarregandoPacientes] = useState<boolean>(false);
  const [listaAvaliacoes, setListaAvaliacoes] = useState<any[]>([]);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState<boolean>(false);
  const [filtroPaciente, setFiltroPaciente] = useState<string>('');
  
  const routeName = 'Avaliações';
  
  useIonViewWillEnter(() => {
    setCarregandoPacientes(true);
    carregaPacientes();
    setPaciente(null);
    setFiltroPaciente('');
    setCarregandoAvaliacoes(false);
    setListaAvaliacoes([]);
  })
  
  const carregaPacientes = () => {
    getUltimosPacientesCadastrados(null).then((resp: any) => {
      
      if (resp) {
        
        const novaLista = [];
        for (const pac of resp) {
          novaLista.push({ codigo: pac.codigo, nome: pac.nome });
        }
        setListaPacientes(novaLista);
        
      } else {
        setListaPacientes([]);
      }
      
      setCarregandoPacientes(false);
      
    })
  }
  
  const carregaAvaliacoes = (novoPaciente: paciente) => {
    setCarregandoAvaliacoes(true);
    buscaAvaliacoesDoPaciente(novoPaciente.codigo).then((resp: any) => {
      
      if (resp) {
        setListaAvaliacoes(resp);
      } else {
        setListaAvaliacoes([]);
      }
      
      setCarregandoAvaliacoes(false);
    })
  }
  
  const filtroPacienteLower = filtroPaciente.toLowerCase();
  let pacientesMostra = listaPacientes.filter((data) => {
    if (filtroPacienteLower) {
      if (data.nome.toLowerCase().includes(filtroPacienteLower)) {
        return data;
      }
      return null;
    } else {
      return data;
    }
  })
  
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
        
        <IonModal isOpen={showModalSelecPaciente} cssClass='my-custom-class'>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Pacientes</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => { setShowModalSelecPaciente(false) } }>
                  Fechar
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            
            <IonSearchbar className="ion-margin-bottom" value={filtroPaciente} onIonChange={e => setFiltroPaciente(e.detail.value!)} placeholder="Pesquisar..."></IonSearchbar>
            
            {carregandoPacientes && <IonRow>
              <IonCol className="ion-text-center ion-margin-top">
                <IonSpinner></IonSpinner>
              </IonCol>
            </IonRow>}
            
            {!carregandoPacientes && pacientesMostra.length > 0 && <IonList class="ion-margin">
              <IonRadioGroup value={paciente} onIonChange={e => { setPaciente(e.detail.value); setShowModalSelecPaciente(false); carregaAvaliacoes(e.detail.value) }}>
                { pacientesMostra.map((paciente, index) => (
                  <IonItem key={index}>
                    <IonLabel>{ paciente.nome }</IonLabel>
                    <IonRadio slot="start" value={paciente} />
                  </IonItem>
                ))}
              </IonRadioGroup>
            </IonList>}
            
            {!carregandoPacientes && pacientesMostra.length === 0 && <IonRow>
              <IonCol className="ion-text-center">
                Não foram encontrados dados para este filtro!
              </IonCol>
            </IonRow>}
            
          </IonContent>
        </IonModal>
        
        {paciente && <IonList>
          <IonItem className="ion-no-border">
            { paciente.nome }
          </IonItem>
        </IonList>}
        
        <IonRow>
          <IonCol className="ion-text-center">
            <IonButton color="primary" onClick={() => { setShowModalSelecPaciente(true); carregaPacientes() } } disabled={carregandoAvaliacoes}>
              {paciente ? 'Alterar paciente' : 'Selecionar paciente'}
            </IonButton>
          </IonCol>
        </IonRow>
        
        {paciente && !carregandoAvaliacoes && <IonList>
          
        </IonList>}
        
        {carregandoAvaliacoes && <IonRow>
          <IonCol className="ion-text-center ion-margin-top">
            <IonSpinner></IonSpinner>
          </IonCol>  
        </IonRow>}
        
      </IonContent>
    </IonPage>
  );
}

export default Avaliacao;

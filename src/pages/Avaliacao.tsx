import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonLabel, IonItem, IonList, IonModal, IonButton, IonRow, IonCol, useIonViewWillEnter, IonSearchbar, IonSpinner, IonRadioGroup, IonRadio, IonListHeader, IonFab, IonFabButton, IonIcon, IonGrid } from '@ionic/react';
import { RouteComponentProps, useHistory } from 'react-router';
import { getUltimosPacientesCadastrados, buscaAvaliacoesDoPaciente } from '../config/firebase';
import { add } from 'ionicons/icons';
import { formatCpf } from './../config/utils';

interface FisioterapeutaProps extends RouteComponentProps<{
  idPaciente?: string;
  idAvaliacao?: string;
}> {}

interface paciente {
  nome: string;
  codigo: string;
  cpf: string;
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
          novaLista.push({ codigo: pac.codigo, nome: pac.nome, cpf: pac.cpf });
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
        
        <IonModal isOpen={showModalSelecPaciente}>
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
          <IonItem className="ion-no-border" onClick={() => { setShowModalSelecPaciente(true); carregaPacientes() } }>
            <IonGrid>
              <IonRow>
                <IonCol>
                { paciente.nome }
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  {formatCpf(paciente.cpf) }
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
        </IonList>}
        
        <IonRow className="ion-margin-bottom">
          {!paciente && <IonCol className="ion-text-center">
            <IonButton color="primary" onClick={() => { setShowModalSelecPaciente(true); carregaPacientes() } } disabled={carregandoAvaliacoes}>
              Selecionar paciente
            </IonButton>
          </IonCol>}
          {paciente && <IonCol className="ion-text-right">
            <IonButton color="warning" onClick={() => { setShowModalSelecPaciente(true); carregaPacientes()  } } disabled={carregandoAvaliacoes}>
              Alterar
            </IonButton>
          </IonCol>}
        </IonRow>
        
        {paciente && <div>
          
          {!carregandoAvaliacoes && listaAvaliacoes.length > 0 && <IonList>
          
          </IonList>}
          {!carregandoAvaliacoes && listaAvaliacoes.length === 0 && <IonRow>
            <IonCol className="ion-text-center">
              Ainda não há avaliações cadastradas!
            </IonCol>
          </IonRow>}
            
          {carregandoAvaliacoes && <IonRow>
            <IonCol className="ion-text-center ion-margin-top">
              <IonSpinner></IonSpinner>
            </IonCol>  
          </IonRow>}
          
          {!carregandoAvaliacoes && <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => props.history.push('/avaliacao/' + paciente.codigo)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>}
          
        </div>}
        
      </IonContent>
    </IonPage>
  );
}

export default Avaliacao;

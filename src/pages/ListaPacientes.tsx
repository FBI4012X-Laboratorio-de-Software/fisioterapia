import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonPage, IonFab, IonFabButton, IonIcon, useIonViewWillEnter, IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonRefresher, IonRefresherContent, IonButton, IonInput, IonAlert, IonRow, IonCol, IonSpinner } from '@ionic/react';
import { add, closeOutline, searchOutline, arrowBack } from 'ionicons/icons';
import { getUltimosPacientesCadastrados } from '../config/firebase';
import { formatCpf } from './../config/utils';
import { deletePacientePorId } from './../config/firebase';

const ListaPacientes: React.FC = (props : any) => {
  
  const [dados, setDados] = useState<Array<{key: string, nome: string, cpf: string}>>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [carregaPrimeiraVez, setCarregaPrimeira] = useState<boolean>(true);
  const [mostraPesquisa, setMostraPesquisa] = useState<boolean>(false);
  const [filtro, setFiltro] = useState<string>('');
  const [confirma, setConfirma] = useState<boolean>(false);
  const [pacienteExluir, setPacienteExcluir] = useState<{ key: string, nome: string, cpf: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const searchInput = React.useRef<HTMLIonInputElement>(null)
  
  const routeName = 'Lista Pacientes';
  
  useIonViewWillEnter(() => {
    carregaDados();
  });
  
  function carregaDados() {
    setCarregando(true);
    getUltimosPacientesCadastrados(null).then(e => gotData(e)).finally(() => {
      setCarregaPrimeira(false);
      setCarregando(false);
    });
  }
  
  const atualiza = (event: any) => {
    setCarregando(true);
    getUltimosPacientesCadastrados(null).then(e => gotData(e)).finally(() => {
      event.detail.complete();
      setCarregando(false);
    });
  }
  
  function gotData(data: any) {
    
    setDados([]);
    
    if (data && data.length <= 0) {
      return;
    }
    
    const pac = [];
    for (let paciente of data) {
      pac.push({ key: paciente.codigo, nome: paciente.nome, cpf: formatCpf(paciente.cpf) });
    }
    setDados(pac);
    
  }
  
  const focaSearch = () => {
    setTimeout(async () => {
      const el = await searchInput.current?.getInputElement();
      el?.focus();
    }, 200);
  }
  
  const confirmaExclusao = (paciente: any) => {
    setConfirma(true);
    setPacienteExcluir(paciente);
  };
  
  const excluirPaciente = () => {
    
    deletePacientePorId(pacienteExluir!.key).then((resp: any) => {
      
      if (resp === true) {
        carregaDados();
      } else {
        setErrorMessage(resp);
      }
      
    })
  }
  
  const dadosMostra = dados.filter((data) => {
    if (filtro) {
      if (data.nome.toLowerCase().includes(filtro.toLowerCase())) {
        return data;
      } else if (data.cpf.includes(filtro)) {
        return data;
      }
      return null;
    } else {
      return data;
    }
  })
  
  return (
  <IonPage>
      
    <IonAlert
        isOpen={confirma}
        onDidDismiss={() => setConfirma(false)}
        header={'Exclusão!'}
        message={'Confirma exclusão do paciente?'}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              setConfirma(false);
            }
          },
          {
            text: 'Confirmar',
            handler: () => {
              excluirPaciente();
            }
          }
        ]}
      />
    
    <IonAlert isOpen={!!errorMessage} message={errorMessage} backdropDismiss={false} buttons={[ { text: 'Ok', handler: () => setErrorMessage('') } ]}></IonAlert>
    
    <IonHeader>
      <IonToolbar>
        
        {!mostraPesquisa && <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>}
        {!mostraPesquisa && <IonButtons slot="end">
          <IonButton onClick={() => { setMostraPesquisa(true); focaSearch(); } }>
            <IonIcon slot="icon-only" icon={searchOutline} />
          </IonButton>
        </IonButtons>}
        {!mostraPesquisa && <IonTitle>{ routeName }</IonTitle>}
        
        {mostraPesquisa && <IonButtons slot="start">
          <IonButton onClick={() => { setMostraPesquisa(false); setFiltro('');} }>
            <IonIcon slot="icon-only" icon={arrowBack} />
          </IonButton>
        </IonButtons>}
        
        {mostraPesquisa && 
          <IonInput ref={searchInput} placeholder="Filtrar nome ou cpf" value={filtro} onIonChange={e => setFiltro(e!.detail!.value!)}></IonInput>
        }
         
      </IonToolbar>
    </IonHeader>

    <IonContent className="ion-padding">
      
      <IonRefresher slot="fixed" onIonRefresh={atualiza}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
       
      {carregando && carregaPrimeiraVez && <IonRow>
        <IonCol className="ion-text-center ion-margin-top">
          <IonSpinner></IonSpinner>
        </IonCol>
      </IonRow>}
      
      {!carregando && dadosMostra.length > 0 && <IonList>
          { dadosMostra.map((value, key) => 
          <IonItemSliding key={key}>
            <IonItem routerLink={'/paciente/' + value.key} routerDirection="none">
              <IonLabel>
                <h2>{ value.nome }</h2>
                <p>{ value.cpf }</p>
              </IonLabel>
            </IonItem>
            <IonItemOptions>
              <IonItemOption color="danger" onClick={() => { confirmaExclusao(value) }}>
                <IonIcon icon={closeOutline}></IonIcon>
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
          ) }
        </IonList>}
      
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
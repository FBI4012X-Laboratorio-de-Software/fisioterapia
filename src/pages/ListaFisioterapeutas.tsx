import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonRow, IonCol, IonSpinner, useIonViewWillEnter, IonRefresher, IonRefresherContent, IonItemSliding, IonItemOption, IonItemOptions, IonAlert, IonButton, IonInput } from '@ionic/react';
import React, { useState } from 'react';
import { add, closeOutline, searchOutline, arrowBack } from 'ionicons/icons';
import { getUltimosFisioterapeutasCadastrados, deleteFisioterapeutaPorId, buscaPacientesDoFisioterapeuta } from '../config/firebase';
import { deleteUserFromAuthBase } from './../config/firebase';

const ListaFisioterapeutas: React.FC = (props: any) => {
  
  const routeName = 'Lista fisioterapeutas';
  const searchInput = React.useRef<HTMLIonInputElement>(null)
  
  const [dados, setDados] = useState<Array<{key: string, nome: string, cpf: string}>>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [carregaPrimeiraVez, setCarregaPrimeira] = useState<boolean>(true);
  const [confirma, setConfirma] = useState<boolean>(false);
  const [fisioExcluir, setFisioExcluir] = useState<{ key: string, nome: string, cpf: string } | null>(null);
  const [mostraPesquisa, setMostraPesquisa] = useState<boolean>(false);
  const [filtro, setFiltro] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const carregaDados = () => {
    setCarregando(true);
    getUltimosFisioterapeutasCadastrados(null).then(e => gotData(e)).finally(() => {
      setCarregaPrimeira(false);
    })
  }
  
  useIonViewWillEnter(function() {
    carregaDados();
  });
  
  const atualizaLista = (event: any) => {
    setCarregando(true);
    getUltimosFisioterapeutasCadastrados(null).then(e => gotData(e)).finally(() => {
      event.detail.complete();
    })
  }
  
  function gotData(data: any) {
    
    if (!data) {
      setCarregando(false);
      return;
    }
    
    let fisioterapeutas: Array<{ key: string, nome: string, cpf: string }> = [];
    
    for (let fisio of data) {
      
      let cpf = fisio.cpf;
      
      if (cpf.length >= 3) {
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      }
      if (cpf.length >= 6) {
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      }
      if (cpf.length >= 9) {
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }
      
      fisioterapeutas.push({ key: fisio.codigo, nome: fisio.nome, cpf: cpf });
      
    }
          
    setDados(fisioterapeutas);
    setCarregando(false);
    
  }
  
  const confirmaExclusao = (fisioterapeuta: any) => {
    setConfirma(true);
    setFisioExcluir(fisioterapeuta);
  }
  
  const excluirFisioterapeuta = () => {
    
    buscaPacientesDoFisioterapeuta(fisioExcluir!.key).then(resp => {
      
      if (resp !== null) {
        setErrorMessage('Este fisioterapeuta está vinculado a um ou mais pacientes. Para desativa-lo, modifique o fisioterapeuta!');
        return;
      }
      
      deleteFisioterapeutaPorId(fisioExcluir!.key).then(() => {
        deleteUserFromAuthBase(fisioExcluir!.cpf.replace(/[^\d]/g, "")).then(() => {
          
          setCarregando(true);
          getUltimosFisioterapeutasCadastrados(null).then(e => gotData(e)).finally(() => {
            setCarregaPrimeira(false);
          })
          
        });
      });
      
    })
    
  }
  
  const focaSearch = () => {
    setTimeout(async () => {
      const el = await searchInput.current?.getInputElement();
      el?.focus();
    }, 200);
  }
  
  let dadosMostra = dados.filter((data) => {
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
          message={'Confirma exclusão do fisioterapeuta?'}
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
                excluirFisioterapeuta();
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
        
        <IonRefresher slot="fixed" onIonRefresh={atualizaLista}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        
        {carregando && carregaPrimeiraVez && <IonRow>
          <IonCol className="ion-text-center ion-margin-top">
            <IonSpinner></IonSpinner>
          </IonCol>
        </IonRow>}
        
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => props.history.push('/fisioterapeuta/novo')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        
        {!carregando && dados.length === 0 &&<IonRow>
          <IonCol className="ion-text-center">
            Ainda não há dados cadastrados!
          </IonCol>
        </IonRow>}
        
        {!carregando && dadosMostra.length > 0 && <IonList>
          { dadosMostra.map((value, key) => 
          <IonItemSliding key={key}>
            <IonItem routerLink={'/fisioterapeuta/' + value.key} routerDirection="none">
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
        
      </IonContent>
      
    </IonPage>
  );
};

export default ListaFisioterapeutas;


import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonRow, IonCol, IonSpinner, useIonViewWillEnter, IonRefresher, IonRefresherContent, IonItemSliding, IonItemOption, IonItemOptions, IonAlert } from '@ionic/react';
import React, { useState } from 'react';
import { add, closeOutline } from 'ionicons/icons';
import { getUltimosFisioterapeutasCadastrados, deleteFisioterapeutaPorId } from '../config/firebase';
import { firebaseToFisioterapeuta } from '../config/classes';
import { deleteUserFromAuthBase } from './../config/firebase';

const ListaFisioterapeuta: React.FC = (props: any) => {
  
  const routeName = 'Lista fisioterapeutas';
  
  const [dados, setDados] = useState<Array<{key: string, nome: string, cpf: string}>>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [carregaPrimeiraVez, setCarregaPrimeira] = useState<boolean>(true);
  const [confirma, setConfirma] = useState<boolean>(false);
  const [fisioExcluir, setFisioExcluir] = useState<{ key: string, nome: string, cpf: string } | null>(null);
  
  useIonViewWillEnter(function() {
    
    setCarregando(true);
    getUltimosFisioterapeutasCadastrados(50, gotData, errorData).finally(() => {
      setCarregaPrimeira(false);
    });
    
  });
  
  const atualizaLista = (event: any) => {
    setCarregando(true);
    getUltimosFisioterapeutasCadastrados(50, gotData, errorData).finally(() => {
      event.detail.complete();
    })
  }
  
  function gotData(data: any) {
    
    if (!data.val()) {
      setCarregando(false);
      return;
    }
    
    let valor = data.val();
    let fisioterapeutas = [];
    const keys = Object.keys(valor);
    
    for (let key of keys) {
      
      const fisioterapeuta = firebaseToFisioterapeuta(valor[key]);
      
      let cpf = fisioterapeuta.cpf.replace(/[^\d]/g, "");
      
      if (cpf.length >= 3) {
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      }
      if (cpf.length >= 6) {
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
      }
      if (cpf.length >= 9) {
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      }
      
      const dado = {
        key: key,
        nome: fisioterapeuta.nome,
        cpf: cpf
      }
      
      fisioterapeutas.push(dado);
      
    }
    
    setDados(fisioterapeutas);
    setCarregando(false);
    
  }
  
  function errorData(error: any) {
    console.log(error);
    setCarregando(false);
  }
  
  const confirmaExclusao = (fisioterapeuta: any) => {
    setConfirma(true);
    setFisioExcluir(fisioterapeuta);
  }
  
  const excluirFisioterapeuta = () => {
    
    deleteFisioterapeutaPorId(fisioExcluir!.key).then(() => {
      deleteUserFromAuthBase(fisioExcluir!.cpf.replace(/[^\d]/g, "")).then(() => {
        
        setCarregando(true);
        getUltimosFisioterapeutasCadastrados(50, gotData, errorData).finally(() => {
          setCarregaPrimeira(false);
        });
        
      });
    });
    
  }
  
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
      
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
            <IonTitle>{ routeName }</IonTitle>
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
        
        {!carregando && dados.length > 0 && <IonList>
          { dados.map((value, key) => 
          <IonItemSliding key={key}>
            <IonItem onClick={() => props.history.push('/fisioterapeuta/' + value.key)}>
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

export default ListaFisioterapeuta;


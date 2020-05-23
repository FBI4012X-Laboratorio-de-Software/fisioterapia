import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonLabel, IonRow, IonCol, IonSpinner, useIonViewWillEnter, IonRefresher, IonRefresherContent, IonItemSliding, IonItemOption, IonItemOptions } from '@ionic/react';
import React, { useState } from 'react';
import { add } from 'ionicons/icons';
import { getUltimosFisioterapeutasCadastrados } from '../config/firebase';
import { Fisioterapeuta, firebaseToFisioterapeuta } from '../config/classes';

const ListaFisioterapeuta: React.FC = (props: any) => {
  
  const routeName = 'Lista fisioterapeutas';
  
  const [dados, setDados] = useState<Array<Fisioterapeuta>>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [carregaPrimeiraVez, setCarregaPrimeira] = useState<boolean>(true);
  
  useIonViewWillEnter(function() {
    
    setCarregando(true);
    getUltimosFisioterapeutasCadastrados(50, gotData, errorData).finally(() => {
      setCarregaPrimeira(false);
    })
    
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
      
      fisioterapeuta.cpf = cpf;
      
      fisioterapeutas.push(fisioterapeuta);
      
    }
    
    setDados(fisioterapeutas);
    setCarregando(false);
    
  }
  
  function errorData(error: any) {
    console.log(error);
    setCarregando(false);
  }
  
  const excluiFisioterapeuta = (fisioterapeuta: Fisioterapeuta) => {
    
    alert('Ainda não implementado!');
    
  }
  
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
            <IonItem>
              <IonLabel>
                <h2>{ value.nome }</h2>
                <p>{ value.cpf }</p>
              </IonLabel>
            </IonItem>
            <IonItemOptions>
              <IonItemOption color="danger" onClick={() => { excluiFisioterapeuta(value) }}>
                Excluir
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


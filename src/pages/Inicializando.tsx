import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import { useState } from 'react';

const { Storage } = Plugins;

const Inicializando: React.FC = (props: any) => {
  
  const [verificando, setVerificando] = useState<boolean>(false);
  
  const verificaSessao = () => {
    
    if (verificando) {
      return;
    }
    
    setVerificando(true);
    
    Storage.get({ key: 'usuario_id' }).then((value) => {
      
      const path = window.location.pathname;
      let mudou = false;
      
      if (value.value) {
        if (path === '/login' || path === '/troca-senha') {
          props.history.push('/paciente/novo');
          mudou = true;
        }
      } else {
        if (path !== '/login' && path !== '/troca-senha') {
          props.history.push('/login');
          mudou = true;
        }
      }
      
      if (!mudou) {
        props.history.push('/avaliacoes');
      }
      
      // setVerificando(false);
      
    })
    
  }
  
  verificaSessao();
  
  return (
    <IonPage>
      
      <IonContent className="ion-padding">
        
        carregando
        
      </IonContent>
        
    </IonPage>
  );
  
}

export default Inicializando;

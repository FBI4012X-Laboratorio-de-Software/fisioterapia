import { IonContent, IonPage, IonInput, IonItem, IonLabel, IonButton, IonRow, IonCol, IonAlert, IonSpinner, useIonViewWillEnter, IonImg } from '@ionic/react';
import React, { useState } from 'react';

import { useHistory } from 'react-router';
import { Plugins } from '@capacitor/core';
import { authFromBaseWithCpf, getUserFromAuthBase } from '../config/firebase';

const { Storage } = Plugins;

const Login: React.FC = () => {
  
  const [loading, setLoading] = useState<boolean>(false);
  const [cpf, setCpf] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const history = useHistory();
  
  const imgStyle = {
    maxWidth: '200px',
    left: '0',
    right: '0',
    margin:'0 auto',
  };
  
  useIonViewWillEnter(() => {
    setPassword('');
  });
  
  const doLogin = async () => {
    
    setErrorMessage('');
    
    const cpfStr = cpf.replace(/[^\d]/g, "");
    
    if (!cpfStr || !password) {
      setErrorMessage('Preencha usuário e senha!');
      return;
    }
    
    setLoading(true);
    
    getUserFromAuthBase(cpfStr).then(data => {
      
      if (!data) {
        setErrorMessage('Cpf ou senha inválidos');
        return;
      }
      
      if (!data.ativo) {
        setErrorMessage('Usuário não ativo!');
        return;
      }
      
      if (!data.senha) {
        setErrorMessage('Senha ainda não cadastrada! Acesse a opção "TROCAR SENHA" para cadastrar uma.');
        return;
      }
      
      if (data.senha !== password) {
        setErrorMessage('Cpf ou senha inválidos');
        return;
      }
      
      Storage.set({ key: 'usuario_id', value: data.id });
      Storage.set({ key: 'usuario_nome', value: data.nome });
      Storage.set({ key: 'usuario_email', value: data.email });
      Storage.set({ key: 'usuario_tipo', value: data.tipo });
      
      history.replace('/fisioterapeutas/lista');
      
    }, () => {
      setErrorMessage('Algum erro ocorreu ao processar esta opção!');
    }).finally(() => {
      setLoading(false);
    })
    
  };
  
  const changeCpf = (e: any) => {
    
    let cpf = e.detail.value!.trim();
    cpf = cpf.replace(/[^\d]/g, "");
    
    if (cpf.length >= 3) {
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    }
    if (cpf.length >= 6) {
      cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    }
    if (cpf.length >= 9) {
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    
    setCpf(cpf);
  }
  
  const abreTelaTrocaSenha = () => {
    history.replace('/trocar-senha');
  }
  
  return (
    <IonPage>
      <IonContent className="ion-padding">
        
        <IonAlert isOpen={!!errorMessage} message={errorMessage} backdropDismiss={false} buttons={[ { text: 'Ok', handler: () => setErrorMessage('') } ]}></IonAlert>
        
        <IonRow className="ion-margin-bottom">
          <IonCol>
           <IonImg src="../assets/logo.png" style={imgStyle} class="ion-align-self-end" />
          </IonCol>
        </IonRow>
        
        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">CPF</IonLabel>
              <IonInput value={cpf} onIonChange={changeCpf} maxlength={14}></IonInput>
            </IonItem>
          </IonCol>
        </IonRow>
        
        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">Senha</IonLabel>
              <IonInput type="password" value={password} onIonChange={(e: any) => setPassword(e.target.value)}></IonInput>
            </IonItem>
          </IonCol>
        </IonRow>
        
        <IonRow>
          <IonCol>
            <IonButton expand="block" color="success" onClick={doLogin}>
              {loading && <IonSpinner />}
              {!loading && 'Entrar'}
            </IonButton>
          </IonCol>
        </IonRow>
        
        <IonRow>
          <IonCol class="ion-text-right">
            <IonButton color="light" onClick={abreTelaTrocaSenha}>
              Trocar senha
            </IonButton>
          </IonCol>
        </IonRow>
        
        {/* <IonRow className="ion-padding-top">
          <IonCol>
            Usuario: 999.999.999-99
            <br />
            Senha: admin
          </IonCol>
        </IonRow> */}
        
      </IonContent>
    </IonPage>
  );
};

export default Login;

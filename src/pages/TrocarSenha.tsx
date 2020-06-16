import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonIcon, IonButtons, useIonViewWillEnter, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonRow, IonCol, IonAlert, IonSpinner } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { getUserFromAuthBase, alteraUsuario } from '../config/firebase';
import { formatCpf } from '../config/utils';

const TrocarSenha: React.FC = () => {
  
  const [cpf, setCpf] = useState<string>();
  const [senhaAntiga, setSenhaAntiga] = useState<string>();
  const [senhaNova, setSenhaNova] = useState<string>();
  const [leuCpf, setLeuCpf] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [leSenhaAnt, setLeSenhaAnt] = useState<boolean>();
  const [senhaAtual, setSenhaAtual] = useState<string>();
  const [buscandoCpf, setBuscandoCpf] = useState<boolean>(false);
  
  useIonViewWillEnter(() => {
    setLeuCpf(false);
    setCpf('');
    setSenhaAntiga('');
    setSenhaNova('');
    setSenhaAtual('');
  })
  
  const history = useHistory();
  
  const telaLogin = () => {
    history.replace('/login');
  }
  
  const alteraCpf = (e: any) => {
    setCpf(formatCpf(e.detail.value!.trim()));
  }
  
  const validaCpf = () => {
    
    if (!cpf || cpf.length !== 14) {
      return;
    }
    
    const cpfSemPontuacao = cpf.replace(/[^\d]/g, "");
    setBuscandoCpf(true);
    
    getUserFromAuthBase(cpfSemPontuacao).then((resp: any) => {
      
      if (resp) {
        setLeuCpf(true);
        setBuscandoCpf(false);
        setSenhaAtual('');
        if (resp.senha) {
          setLeSenhaAnt(true)
          setSenhaAtual(resp.senha);
        } else {
          setLeSenhaAnt(false);
        }
      } else {
        setErrorMessage('CPF não encontrado!');
        setBuscandoCpf(false);
      }
      
    })
    
  }
  
  const cancelaAlteracao = () => {
    setLeuCpf(false);
    setCpf('');
    setSenhaAntiga('');
    setSenhaNova('');
  }
  
  const temCpf = () => {
    return cpf && cpf.length === 14;
  }
  
  const temSenha = () => {
    if (leSenhaAnt && !senhaAntiga) {
      return false;
    }
    return !!senhaNova;
  }
  
  const alteraSenha = () => {
    
    if (leSenhaAnt) {
      if (senhaAntiga !== senhaAtual) {
        setErrorMessage('Senha incorreta!');
        return;
      }
    }
    
    const cpfSemPontuacao = cpf!.replace(/[^\d]/g, "");
    
    alteraUsuario(cpfSemPontuacao, { senha: senhaNova }).then(resp => {
      if (resp) {
        history.replace('/login');
      } else {
        setErrorMessage('Erro ao alterar a senha!');
      }
    });
    
  }
  
  return (
    <IonPage>
      
      <IonAlert isOpen={!!errorMessage} message={errorMessage} backdropDismiss={false} buttons={[ { text: 'Ok', handler: () => setErrorMessage('') } ]}></IonAlert>
      
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start" className="ion-padding" onClick={telaLogin}>
            <IonIcon icon={arrowBack} />
          </IonButtons>
          <IonTitle>Trocar senha</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        
        <IonList>
          
          <IonItem>
            <IonLabel position="floating">Cpf</IonLabel>
            <IonInput value={cpf} onIonChange={alteraCpf} disabled={leuCpf} maxlength={14}></IonInput>
          </IonItem>
        
        </IonList>
        
        {!leuCpf && <IonRow className="ion-margin-top">
          <IonCol className="ion-text-right">
            <IonButton color="primary" onClick={validaCpf} disabled={!temCpf()} style={{ 'width': '125px' }}>
              {buscandoCpf && <IonSpinner />}
              {!buscandoCpf && 'Continuar'}
            </IonButton>
          </IonCol>
        </IonRow>}
        
        {leuCpf && <IonList>
          
          {leSenhaAnt && <IonItem>
            <IonLabel position="floating">Senha Anterior</IonLabel>
            <IonInput type="password" value={senhaAntiga} onIonChange={e => setSenhaAntiga(e.detail.value!)}></IonInput>
          </IonItem>}
          
          <IonItem>
            <IonLabel position="floating">Senha Nova</IonLabel>
            <IonInput type="password" value={senhaNova} onIonChange={e => setSenhaNova(e.detail.value!)}></IonInput>
          </IonItem>
          
        </IonList>}
        
        {leuCpf && <IonRow className="ion-margin-top">
          <IonCol className="ion-text-left">
            <IonButton color="danger" onClick={cancelaAlteracao}>
              Cancelar
            </IonButton>
          </IonCol>
          <IonCol className="ion-text-right">
            <IonButton color="primary" disabled={!temSenha()} onClick={alteraSenha}>
              Alterar
            </IonButton>
          </IonCol>
        </IonRow>}
        
      </IonContent>

    </IonPage>
  );
  
}

export default TrocarSenha;
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonToast, IonList, IonListHeader, IonItem, IonLabel, IonInput, IonDatetime, IonSelect, IonSelectOption, IonToggle, IonRow, IonCol, IonButton } from '@ionic/react';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Fisioterapeuta } from './../config/classes';
import { checkmark, checkmarkSharp } from 'ionicons/icons';

interface FisioterapeutaProps extends RouteComponentProps<{
  id: string;
}> {}

const CadastroFisioterapeuta: React.FC<FisioterapeutaProps> = (props) => {
  
  const novoCadastro = props.match.params.id === 'novo';
  const routeName = novoCadastro ? 'Novo fisioterapeuta' : 'Editar fisioterapeuta';
  
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [sexo, setSexo] = useState<'f' | 'm'>('f');
  const [cpf, setCpf] = useState<string>('');
  const [endereco, setEndereco] = useState<string>('');
  const [cep, setCep] = useState<string>('');
  const [ativo, setAtivo] = useState<boolean>(true);
  const [senha, setSenha] = useState<string>('');
  const [nascimento, setNascimento] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  const [fisioterapeutaAtual, setFisioterapeutaAtual] = useState<Fisioterapeuta>();
  const [carregando, setCarregando] = useState<boolean>(false);
  
  const cadastrar = () => {
    
  };
  
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
      <IonContent class="ion-padding-bottom">
        
        <IonToast isOpen={!!erro} onDidDismiss={e => setErro('')} message={erro} duration={4000} />
        
        {!carregando && <IonList>
          
          <IonListHeader color="secundary">
            Dados Pessoais
          </IonListHeader>
          
          <IonItem>
            <IonLabel position="floating">Nome</IonLabel>
            <IonInput value={nome} onIonChange={e => setNome(e.detail.value!)}></IonInput>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">E-mail</IonLabel>
            <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)}></IonInput>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">Data de Nascimento</IonLabel>
            <IonDatetime value={nascimento} onIonChange={e => setNascimento(e.detail!.value!)} />
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">Sexo</IonLabel>
            <IonSelect value={sexo} onIonChange={e => setSexo(e.detail.value)}>
              <IonSelectOption value="f">Feminino</IonSelectOption>
              <IonSelectOption value="m">Masculino</IonSelectOption>
            </IonSelect>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">CPF</IonLabel>
            <IonInput value={cpf} onIonChange={e => setCpf(e.detail.value!)}></IonInput>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">Endereço</IonLabel>
            <IonInput value={endereco} onIonChange={e => setEndereco(e.detail.value!)}></IonInput>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">CEP</IonLabel>
            <IonInput value={cep} onIonChange={e => setCep(e.detail.value!)}></IonInput>
          </IonItem>
          
        </IonList>}
        
        {!carregando && <IonList className="ion-margin-top">
          
          <IonListHeader>
            Configuração
          </IonListHeader>
          
          {!novoCadastro && <IonItem>
            <IonLabel>Ativo</IonLabel>
            <IonToggle value="ativo" checked={ativo} onIonChange={e => setAtivo(e.detail.value)} />
          </IonItem>}
          
          <IonItem>
            <IonLabel position="floating">Senha</IonLabel>
            <IonInput type="password" value={senha} onIonChange={e => setSenha(e.detail.value!)}></IonInput>
          </IonItem>
          
        </IonList>}
        
        {!carregando && <IonRow>
          <IonCol className="ion-text-right">
            <IonButton color="success" onClick={cadastrar}>
              <IonIcon icon={checkmarkSharp} slot="start"></IonIcon>
              Salvar
            </IonButton>
          </IonCol>
        </IonRow>}
        
      </IonContent>
    </IonPage>
    
  );
};

export default CadastroFisioterapeuta;


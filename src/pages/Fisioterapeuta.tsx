import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonIcon, IonToast, IonList, IonListHeader, IonItem, IonLabel, IonInput, IonDatetime, IonSelect, IonSelectOption, IonToggle, IonRow, IonCol, IonButton, IonSpinner } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { checkmarkSharp } from 'ionicons/icons';
import { getKeyNovoFisioterapeuta, cadastrarFisioterapeuta, buscaFisioterapeutaPorId, timestampToDate, getUserFromAuthBase } from '../config/firebase';
import { addUserToAuthBase, deleteUserFromAuthBase } from './../config/firebase';
import { formatCpf, validaEmail, validaCpf } from '../config/utils';

interface FisioterapeutaProps extends RouteComponentProps<{
  id: string;
}> {}

const CadastroFisioterapeuta: React.FC<FisioterapeutaProps> = (props) => {
  
  let novoCadastro = props.match.params.id === 'novo';
  let routeName = novoCadastro ? 'Novo fisioterapeuta' : 'Editar fisioterapeuta';
  let id = props.match.params.id;
  
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [sexo, setSexo] = useState<'f' | 'm'>('f');
  const [cpf, setCpf] = useState<string>('');
  const [endereco, setEndereco] = useState<string>('');
  const [cep, setCep] = useState<string>('');
  const [ativo, setAtivo] = useState<boolean>(false);
  const [nascimento, setNascimento] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);
  const [gravando, setGravando] = useState<boolean>(false);
  const [erroCadastro, setErroCadastro] = useState<string>('');
  const [idAnterior, setIdAnterior] = useState<string>('');
  const [crefito, setCrefito] = useState<string>();
  
  if (!idAnterior || idAnterior !== id) {
    
    setCarregando(false);
    setGravando(false);
    
    setNome('');
    setEmail('');
    setSexo('f');
    // setSenha('');
    setCpf('');
    setCep('');
    setNascimento('');
    setEndereco('');
    setAtivo(true);
    setCrefito('');

    if (!novoCadastro) {
      carregaFisioterapeuta();
    }
    
    setIdAnterior(id);
    
  }
  
  useEffect(function() {
    
    if (!nome) {
      setErroCadastro('Nome deve ser preenchido!');
      return;
    }
    
    if (!email) {
      setErroCadastro('E-mail deve ser preenchido!');
      return
    } else {
      if (!validaEmail(email)) {
        setErroCadastro('E-mail invalido!');
        return;
      }
    }
    
    if (!nascimento) {
      setErroCadastro('Data de nascimento invalida!');
      return;
    }
    
    if (!cpf || !validaCpf(cpf)) {
      setErroCadastro('CPF invalido!');
      return;
    }
    
    if (!endereco) {
      setErroCadastro('Endereço deve ser preenchido!');
      return;
    }
    
    if (!cep) {
      setErroCadastro('CEP deve ser informado!');
      return;
    }
    
    if (!crefito) {
      setErroCadastro('Crefito deve ser informado!');
      return;
    }
    
    // if (!senha) {
    //   setErroCadastro('Senha deve ser informada!');
    //   return;
    // }
    
    setErroCadastro('');
    
  }, [nome, email, nascimento, cpf, endereco, cep, crefito])
  
  function carregaFisioterapeuta() {
    
    setCarregando(true);
    
    buscaFisioterapeutaPorId(id).then((fisio: any) => {
      
      setCep(fisio.cep);
      setCpf(formatCpf(fisio.cpf));
      setEmail(fisio.email);
      setEndereco(fisio.endereco);
      setNome(fisio.nome);
      setSexo(fisio.sexo);
      setCrefito(fisio.crefito);
      setNascimento(timestampToDate(fisio.dataNascimento).toString());
      
      getUserFromAuthBase(fisio.cpf).then((resp: any) => {
        
        if (resp) {
          setAtivo(resp.ativo);
        }
        
        setCarregando(false);
        
      });
      
    });
    
  }
  
  const cadastrar = () => {
    
    getUserFromAuthBase(cpf.replace(/[^\d]/g, "")).then(resp => {
      
      if (resp !== null) {
        if (novoCadastro) {
          setErro('Cpf ja cadastrado em outro usuário!')
          return;
        } else {
          if (resp.id !== id) {
            setErro('Cpf ja cadastrado em outro usuário!')
            return;
          }
        }
      }
      
      cadastraFisio();
      
    });
    
    function cadastraFisio() {
      
      setGravando(true);
      
      if (!novoCadastro) {
        salvaFisio(id);
      } else {
        getKeyNovoFisioterapeuta().then(key => {
          salvaFisio(key);
        })
      }
      
    }
    
  };
  
  function salvaFisio(key: string) {
    
    const fisioterapeuta = {
      nome: nome,
      email: email,
      sexo: sexo,
      cpf: cpf.replace(/[^\d]/g, ""),
      endereco: endereco,
      cep: cep,
      ativo: ativo,
      crefito: crefito,
      dataNascimento: new Date(nascimento)
    };
    
    cadastrarFisioterapeuta(key, fisioterapeuta).then(() => {
      
      if (!novoCadastro) {
        deleteUserFromAuthBase(fisioterapeuta.cpf);
      }
      
      addUserToAuthBase(fisioterapeuta.cpf, email, '', key, nome, 'F', true).then(() => {
        
        setCarregando(false);
        setGravando(false);
        props.history.push('/fisioterapeutas/lista');
        
      })
      
    });
  
  }
  
  const changeCpf = (e: any) => {
    setCpf(formatCpf(e.detail.value!.trim()));
  }
  
  const checkAtivo = (e: any) => {
    setAtivo(e.target.checked);
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
        
        <IonToast isOpen={!!erro} onDidDismiss={e => setErro('')} message={erro} duration={4000} />
        
        {carregando && <IonRow>
          <IonCol className="ion-text-center">
            <IonSpinner></IonSpinner>
          </IonCol>  
        </IonRow>}
        
        {!carregando && <IonList>
          
          <IonListHeader color="secundary">
            Dados Pessoais
          </IonListHeader>
          
          <IonItem>
            <IonLabel position="floating">Nome</IonLabel>
            <IonInput value={nome} onIonChange={e => setNome(e.detail.value!)} disabled={gravando}></IonInput>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">E-mail</IonLabel>
            <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} disabled={gravando}></IonInput>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">Data de Nascimento</IonLabel>
            <IonDatetime value={nascimento} onIonChange={e => setNascimento(e.detail!.value!)} disabled={gravando}/>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">Sexo</IonLabel>
            <IonSelect value={sexo} onIonChange={e => setSexo(e.detail.value)} disabled={gravando}>
              <IonSelectOption value="f">Feminino</IonSelectOption>
              <IonSelectOption value="m">Masculino</IonSelectOption>
            </IonSelect>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">CPF</IonLabel>
            <IonInput value={cpf} onIonChange={changeCpf} disabled={gravando} maxlength={14}></IonInput>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">Crefito</IonLabel>
            <IonInput value={crefito} onIonChange={e => setCrefito(e.detail.value!)} disabled={gravando} maxlength={30}></IonInput>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">Endereço</IonLabel>
            <IonInput value={endereco} onIonChange={e => setEndereco(e.detail.value!)} disabled={gravando}></IonInput>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">CEP</IonLabel>
            <IonInput value={cep} onIonChange={e => setCep(e.detail.value!)} disabled={gravando}></IonInput>
          </IonItem>
          
        </IonList>}
        
        {!carregando && !novoCadastro && <IonList className="ion-margin-top">
          
          <IonListHeader>
            Configuração
          </IonListHeader>
          
          {!novoCadastro && <IonItem>
            <IonLabel>Ativo</IonLabel>
            <IonToggle checked={ativo} onIonChange={checkAtivo} disabled={gravando}/>
          </IonItem>}
          
        </IonList>}
        
        {!carregando && <IonRow>
          <IonCol className="ion-text-right">
            <IonButton color="success" onClick={cadastrar} disabled={!!erroCadastro}>
              <IonIcon icon={checkmarkSharp} slot="start"></IonIcon>
              Salvar
            </IonButton>
          </IonCol>
        </IonRow>}
        
        {gravando && <IonRow>
          <IonCol className="ion-text-center">
            <IonSpinner></IonSpinner>
          </IonCol>  
        </IonRow>}
        
      </IonContent>
    </IonPage>
    
  );
};

export default CadastroFisioterapeuta;

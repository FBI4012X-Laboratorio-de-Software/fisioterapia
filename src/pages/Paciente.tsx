import React, { useState, useEffect } from 'react';
import { IonPage, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonContent, IonSelect, IonSelectOption, IonListHeader, useIonViewDidEnter, IonRow, IonCol, IonButton, IonIcon, IonSpinner, IonToast } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { buscaGruposPacientes, getUltimosFisioterapeutasCadastrados, cadastrarPaciente, dateToTimestamp, buscaPacientePorId, timestampToDate, getUserFromAuthBase, deleteUserFromAuthBase } from '../config/firebase';
import { checkmarkSharp } from 'ionicons/icons';
import { getKeyNovoPaciente, addUserToAuthBase } from './../config/firebase';
import { formatCpf, validaEmail, validaCpf } from '../config/utils';

interface FisioterapeutaProps extends RouteComponentProps<{
  id: string;
}> {}

const Paciente: React.FC<FisioterapeutaProps> = props => {
  
  const [gravando, setGravando] = useState<boolean>(false);
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [sexo, setSexo] = useState<'f' | 'm'>('f');
  const [cpf, setCpf] = useState<string>('');
  const [endereco, setEndereco] = useState<string>('');
  const [cep, setCep] = useState<string>('');
  const [nascimento, setNascimento] = useState<string>('');
  const [grupo, setGrupo] = useState<string>();
  const [fisioResp, setFisioResp] = useState<{ codigo: string, nome: string }>();
  const [carregandoGrupo, setCarregandoGrupo] = useState<boolean>(false);
  const [carregandoFisio, setCarregandoFisio] = useState<boolean>(false);
  const [carregandoPaciente, setCarregandoPaciente] = useState<boolean>(false);
  const [gruposPacientes] = useState<Array<{ codigo: string, descricao: string }>>([]);
  const [listaFisio] = useState<Array<{ codigo: string, nome: string }>>([]);
  const [idAnterior, setIdAnterior] = useState<string>('');
  const [erroCadastro, setErroCadastro] = useState<string>('');
  const [erro, setErro] = useState<string>('');

  let novoCadastro = props.match.params.id === 'novo';
  const routeName = novoCadastro ? 'Novo paciente' : 'Editar paciente';
  const id = props.match.params.id;
  
  if (!idAnterior || idAnterior !== id) {
    
    if (!novoCadastro) {
      setCarregandoPaciente(true);
      buscaPacientePorId(id).then((resp: any) => {
        
        setNome(resp.nome);
        setEmail(resp.email);
        setNascimento(timestampToDate(resp.nascimento).toString())
        setSexo(resp.sexo);
        setCpf(formatCpf(resp.cpf));
        setEndereco(resp.endereco);
        setCep(resp.cep);
        setGrupo(resp.grupo);
        setFisioResp(resp.responsavel);
        
        setCarregandoPaciente(false);
        
      })
    }
    
    setIdAnterior(id);
    
  }
  
  useIonViewDidEnter(() => {
    carregaGrupos();
    carregaFisioterapeutas();
  });
  
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
    
    if (!grupo) {
      setErroCadastro('Grupo deve ser informado!');
      return;
    }
    
    if (!fisioResp) {
      setErroCadastro('Fisioterapeuta responsável deve ser informado!');
      return;
    }
    
    setErroCadastro('');
    
  }, [nome, email, nascimento, cpf, endereco, cep, grupo, fisioResp])
  
  function carregaGrupos() {
    
    if (gruposPacientes.length === 0) {
      setCarregandoGrupo(true);
    }
    
    buscaGruposPacientes().then((grupos: any) => {
      if (grupos) {
        for (let grupo of grupos) {
          let valAchou = gruposPacientes.find(val => val.codigo === grupo.codigo);
          if (!valAchou) {
            gruposPacientes.push(grupo);
          }
        }
      }
      setCarregandoGrupo(false);
    });
    
  }
  
  function carregaFisioterapeutas() {
    setCarregandoFisio(true);
    getUltimosFisioterapeutasCadastrados(null).then((data: any) => {
      
      if (!data) {
        return;
      }
      
      listaFisio.splice(0, listaFisio.length);
      
      for (let fisio of data) {
        if (fisio && fisio.ativo) {
          listaFisio.push(fisio);
        }
      }
      
      setCarregandoFisio(false);
      
    });
  }
  
  const changeCpf = (e: any) => {
    setCpf(formatCpf(e.detail.value!.trim()));
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
      
      setGravando(true);
    
      const key = novoCadastro ? getKeyNovoPaciente() : id;
      
      const cpfStr = cpf.replace(/[^\d]/g, "");
      
      const data = {
        nome,
        email,
        nascimento: dateToTimestamp(new Date(nascimento)),
        sexo,
        cpf: cpfStr,
        endereco,
        cep,
        grupo: grupo,
        responsavel: fisioResp
      };
      
      cadastrarPaciente(key, data).then(response => {
        setGravando(false);
        
        if (novoCadastro) {
          addUserToAuthBase(cpfStr, email, '', key, nome, 'P', true).then(resp => {
            props.history.push('/pacientes/lista');
          })
        } else {
          deleteUserFromAuthBase(cpfStr).then(resp => {
            addUserToAuthBase(cpfStr, email, '', key, nome, 'P', true).then(resp => {
              props.history.push('/pacientes/lista');
            })
          })
        }
        
      })
      
    });
    
  }
  
  return (
  <IonPage>
    
    <IonToolbar>
      <IonButtons slot="start">
        <IonMenuButton />
      </IonButtons>
      <IonTitle>{ routeName }</IonTitle>
    </IonToolbar>
    
    <IonContent className="ion-padding">
      
      {carregandoPaciente && <IonRow>
        <IonCol className="ion-text-center">
          <IonSpinner></IonSpinner>
        </IonCol>  
      </IonRow>}
      
      <IonToast isOpen={!!erro} onDidDismiss={e => setErro('')} message={erro} duration={4000} />
        
      {!carregandoPaciente && <IonList>
        
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
          <IonLabel position="floating">Endereço</IonLabel>
          <IonInput value={endereco} onIonChange={e => setEndereco(e.detail.value!)} disabled={gravando}></IonInput>
        </IonItem>
        
        <IonItem>
          <IonLabel position="floating">CEP</IonLabel>
          <IonInput value={cep} onIonChange={e => setCep(e.detail.value!)} disabled={gravando}></IonInput>
        </IonItem>
        
        <IonItem>
          <IonLabel position="floating">Grupo</IonLabel>
          <IonSelect value={grupo} onIonChange={e => setGrupo(e.detail.value!)} disabled={gravando || carregandoGrupo}>
            {gruposPacientes.map((grupo, key) => 
              <IonSelectOption key={key} value={grupo.codigo}>{ grupo.descricao }</IonSelectOption>
            )}
          </IonSelect>
        </IonItem>
        
        <IonItem>
          <IonLabel position="floating">Fisioterapeuta Responsável</IonLabel>
          <IonSelect value={fisioResp} onIonChange={e => setFisioResp(e.detail.value!)} disabled={gravando || carregandoFisio}>
            {listaFisio.map((fisio, key) => 
              <IonSelectOption key={key} value={fisio.codigo}>{ fisio.nome }</IonSelectOption>
            )}
          </IonSelect>
        </IonItem>
        
      </IonList>}
      
      {!carregandoPaciente && <IonRow>
        <IonCol className="ion-text-right">
          <IonButton color="success" onClick={cadastrar} disabled={!!erroCadastro} >
            <IonIcon icon={checkmarkSharp} slot="start"></IonIcon>
            Salvar
          </IonButton>
        </IonCol>
      </IonRow>}
      
    </IonContent>
    
  </IonPage>)
}

export default Paciente;
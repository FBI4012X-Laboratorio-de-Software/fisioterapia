import React, { useState } from 'react';
import { IonPage, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonContent, IonSelect, IonSelectOption, IonListHeader, useIonViewDidEnter, IonRow, IonCol, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { buscaGruposPacientes, getUltimosFisioterapeutasCadastrados, cadastrarPaciente, dateToTimestamp, buscaPacientePorId, timestampToDate } from '../config/firebase';
import { checkmarkSharp, cogSharp } from 'ionicons/icons';
import { getKeyNovoPaciente } from './../config/firebase';
import { formatCpf } from '../config/utils';

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
  const [gruposPacientes, setGruposPacientes] = useState<Array<{ codigo: string, descricao: string }>>([]);
  const [listaFisio, setListaFisio] = useState<Array<{ codigo: string, nome: string }>>([]);
  const [idAnterior, setIdAnterior] = useState<string>('');
  
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
    
    setGravando(true);
    
    const key = novoCadastro ? getKeyNovoPaciente() : id;
    
    const data = {
      nome,
      email,
      nascimento: dateToTimestamp(new Date(nascimento)),
      sexo,
      cpf: cpf.replace(/[^\d]/g, ""),
      endereco,
      cep,
      grupo: grupo,
      responsavel: fisioResp
    };
    
    cadastrarPaciente(key, data).then(response => {
      setGravando(false);
      props.history.push('/pacientes/lista');
    })
    
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
          <IonButton color="success" onClick={cadastrar}>
            <IonIcon icon={checkmarkSharp} slot="start"></IonIcon>
            Salvar
          </IonButton>
        </IonCol>
      </IonRow>}
      
    </IonContent>
    
  </IonPage>)
}

export default Paciente;
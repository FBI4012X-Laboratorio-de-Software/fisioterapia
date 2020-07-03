import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonButton, IonRow, IonCol, IonImg, IonIcon, IonToast, IonModal, IonTextarea, IonItem, IonLabel, IonDatetime, IonInput, IonProgressBar, IonSpinner, IonAlert } from '@ionic/react';
import { usePhotoGallery, Photo } from '../hooks/usePhotoGallery';
import { useState } from 'react';
import { camera, checkmarkSharp, timeSharp, closeSharp, closeOutline } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { localeVars } from './../config/localeVars';
import { buscaPacientePorId, getKeyNovaAvaliacao, salvaImagemAvaliacao, cadastrarAvaliacao, dateToTimestamp, buscaAvaliacaoPorId, deleteImagensAvaliacao, deleteAvaliacaoPorId } from '../config/firebase';
import { timestampToDate, getUrlFotoAvaliacao } from './../config/firebase';
import { FOTO_FRONTAL, FOTO_COSTAS, FOTO_ESQUERDA, FOTO_DIREITA } from './../config/constants';

interface CadastrarAvaliacaoParams extends RouteComponentProps<{
  idpaciente: string;
  idavaliacao?: string;
}> {}

interface GravandoImagem {
  salvando: boolean;
  percentualSalvo: number;
  erro: boolean;
}

const CadastrarAvaliacao: React.FC<CadastrarAvaliacaoParams> = props => {
  
  const [fotoFrontal, setFotoFrontal] = useState<Photo | null>(null);
  const [fotoCostas, setFotoCostas] = useState<Photo | null>(null);
  const [fotoEsquerda, setFotoEsquerda] = useState<Photo | null>(null);
  const [fotoDireita, setFotoDireita] = useState<Photo | null>(null);
  const [erro, setErro] = useState<string>();
  const [showModalFoto, setShowModalFoto] = useState<boolean>(false);
  const [tituloModalFoto, setTituloModalFoto] = useState<string>('');
  const [fotoMostra, setFotoMostra] = useState<Photo | null>(null);
  const [observacoes, setObservacoes] = useState<string>('');
  const [dataAvaliacao, setDataAvaliacao] = useState<string>('');
  const [nomePaciente, setNomePaciente] = useState<string>('');
  const [idAnter, setIdAnter] = useState<string>('');
  const [carregandoPaciente, setCarregandoPaciente] = useState<boolean>(false);
  const [carregandoAvaliacao, setCarregandoAvaliacao] = useState<boolean>(false);
  const [idGrava, setIdGrava] = useState<string>();
  const [confirma, setConfirma] = useState<boolean>(false);

  const [gravando, setGravando] = useState<boolean>(false);
  const [gravandoFotoFrontal, setGravandoFotoFrontal] = useState<GravandoImagem>();
  const [gravandoFotoCostas, setGravandoFotoCostas] = useState<GravandoImagem>();
  const [gravandoFotoEsquerda, setGravandoFotoEsquerda] = useState<GravandoImagem>();
  const [gravandoFotoDireita, setGravandoFotoDireita] = useState<GravandoImagem>();
  const [erroGravacao, setErroGravacao] = useState<string>('');
  const [salvouFotos, setSalvouFotos] = useState<boolean>(false);
  
  const routeName = 'Cadastrar avaliação'
  const { takePhoto } = usePhotoGallery();
  
  const idPaciente = props.match.params.idpaciente;
  const idAvaliacao = props.match.params.idavaliacao;
  
  const monthNames = localeVars.monthNames;
  const monthShortNames = localeVars.monthShortNames
  const dayNames = localeVars.dayNames
  const dayShortNames = localeVars.dayShortNames
  
  let dadosValidos = false;
  if (!!dataAvaliacao && !!fotoCostas && !!fotoDireita && !!fotoEsquerda && !!fotoFrontal) {
    dadosValidos = true;
  }
  
  const carregando = carregandoAvaliacao || carregandoPaciente;
  
  if (!idAnter || idAnter !== idPaciente + idAvaliacao) {
    
    setFotoFrontal(null)
    setFotoCostas(null);
    setFotoEsquerda(null)
    setFotoDireita(null);
    setObservacoes('');
    setDataAvaliacao((new Date()).toString());
    setCarregandoPaciente(true);
    
    if (idAvaliacao) {
      
      setCarregandoAvaliacao(true);
      
      buscaAvaliacaoPorId(idPaciente, idAvaliacao).then((resp: any) => {
        setObservacoes(resp.observacoes)
        setDataAvaliacao(timestampToDate(resp.data).toString());
        
        carregaImagemStorage(FOTO_FRONTAL, setFotoFrontal);
        carregaImagemStorage(FOTO_ESQUERDA, setFotoCostas);
        carregaImagemStorage(FOTO_ESQUERDA, setFotoEsquerda);
        carregaImagemStorage(FOTO_DIREITA, setFotoDireita);
        
        setCarregandoAvaliacao(false);
      });
      
    }
    
    buscaPacientePorId(idPaciente).then((resp: any) => {
      if (resp) {
        setNomePaciente(resp.nome);
      }
      setCarregandoPaciente(false);
    })
    
    setIdAnter(idPaciente + idAvaliacao);
  }
  
  function carregaImagemStorage(nome: string, setFunc: any) {
    
    getUrlFotoAvaliacao(idPaciente, idAvaliacao!, nome).then(resp => {
      setFunc({ firebaseUrl: resp });
    })
    
  }
  
  const tirarFoto = async (funcSet: Function) => {
    
    const foto: any = await takePhoto();
    
    if (foto.erro) {
      if (foto.erro === 'Requested device not found') {
        setErro('Não foi encontrado uma camera neste dispositivo!');
      }
      return;
    }
    
    funcSet({ webviewPath: foto.webviewPath, base64: foto.base64 });
    
  }
  
  const mostrarFoto = (foto: any, titulo: string) => {
    setShowModalFoto(true);
    setTituloModalFoto(titulo);
    setFotoMostra(foto);
  }
  
  const alterarFoto = () => {
    const titulo = tituloModalFoto.toLowerCase();
    if (titulo === FOTO_FRONTAL) {
      tirarFoto(setFotoFrontal);
    } else if (titulo === FOTO_COSTAS) {
      tirarFoto(setFotoCostas);
    } else if (titulo === FOTO_ESQUERDA) {
      tirarFoto(setFotoEsquerda);
    } else if (titulo === FOTO_DIREITA) {
      tirarFoto(setFotoDireita);
    }
    setShowModalFoto(false);
  }
  
  const cadastrar = () => {
    
    if (idAvaliacao) {
      cadastraAvaliacao(idAvaliacao);
      setIdGrava(idAvaliacao);
    } else {
      getKeyNovaAvaliacao(idPaciente).then(key => {
        setIdGrava(key);
        cadastraAvaliacao(key);
      })
    }
    
  }
  
  function cadastraAvaliacao(id: string) {
    
    setGravando(true);
    
    gravaFoto(setGravandoFotoFrontal, FOTO_FRONTAL, fotoFrontal!.base64!, id);
    gravaFoto(setGravandoFotoCostas, FOTO_COSTAS, fotoCostas!.base64!, id);
    gravaFoto(setGravandoFotoEsquerda, FOTO_ESQUERDA, fotoEsquerda!.base64!, id);
    gravaFoto(setGravandoFotoDireita, FOTO_DIREITA, fotoDireita!.base64!, id);
    
  }
  
  function gravaFoto(funcSetGrava: any, nomeFoto: string, base64: string, idAval: string) {
    
    if (!base64) {
      funcSetGrava({ salvando: false, percentualSalvo: 100, erro: false });
      return;
    }
    
    funcSetGrava({ salvando: true, percentualSalvo: 0, erro: false });
    salvaImagemAvaliacao(idPaciente, idAval, nomeFoto, base64).on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      funcSetGrava({ salvando: true, percentualSalvo: progress, erro: false });
    }, error => {
      funcSetGrava({ salvando: false, percentualSalvo: 100, erro: true });
      setErroGravacao('Erro ao salvar imagem...');
      console.error(error);
      verificaFotosSalvas(idAval);
    }, () => {
      funcSetGrava({ salvando: false, percentualSalvo: 100, erro: false });
      verificaFotosSalvas(idAval);
    });
  }
  
  function verificaFotosSalvas(id: string) {
    // TODO se der erro em uma deve apagar todas do storage
    
    if (gravandoFotoFrontal?.percentualSalvo !== 100) {
      return;
    }
    
    if (gravandoFotoCostas?.percentualSalvo !== 100) {
      return;
    }
    
    if (gravandoFotoEsquerda?.percentualSalvo !== 100) {
      return;
    }
    
    if (gravandoFotoDireita?.percentualSalvo !== 100) {
      return;
    }
    
    setSalvouFotos(true);
    
    const dados = {
      data: dateToTimestamp(new Date(dataAvaliacao)),
      observacoes: observacoes
    };
    
    cadastrarAvaliacao(id, idPaciente, dados).then(resp => {
      setGravando(false);
      props.history.goBack();
    });
    
  }
  
  const excluirAvaliacao = () => {
    
    deleteImagensAvaliacao(idPaciente, idAvaliacao!, FOTO_FRONTAL);
    deleteImagensAvaliacao(idPaciente, idAvaliacao!, FOTO_COSTAS);
    deleteImagensAvaliacao(idPaciente, idAvaliacao!, FOTO_ESQUERDA);
    deleteImagensAvaliacao(idPaciente, idAvaliacao!, FOTO_DIREITA);
    
    deleteAvaliacaoPorId(idPaciente, idAvaliacao!).then(resp => {
      props.history.goBack();
    });
    
  }
  
  if (gravando && idGrava && !salvouFotos) {
    verificaFotosSalvas(idGrava);
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
        
        <IonAlert
            isOpen={confirma}
            onDidDismiss={() => setConfirma(false)}
            header={'Exclusão!'}
            message={'Confirma exclusão da avaliação?'}
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
                  excluirAvaliacao();
                }
              }
            ]}
          />
      
        <IonModal isOpen={gravando} cssClass="smaller-modal-40" backdropDismiss={false}>
          <IonContent className="ion-padding">
            
            <h4>
              Salvando Imagens...
            </h4>
            
            <IonRow>
              <IonCol size="10">
                Frontal
                <IonProgressBar value={ gravandoFotoFrontal?.percentualSalvo }></IonProgressBar>
              </IonCol>
              <IonCol size="1">
                {gravandoFotoFrontal?.percentualSalvo === 100 && !gravandoFotoFrontal?.erro && <IonIcon icon={checkmarkSharp}></IonIcon>}
                {gravandoFotoFrontal?.percentualSalvo === 100 && gravandoFotoFrontal?.erro && <IonIcon icon={closeSharp}></IonIcon>}
              </IonCol>
            </IonRow>
            
            <IonRow>
              <IonCol size="10">
                Costas
                <IonProgressBar value={ gravandoFotoCostas?.percentualSalvo }></IonProgressBar>
              </IonCol>
              <IonCol size="1">
                {gravandoFotoCostas?.percentualSalvo === 100 && !gravandoFotoCostas?.erro && <IonIcon icon={checkmarkSharp}></IonIcon>}
                {gravandoFotoCostas?.percentualSalvo === 100 && gravandoFotoCostas?.erro && <IonIcon icon={closeSharp}></IonIcon>}
              </IonCol>
            </IonRow>
            
            <IonRow>
              <IonCol size="10">
                Esquerda
                <IonProgressBar value={ gravandoFotoEsquerda?.percentualSalvo }></IonProgressBar>
              </IonCol>
              <IonCol size="1">
                {gravandoFotoEsquerda?.percentualSalvo === 100 && !gravandoFotoEsquerda?.erro && <IonIcon icon={checkmarkSharp}></IonIcon>}
                {gravandoFotoEsquerda?.percentualSalvo === 100 && gravandoFotoEsquerda?.erro && <IonIcon icon={closeSharp}></IonIcon>}
              </IonCol>
            </IonRow>
            
            <IonRow>
              <IonCol size="10">
                Direita
                <IonProgressBar value={ gravandoFotoDireita?.percentualSalvo }></IonProgressBar>
              </IonCol>
              <IonCol size="1">
                {gravandoFotoDireita?.percentualSalvo === 100 && !gravandoFotoDireita?.erro && <IonIcon icon={checkmarkSharp}></IonIcon>}
                {gravandoFotoDireita?.percentualSalvo === 100 && gravandoFotoDireita?.erro && <IonIcon icon={closeSharp}></IonIcon>}
              </IonCol>
            </IonRow>
            
            {salvouFotos && <h4 className="ion-margin-top ion-padding-top">
              Salvando avaliação...
            </h4>}
            
          </IonContent>
        </IonModal>
        
        <IonModal isOpen={showModalFoto}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{ tituloModalFoto }</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => { setShowModalFoto(false) } }>
                  Fechar
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            
            {fotoMostra && <IonRow>
              <IonCol>
                <IonImg src={ fotoMostra.webviewPath ? fotoMostra.webviewPath : fotoMostra.firebaseUrl } />
              </IonCol>
            </IonRow>}
            
            {fotoMostra && <IonRow>
              <IonCol>
                <IonButton color="primary" expand="block" onClick={() => { alterarFoto() }}>
                  Alterar imagem
                </IonButton>
              </IonCol>
            </IonRow>}
            
          </IonContent>
        </IonModal>
        
        <IonToast isOpen={!!erro} onDidDismiss={e => setErro('')} message={erro} duration={4000} />
        
        {carregando && <IonRow>
          <IonCol className="ion-text-center">
            <IonSpinner></IonSpinner>
          </IonCol>  
        </IonRow>}

        {!carregando && <div>
          
          <IonItem>
            <IonLabel position="floating">Paciente</IonLabel>
            <IonInput value={nomePaciente} disabled></IonInput>
          </IonItem>
          
          <IonItem>
            <IonLabel position="floating">Data da Avaliação</IonLabel>
            <IonDatetime value={dataAvaliacao} onIonChange={e => setDataAvaliacao(e.detail!.value!)} displayFormat="DD/MM/YYYY" doneText="Pronto" cancelText="Cancelar"
                monthNames={monthNames} monthShortNames={monthShortNames} dayNames={dayNames} dayShortNames={dayShortNames} />
          </IonItem>
          
          <IonRow className="ion-margin-top">
            <IonCol>
              {fotoFrontal && <IonImg src={ fotoFrontal.webviewPath ? fotoFrontal.webviewPath : fotoFrontal.firebaseUrl } onClick={e => { mostrarFoto(fotoFrontal, 'Frontal') }} />}
              {!fotoFrontal && <IonButton expand="block" onClick={ () => { tirarFoto(setFotoFrontal) } } >
                Fontal
                <IonIcon icon={camera} slot="start" />
              </IonButton>}
            </IonCol>
            <IonCol>
              {fotoCostas && <IonImg src={ fotoCostas.webviewPath ? fotoCostas.webviewPath : fotoCostas.firebaseUrl } onClick={e => { mostrarFoto(fotoCostas, 'Costas') }} />}
              {!fotoCostas && <IonButton expand="block" onClick={ () => { tirarFoto(setFotoCostas) } }>
                Costas
                <IonIcon icon={camera} slot="start" />
              </IonButton>}
            </IonCol>
          </IonRow>
          
          <IonRow>
            <IonCol>
              {fotoEsquerda && <IonImg src={ fotoEsquerda.webviewPath ? fotoEsquerda.webviewPath : fotoEsquerda.firebaseUrl } onClick={e => { mostrarFoto(fotoEsquerda, 'Esquerda') }} />}
              {!fotoEsquerda && <IonButton expand="block" onClick={ () => { tirarFoto(setFotoEsquerda) } }>
                Esquerda
                <IonIcon icon={camera} slot="start" />
              </IonButton>}
            </IonCol>
            <IonCol>
              {fotoDireita && <IonImg src={ fotoDireita.webviewPath ? fotoDireita.webviewPath : fotoDireita.firebaseUrl } onClick={e => { mostrarFoto(fotoDireita, 'Direita') }} />}
              {!fotoDireita && <IonButton expand="block" onClick={ () => { tirarFoto(setFotoDireita) } }>
                Direita
                <IonIcon icon={camera} slot="start" />
              </IonButton>}
            </IonCol>
          </IonRow>
          
          <IonItem className="ion-margin-top">
            <IonLabel position="floating">Observações</IonLabel>
            <IonTextarea rows={5} value={observacoes} onIonChange={e => setObservacoes(e.detail.value!)}></IonTextarea>
          </IonItem>

          <IonRow className="ion-margin-top">
           <IonCol className="ion-text-left">
              <IonButton color="danger" onClick={ e => setConfirma(true) } disabled={!dadosValidos}>
                <IonIcon icon={closeOutline} slot="start"></IonIcon>
                Excluir
              </IonButton>
            </IonCol>
            <IonCol className="ion-text-right">
              <IonButton color="success" onClick={cadastrar} disabled={!dadosValidos}>
                <IonIcon icon={checkmarkSharp} slot="start"></IonIcon>
                Salvar
              </IonButton>
            </IonCol>
          </IonRow>
          
        </div>}
        
      </IonContent>
      
    </IonPage>
  );
}

export default CadastrarAvaliacao;

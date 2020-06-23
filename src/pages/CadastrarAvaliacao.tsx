import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonButton, IonRow, IonCol, IonImg, IonIcon, IonToast, IonModal, useIonViewWillEnter, IonTextarea, IonItem, IonLabel, IonDatetime } from '@ionic/react';
import { usePhotoGallery, Photo } from '../hooks/usePhotoGallery';
import { useState } from 'react';
import { camera, checkmarkSharp } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { localeVars } from './../config/localeVars';

interface CadastrarAvaliacaoParams extends RouteComponentProps<{
  idPaciente: string;
  idAvaliacao?: string;
}> {}

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
  const [dataAvaliação, setDataAvaliacao] = useState<string>('');
  
  const routeName = 'Cadastrar avaliação'
  const { takePhoto } = usePhotoGallery();
  
  const idPaciente = props.match.params.idPaciente;
  const idAvaliacao = props.match.params.idAvaliacao;
  
  useIonViewWillEnter(() => {
    
    setFotoFrontal(null)
    setFotoCostas(null);
    setFotoEsquerda(null)
    setFotoDireita(null);
    setObservacoes('');
    setDataAvaliacao((new Date()).toString());
    
    if (idAvaliacao) {
      // carrega avaliação
    }
    
  });
  
  const tirarFoto = async (funcSet: Function) => {
    
    const foto: any = await takePhoto();
    
    if (foto.erro) {
      if (foto.erro === 'Requested device not found') {
        setErro('Não foi encontrado uma camera neste dispositivo!');
      }
      return;
    }
    
    funcSet({ webviewPath: foto.webPath });
    
  }
  
  const mostrarFoto = (foto: any, titulo: string) => {
    setShowModalFoto(true);
    setTituloModalFoto(titulo);
    setFotoMostra(foto);
  }
  
  const alterarFoto = () => {
    if (tituloModalFoto === 'Frontal') {
      tirarFoto(setFotoFrontal);
    } else if (tituloModalFoto === 'Costas') {
      tirarFoto(setFotoCostas);
    } else if (tituloModalFoto === 'Esquerda') {
      tirarFoto(setFotoEsquerda);
    } else if (tituloModalFoto === 'Direita') {
      tirarFoto(setFotoDireita);
    }
    setShowModalFoto(false);
  }
  
  const cadastrar = () => {
    
  }
  
  const monthNames = localeVars.monthNames;
  const monthShortNames = localeVars.monthShortNames
  const dayNames = localeVars.dayNames
  const dayShortNames = localeVars.dayShortNames
  
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
                <IonImg src={fotoMostra.webviewPath} />
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
        
        <IonItem>
          <IonLabel position="floating">Data de Nascimento</IonLabel>
          <IonDatetime value={dataAvaliação} onIonChange={e => setDataAvaliacao(e.detail!.value!)} displayFormat="DD/MM/YYYY" doneText="Pronto" cancelText="Cancelar"
              monthNames={monthNames} monthShortNames={monthShortNames} dayNames={dayNames} dayShortNames={dayShortNames} />
        </IonItem>
        
        <IonRow className="ion-margin-top">
          <IonCol>
            {fotoFrontal && <IonImg src={fotoFrontal.webviewPath} onClick={e => { mostrarFoto(fotoFrontal, 'Frontal') }} />}
            {!fotoFrontal && <IonButton expand="block" onClick={ () => { tirarFoto(setFotoFrontal) } } >
              Fontal
              <IonIcon icon={camera} slot="start" />
            </IonButton>}
          </IonCol>
          <IonCol>
            {fotoCostas && <IonImg src={fotoCostas.webviewPath} onClick={e => { mostrarFoto(fotoCostas, 'Costas') }} />}
            {!fotoCostas && <IonButton expand="block" onClick={ () => { tirarFoto(setFotoCostas) } }>
              Costas
              <IonIcon icon={camera} slot="start" />
            </IonButton>}
          </IonCol>
        </IonRow>
        
        <IonRow>
          <IonCol>
            {fotoEsquerda && <IonImg src={fotoEsquerda.webviewPath} onClick={e => { mostrarFoto(fotoEsquerda, 'Esquerda') }} />}
            {!fotoEsquerda && <IonButton expand="block" onClick={ () => { tirarFoto(setFotoEsquerda) } }>
              Esquerda
              <IonIcon icon={camera} slot="start" />
            </IonButton>}
          </IonCol>
          <IonCol>
            {fotoDireita && <IonImg src={fotoDireita.webviewPath} onClick={e => { mostrarFoto(fotoDireita, 'Direita') }} />}
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
          <IonCol className="ion-text-right">
            <IonButton color="success" onClick={cadastrar}>
              <IonIcon icon={checkmarkSharp} slot="start"></IonIcon>
              Salvar
            </IonButton>
          </IonCol>
        </IonRow>
                
      </IonContent>
      
    </IonPage>
  );
}

export default CadastrarAvaliacao;

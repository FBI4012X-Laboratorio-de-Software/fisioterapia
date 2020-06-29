import { useState, useEffect } from "react";
import { useCamera } from '@ionic/react-hooks/camera';
import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";
import { readAsBase64 } from "../config/utils";

export interface Photo {
  webviewPath?: string;
  base64?: string;
  firebaseUrl?: string;
}

export function usePhotoGallery() {

  const { getPhoto } = useCamera();
  
  const takePhoto = async () => {
    
    let erro = '';
    
    const cameraPhoto = await getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    }).catch((err: any) => {
      erro = err;
    })
    
    let retorno = {
      erro: erro,
      webviewPath: '',
      base64: ''
    };
    
    if (cameraPhoto && cameraPhoto.webPath) {
      retorno.webviewPath = cameraPhoto.webPath;
      retorno.base64 = await readAsBase64(cameraPhoto.webPath);
    }
    
    return retorno;
    
  }
  
  return {
    takePhoto
  };
  
}

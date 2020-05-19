import * as firebase from 'firebase';
import { Fisioterapeuta } from './classes';

const config = {
  apiKey: "AIzaSyASU-qGj6DUAX05VtFb1SU81QEsQNWLh00",
  authDomain: "fisioterapia-adbe8.firebaseapp.com",
  databaseURL: "https://fisioterapia-adbe8.firebaseio.com",
  projectId: "fisioterapia-adbe8",
  storageBucket: "fisioterapia-adbe8.appspot.com",
  messagingSenderId: "594796409168",
  appId: "1:594796409168:web:154341e6dc67646b47fc55",
  measurementId: "G-0W7QTQ7QY2"
};

firebase.initializeApp(config);
firebase.analytics();



export function getKeyNovoFisioterapeuta(): string {
  
  const res = firebase.database().ref().child('fisioterapeutas').push().key;
  
  return res!.toString();
  
}

export async function cadastrarFisioterapeuta(key: string, data: Fisioterapeuta) {
  return new Promise((resolve, reject) => {
    
    if (data.dataNascimento instanceof Date) {
      data.dataNascimento = firebase.firestore.Timestamp.fromDate(data.dataNascimento);
    }
    
    try {
      firebase.database().ref('fisioterapeutas/' + key).set(data).then(() => {
        resolve(true);
      }, () => {
        resolve(false);
      })
      
    } catch (error) {
      resolve(false);
    }
    
  });
}


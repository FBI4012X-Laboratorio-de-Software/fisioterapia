import * as firebase from 'firebase';
import { Fisioterapeuta, Usuario } from './classes';

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



export function timestampToDate(data: any) {
  
  const time = new firebase.firestore.Timestamp(data.seconds, data.nanoseconds);
  
  return time.toDate();
  
}

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
      console.log(error);
      resolve(false);
    }
    
  });
}

export function buscaFisioterapeutaPorEmail(email: string) {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('fisioterapeutas/');
  
    ref.orderByChild('email').equalTo(email).on('value', function(data) {
      resolve(data);
    })
    
  });
  
}

export function buscaFisioterapeutaPorId(id: string) {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('fisioterapeutas/' + id);
    
    ref.once('value', (snapshot) => {
      resolve(snapshot.val());
    })
    
  });
  
}

export function deleteFisioterapeutaPorId(id: string) {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('fisioterapeutas/' + id);
    
    ref.remove().then(function() {
      resolve(true);
    })
    .catch(function(error) {
      reject(error.message)
    });
    
  });
}

export function getUltimosFisioterapeutasCadastrados(limit: number | null) {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('fisioterapeutas/');
    
    let consulta;
    
    if (limit) {
      consulta = ref.limitToLast(limit);
    } else {
      consulta = ref;
    }
    
    consulta.once('value', (snapshot) => {
      
      const fisios = snapshot.val();
      const retorno = [];
      
      const keys = Object.keys(fisios);
      
      for (const key of keys) {
        retorno.push({ codigo: key, ...fisios[key] });
      }
      
      resolve(retorno);
      
    }, () => {
      resolve(null);
    });
    
  });
  
  
  
}

export function addUserToAuthBase(cpf: string, email: string, senha: string, id: string, nome: string) {
  return new Promise((resolve, reject) => {
    
    const usuario = new Usuario(id, email, senha, nome);
    
    try {
      firebase.database().ref('users/' + cpf).set(usuario).then((data) => {
        resolve(true);
      }, (error) => {
        resolve(false);
      })
      
    } catch (error) {
      console.log(error);
      resolve(false);
    }
    
  });
}

export function deleteUserFromAuthBase(cpf: string) {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('users/' + cpf);
    
    ref.remove().then(function() {
      resolve(true);
    })
    .catch(function(error) {
      reject(error.message)
    });
    
  });
}

export function authFromBaseWithCpf(cpf: string, senha: string): Promise<Usuario | null> {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('users/' + cpf);
    
    ref.once('value', snapshot => {
      
      const usu = snapshot.val();
      
      if (usu) {
        
        if (usu.senha === senha) {
          resolve(new Usuario(usu.id, usu.email, usu.senha, usu.nome));
        } else {
          resolve(null);
        }
        
      } else {
        resolve(null)
      }
      
    })
    
  });
}

export function buscaGruposPacientes() {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('grupos_pacientes');
    
    ref.once('value', snapshot => {
      
      const grupos = snapshot.val();
      const retorno: Array<{ codigo: string, descricao: string }> = [];
      
      const keys = Object.keys(grupos);
      
      for (const key of keys) {
        retorno.push({ codigo: key, descricao: grupos[key].descricao });
      }
      
      resolve(retorno);
      
    });
    
  })
}

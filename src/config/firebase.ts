import * as firebase from 'firebase';
import { Usuario } from './classes';

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

export function dateToTimestamp(date: Date) {
  return firebase.firestore.Timestamp.fromDate(date);
}

export function getKeyNovoFisioterapeuta(): string {
  
  const res = firebase.database().ref().child('fisioterapeutas').push().key;
  
  return res!.toString();
  
}

export async function cadastrarFisioterapeuta(key: string, data: any) {
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

export function addUserToAuthBase(cpf: string, email: string, senha: string, id: string, nome: string, tipo: 'F' | 'P', ativo: boolean) {
  return new Promise((resolve, reject) => {
    
    const usuario = new Usuario(id, email, senha, nome, tipo, ativo);
    
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
          resolve(new Usuario(usu.id, usu.email, usu.senha, usu.nome, usu.tipo, usu.ativo));
        } else {
          resolve(null);
        }
        
      } else {
        resolve(null)
      }
      
    })
    
  });
}

export function getUserFromAuthBase(cpf: string){
  return new Promise<Usuario | null>((resolve, reject) => {
    
    const ref = firebase.database().ref('users/' + cpf);
    
    ref.once('value', snapshot => {
      const usu = snapshot.val();
      if (usu === null) {
        resolve(null);
        return;
      }
      resolve(new Usuario(usu.id, usu.email, usu.senha, usu.nome, usu.tipo, usu.ativo));
    });
    
  });
}

export function alteraUsuario(cpf: string, dados: any) {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('users/' + cpf);
    
    ref.once('value', snapshot => {
      ref.update({ ...dados }).then(resp => {
        resolve(true);
      }, error => {
        resolve(false);
      });
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


export function cadastrarPaciente(key: string, data: any) {
  return new Promise((resolve, reject) => {
    
    if (data.dataNascimento instanceof Date) {
      data.dataNascimento = firebase.firestore.Timestamp.fromDate(data.dataNascimento);
    }
    
    try {
      firebase.database().ref('pacientes/' + key).set(data).then(() => {
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

export function getUltimosPacientesCadastrados(limit: number | null) {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('pacientes/');
    
    let consulta;
    
    if (limit) {
      consulta = ref.limitToLast(limit);
    } else {
      consulta = ref;
    }
    
    consulta.once('value', (snapshot) => {
      
      const paciente = snapshot.val();
      const retorno = [];
      
      if (!paciente) {
        resolve([]);
        return;
      }
      
      const keys = Object.keys(paciente);
      
      for (const key of keys) {
        retorno.push({ codigo: key, ...paciente[key] });
      }
      
      resolve(retorno);
      
    }, () => {
      resolve(null);
    });
    
  });
}

export function getKeyNovoPaciente(): string {
  
  const res = firebase.database().ref().child('pacientes').push().key;
  
  return res!.toString();
  
}

export function buscaPacientePorId(id: string) {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('pacientes/' + id);
    
    ref.once('value', (snapshot) => {
      resolve(snapshot.val());
    })
    
  });
}

export function deletePacientePorId(id: string) {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('pacientes/' + id);
        
    ref.remove().then(function() {
      resolve(true);
    })
    .catch(function(error) {
      reject(error.message)
    });
    
  });
}

export function buscaPacientesDoFisioterapeuta(idFisio: string) {
  return new Promise((resolve, reject) => {
    
    const ref = firebase.database().ref('pacientes').orderByChild('responsavel').equalTo(idFisio);
    
    ref.once('value', (snapshot) => {
      resolve(snapshot.val());
    })
    
  });
}

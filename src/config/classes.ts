import * as firebase from 'firebase';

export class Fisioterapeuta {
  nome: string = '';
  email: string = '';
  dataNascimento: firebase.firestore.Timestamp | Date | null = null;
  sexo: 'f' | 'm' = 'f';
  cpf: string = '';
  endereco: string = '';
  cep: string = '';
  senha: string = '';
  ativo: boolean = true;
  uid: string = '';
}

export class Paciente {
  
}

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
}

export function firebaseToFisioterapeuta(data: any) {
  
  const fisio = new Fisioterapeuta();
  
  let timestamp = new firebase.firestore.Timestamp(data.dataNascimento.seconds, data.dataNascimento.nanoseconds );
  
  fisio.ativo = data.ativo === 'true';
  fisio.cep = data.cep;
  fisio.cpf = data.cpf;
  fisio.dataNascimento = timestamp.toDate();
  fisio.email = data.email;
  fisio.endereco = data.endereco;
  fisio.nome = data.nome;
  fisio.senha = data.senha;
  fisio.sexo = data.sexo;
  
  return fisio;
}

export class Usuario {
  
  constructor(public id: string, public email: string, private senha: string, public nome: string) { }
  
}

export class Paciente {
  
}


export class Usuario {
  constructor(public id: string, public email: string, public senha: string, public nome: string, public tipo: 'F' | 'P', public ativo: boolean) { }
}

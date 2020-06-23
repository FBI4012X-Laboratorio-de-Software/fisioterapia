
export function formatCpf(cpf: string) {
  
  cpf = cpf.replace(/[^\d]/g, "");
  
  if (cpf.length >= 3) {
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  }
  if (cpf.length >= 6) {
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  }
  if (cpf.length >= 9) {
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  
  return cpf;
  
}

export function desformataCpf(cpf: string) {
  return cpf.replace(/[^\d]/g, "");
}
  
export function validaCpf(strCPF: string) {
    
  strCPF = strCPF.replace(/[^\d]/g, "");;
  
  let soma = 0;
  let resto = 0;
  
  if (strCPF === "00000000000") return false;
   
  for (let i=  1; i<=9; i++) soma = soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  resto = (soma * 10) % 11;
 
  if ((resto === 10) || (resto === 11))  resto = 0;
  if (resto !== parseInt(strCPF.substring(9, 10)) ) return false;
 
  soma = 0;
  for (let i = 1; i <= 10; i++) soma = soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
  resto = (soma * 10) % 11;
 
  if ((resto === 10) || (resto === 11))  resto = 0;
  if (resto !== parseInt(strCPF.substring(10, 11) ) ) return false;
  return true;
}

export function validaEmail(email: string) {
  
  let usuario = email.substring(0, email.indexOf("@"));
  let dominio = email.substring(email.indexOf("@")+ 1, email.length);
   
  if ((usuario.length >=1) &&
      (dominio.length >=3) && 
      (usuario.search("@")===-1) && 
      (dominio.search("@")===-1) &&
      (usuario.search(" ")===-1) && 
      (dominio.search(" ")===-1) &&
      (dominio.search(".")!==-1) &&      
      (dominio.indexOf(".") >=1)&& 
      (dominio.lastIndexOf(".") < dominio.length - 1)) {
    return true;
  } else {
    return false;
  }
}

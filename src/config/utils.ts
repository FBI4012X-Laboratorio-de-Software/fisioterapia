
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
  
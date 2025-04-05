export function maskPhone(telefone: string) {
  // Remove todos os caracteres não numéricos
  telefone = telefone.replace(/\D/g, "");

  // Verifica se o número tem 11 dígitos
  if (telefone.length === 11) {
    // Formata o telefone no formato (XX) XXXXX-XXXX
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return telefone;
}

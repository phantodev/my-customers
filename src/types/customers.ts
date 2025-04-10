export type customers = {
  nome: string;
  documento: string;
  endereco: string;
  email: string;
  telefone: string;
  status: string;
  id: string;
  cep: string;
  cidade: string;
  estado: string;
};

export type customersApiResponse = {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: customers[];
};

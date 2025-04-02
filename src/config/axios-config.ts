import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

export const apiFakeStore = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 10000,
});

export const apiFinanceiro = axios.create({
  baseURL: "https://financeiroapi.escolaelaborata.com.br",
  timeout: 10000,
});

export const apiClientes = axios.create({
  baseURL: "https://clientesapi.escolaelaborata.com.br",
  timeout: 10000,
});

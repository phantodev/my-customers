import { api } from "@/config/axios-config";
import { TAddFinanceForm } from "@/pages/addFinance";
import base64Converter from "@/utils/base64Converter";

export async function createCustomer(data: TAddFinanceForm, avatar: string) {
  const payload = {
    ...data,
    avatar: await base64Converter(avatar),
  };
  const response = await api.post("/users", payload);

  return response.data;
}

export async function deleteCustomer(id: string) {
  const response = await api.delete(`/users/${id}`);

  return response.data;
}

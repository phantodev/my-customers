/* eslint-disable no-console */
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { addToast } from "@heroui/toast";

import { api } from "@/config/axios-config";
import { customers } from "@/types/customers";
import { useLocation, useNavigate } from "react-router-dom";

export default function CustomersPage() {
  const navigate = useNavigate();
  const location = useLocation(); // Aqui usamos o useLocation
  const queryParams = new URLSearchParams(location.search); // Criamos queryParams a partir de location.search
  const currentPage = queryParams.get("_page") || "1"; // currentPage é derivado da URL
  const [listCustomers, setListCustomers] = useState<customers[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [first, setFirst] = useState(0);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(0);
  const [last, setLast] = useState(0);
  const [pages, setPages] = useState(1);
  const [items, setItems] = useState(0);
  const [dudu, setDudu] = useState(0);

  async function getAllCustomers(page: string) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const response = await api.get(
        `http://localhost:3000/customers?_page=${page}&_per_page=4`
      );

      setListCustomers(response.data.data);
      setFirst(response.data.first);
      setPrev(response.data.prev);
      setNext(response.data.next);
      setLast(response.data.last);
      setPages(response.data.pages);
      setItems(response.data.items);
      setIsFetching(false);
      setDudu(Number(currentPage));
    } catch (error) {
      addToast({
        title: "Problemas com conexão da API",
        color: "danger",
      });
    }
  }

  function updateURL(page: number) {
    navigate(`?_page=${page}`);
  }

  useEffect(() => {
    getAllCustomers(currentPage);
  }, [currentPage]);

  return (
    <div className="p-6">
      <div className="flex justify-between w-full items-center mb-4">
        <h1 className="text-2xl font-bold">
          Página dos clientes {currentPage}
        </h1>
        <Button color="primary">Novo Cliente</Button>
      </div>
      <Table removeWrapper aria-label="Cadastro de Clientes">
        <TableHeader>
          <TableColumn>Nome</TableColumn>
          <TableColumn>Documento</TableColumn>
          <TableColumn>Endereço</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Telefone</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isFetching}
          items={listCustomers}
          loadingContent={
            <div className="mt-10">
              <Spinner label="Carregando lista de clientes" size="lg" />
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.documento}</TableCell>
              <TableCell>{item.endereco}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.telefone}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-center items-center w-full">
        <Pagination
          isCompact
          showControls
          isDisabled={isFetching}
          page={dudu}
          total={pages}
          onChange={updateURL}
        />
      </div>
    </div>
  );
}

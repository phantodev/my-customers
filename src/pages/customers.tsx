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
import { useForm } from "react-hook-form";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Input,
} from "@heroui/react";

import { api } from "@/config/axios-config";
import { customers } from "@/types/customers";
import { useLocation, useNavigate } from "react-router-dom";

export default function CustomersPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation(); // Aqui usamos o useLocation
  const queryParams = new URLSearchParams(location.search); // Criamos queryParams a partir de location.search
  const currentPage = queryParams.get("_page") || "1"; // currentPage é derivado da URL
  const [listCustomers, setListCustomers] = useState<customers[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(0);
  const [last, setLast] = useState(0);
  const [pages, setPages] = useState(1);
  const [items, setItems] = useState(0);
  const [dudu, setDudu] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function getAllCustomers(page: string) {
    try {
      setIsFetching(true);
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

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await api.post("/customers", data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        addToast({
          title: "Cadastro efetuado com sucesso!",
          color: "success",
        });
        onOpenChange();
      }
    } catch (error) {
      addToast({
        title: "Problemas com conexão da API",
        color: "danger",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllCustomers(currentPage);
  }, [currentPage]);

  return (
    <div className="p-6">
      <div className="flex justify-between w-full items-center mb-4">
        <h1 className="text-2xl font-bold">Página dos clientes</h1>
        <Button color="primary" onPress={onOpen}>
          Novo Cliente
        </Button>
      </div>
      <Table isStriped removeWrapper aria-label="Cadastro de Clientes">
        <TableHeader>
          <TableColumn>Nome</TableColumn>
          <TableColumn>Documento</TableColumn>
          <TableColumn>Endereço</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Telefone</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={isFetching ? "" : <div>Nenhum dado encontrado</div>}
          isLoading={isFetching}
          items={isFetching ? [] : listCustomers}
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
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 text-primary-700">
                Novo Cliente
              </DrawerHeader>
              <DrawerBody>
                <div className="flex flex-col gap-4">
                  <Input
                    isRequired
                    label="Nome"
                    placeholder="Digite o nome"
                    type="text"
                    {...register("nome")}
                  />
                  <Input
                    isRequired
                    label="Documento"
                    placeholder="Digite seu documento"
                    type="text"
                    {...register("documento")}
                  />
                  <Input
                    isRequired
                    label="Email"
                    placeholder="Digite seu e-mail"
                    type="email"
                    {...register("email")}
                  />
                  <Input
                    isRequired
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    type="text"
                    {...register("telefone")}
                  />
                  <Input
                    isRequired
                    label="Status"
                    placeholder="Digite o status"
                    type="text"
                    {...register("status")}
                  />
                  <Input
                    isRequired
                    label="Email"
                    placeholder="Digite seu e-mail"
                    type="email"
                    {...register("email")}
                  />
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleSubmit(onSubmit)}
                  type="button"
                >
                  Cadastrar cliente
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

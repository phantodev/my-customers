/* eslint-disable no-console */
import { useCallback, useEffect, useState } from "react";
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Input,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Select, SelectItem } from "@heroui/select";

import { customers } from "@/types/customers";
import { api } from "@/config/axios-config";
import { maskDocument } from "@/utils/maskDocument";
import { maskPhone } from "@/utils/maskPhone";
import { DotsThreeVertical } from "@phosphor-icons/react";

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
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [cep, setCep] = useState("");
  const [isFetchingCEP, setIsFetchingCEP] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
      await api.post("/customers", data);
      addToast({
        title: "Cadastro efetuado com sucesso!",
        color: "success",
      });
      reset();
      onOpenChange();
      getAllCustomers(currentPage);
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

  async function fetchCEP(e: string) {
    setCep(e);
    try {
      if (e.length === 8) {
        setIsFetchingCEP(true);
        const response = await api.get(`https://viacep.com.br/ws/${e}/json/`);

        if ("logradouro" in response.data) {
          setAddress(response.data.logradouro);
          setCity(response.data.localidade);
          setState(response.data.uf);
          setIsFetchingCEP(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleCloseDrawer() {
    reset();
    onOpenChange();
    setCep("");
    setAddress("");
    setCity("");
    setState("");
  }

  useEffect(() => {
    getAllCustomers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

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
          <TableColumn>Ações</TableColumn>
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
              <TableCell>
                <Dropdown
                  backdrop="opaque"
                  className="bg-background border-1 border-default-200"
                >
                  <DropdownTrigger>
                    <Button isIconOnly radius="full" size="sm" variant="light">
                      <DotsThreeVertical size={32} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="edit">Editar</DropdownItem>
                    <DropdownItem key="delete">Deletar</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
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

      <Drawer isOpen={isOpen} onOpenChange={handleCloseDrawer}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 text-primary-700">
                Novo Cliente
              </DrawerHeader>
              <DrawerBody>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                      maxLength={11}
                      placeholder="Digite seu documento"
                      type="text"
                      value={document}
                      onChange={(e) => {
                        const value = e.currentTarget.value;

                        if (value.length === 11) {
                          setDocument(maskDocument(value));
                          setValue("documento", value);
                        } else {
                          setDocument(value);
                        }
                      }}
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
                      maxLength={11}
                      placeholder="(00) 00000-0000"
                      type="text"
                      value={phone}
                      onValueChange={(e) => {
                        const value = e;

                        if (value.length === 11) {
                          setPhone(maskPhone(value));
                          setValue("telefone", value);
                        } else {
                          setPhone(value);
                        }
                      }}
                    />
                    <Select
                      className="w-full"
                      label="Status"
                      placeholder="Selecione um status"
                      {...register("status")}
                    >
                      <SelectItem key="ativo">Ativo</SelectItem>
                      <SelectItem key="inativo">Inativo</SelectItem>
                    </Select>
                    <Input
                      isRequired
                      endContent={isFetchingCEP && <Spinner size="sm" />}
                      label="CEP"
                      placeholder="Digite seu cep"
                      type="text"
                      value={cep}
                      onValueChange={fetchCEP}
                    />
                    <Input
                      isRequired
                      readOnly
                      label="Endereço"
                      placeholder="Digite seu endereço"
                      type="text"
                      value={address}
                    />
                    <div className="flex gap-4">
                      <Input
                        isRequired
                        readOnly
                        label="Cidade"
                        placeholder="Digite seu endereço"
                        type="text"
                        value={city}
                      />
                      <Input
                        isRequired
                        readOnly
                        label="Estado"
                        placeholder="Digite seu endereço"
                        type="text"
                        value={state}
                      />
                    </div>
                    <div className="flex gap-2 w-full justify-end">
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                      </Button>
                      <Button color="primary" type="submit">
                        Cadastrar cliente
                      </Button>
                    </div>
                  </div>
                </form>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

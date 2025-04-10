/* eslint-disable no-console */
import { useCallback, useEffect, useState, forwardRef } from "react";
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Select, SelectItem } from "@heroui/select";
import { DotsThreeVertical } from "@phosphor-icons/react";

import { maskPhone } from "@/utils/maskPhone";
import { customers } from "@/types/customers";
import { api } from "@/config/axios-config";
import { maskDocument } from "@/utils/maskDocument";

export default function CustomersPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose } = useDisclosure();

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
  const [tempDeleteID, setTempDeleteID] = useState("");
  const [tempUpdateID, setTempUpdateID] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [tempCustomerToUpdate, setTempCustomerToUpdate] =
    useState<customers | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (tempCustomerToUpdate) {
      setNome(tempCustomerToUpdate.nome || "");
      setDocument(maskDocument(tempCustomerToUpdate.documento) || "");
      setAddress(tempCustomerToUpdate.endereco || "");
      setPhone(maskPhone(tempCustomerToUpdate.telefone) || "");
      setEmail(tempCustomerToUpdate.email || "");
      setStatus(tempCustomerToUpdate.status || "");
      setCep(tempCustomerToUpdate.cep || "");
      setCity(tempCustomerToUpdate.cidade || "");
      setState(tempCustomerToUpdate.estado || "");
      setValue("nome", tempCustomerToUpdate.nome);
      setValue("documento", tempCustomerToUpdate.documento);
      setValue("telefone", tempCustomerToUpdate.telefone);
      setValue("email", tempCustomerToUpdate.email);
      setValue("status", tempCustomerToUpdate.status);
      setValue("endereco", tempCustomerToUpdate.endereco);
      setValue("cep", tempCustomerToUpdate.cep);
      setValue("cidade", tempCustomerToUpdate.cidade);
      setValue("estado", tempCustomerToUpdate.estado);
    }
  }, [tempCustomerToUpdate, setValue]);

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
      console.log(data);
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

  const onUpdate = async (data) => {
    try {
      console.log(data);
      setIsLoading(true);
      await api.put(`/customers/${tempUpdateID}`, data);
      addToast({
        title: "Cadastro atualiza com sucesso!",
        color: "success",
      });
      reset();
      onOpenChange();
      getAllCustomers(currentPage);
      reset();
      setTempUpdateID("");
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

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      await api.delete(`/customers/${tempDeleteID}`);
      addToast({
        title: "Registro deletado com sucesso!",
        color: "success",
      });
      onClose();
      getAllCustomers(currentPage);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
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
          setValue("endereco", response.data.logradouro);
          setValue("cidade", response.data.localidade);
          setValue("estado", response.data.uf);
          setValue("cep", e); // Usar o valor 'e' em vez de 'cep'
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
    setTempUpdateID("");
  }

  function handleClearStateFields() {
    setTempCustomerToUpdate(null);
    setNome("");
    setDocument("");
    setEmail("");
    setPhone("");
    setStatus("");
    setAddress("");
    setCity("");
    setState("");
    onOpen();
  }

  useEffect(() => {
    getAllCustomers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    if (tempDeleteID !== "") {
      onOpenModal();
    }
  }, [tempDeleteID]);

  useEffect(() => {
    if (tempUpdateID !== "") {
      onOpen();
      const customerChoosed = listCustomers.find(
        (customer) => customer.id === tempUpdateID
      );

      if (customerChoosed) {
        setTempCustomerToUpdate(customerChoosed);
      }
    }
  }, [tempUpdateID]);

  return (
    <div className="p-6">
      <div className="flex justify-between w-full items-center mb-4">
        <h1 className="text-2xl font-bold">Página dos clientes</h1>
        <Button color="primary" onPress={handleClearStateFields}>
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
                  classNames={{
                    content: "[inert]:opacity-50 [inert]:pointer-events-none",
                  }}
                >
                  <DropdownTrigger>
                    <Button isIconOnly radius="full" size="sm" variant="light">
                      <DotsThreeVertical size={32} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key="edit"
                      onPress={() => setTempUpdateID(item.id)}
                    >
                      Editar
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      onPress={() => setTempDeleteID(item.id)}
                    >
                      Deletar
                    </DropdownItem>
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

      <Drawer
        isOpen={isOpen}
        onOpenChange={handleCloseDrawer}
        classNames={{
          wrapper: "[&[data-overlay-container]]:inert",
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 text-primary-700">
                Novo Cliente
              </DrawerHeader>
              <DrawerBody>
                <form
                  onSubmit={handleSubmit(
                    tempUpdateID !== "" ? onUpdate : onSubmit
                  )}
                >
                  <div className="flex flex-col gap-4">
                    <Input
                      isRequired
                      label="Nome"
                      placeholder="Digite o nome"
                      type="text"
                      value={nome}
                      onValueChange={(value) => {
                        setNome(value);
                        setValue("nome", value);
                      }}
                    />
                    <Input
                      isRequired
                      label="Documento"
                      maxLength={11}
                      placeholder="Digite seu documento"
                      type="text"
                      value={document}
                      onValueChange={(e) => {
                        const rawValue = e.replace(/\D/g, "");

                        if (rawValue.length <= 11) {
                          setDocument(
                            rawValue.length === 11
                              ? maskDocument(rawValue)
                              : rawValue
                          );
                          setValue("documento", rawValue);
                        }
                      }}
                    />
                    <Input
                      isRequired
                      label="Email"
                      placeholder="Digite seu e-mail"
                      type="email"
                      value={email}
                      onValueChange={(value) => {
                        setEmail(value);
                        setValue("email", value);
                      }}
                    />
                    <Input
                      isRequired
                      label="Telefone"
                      maxLength={11}
                      placeholder="(00) 00000-0000"
                      type="text"
                      value={phone}
                      onValueChange={(e) => {
                        const rawValue = e.replace(/\D/g, "");

                        if (rawValue.length <= 11) {
                          setPhone(
                            rawValue.length === 11
                              ? maskPhone(rawValue)
                              : rawValue
                          );
                          setValue("telefone", rawValue);
                        }
                      }}
                    />
                    <Select
                      className="w-full"
                      label="Status"
                      placeholder="Selecione um status"
                      selectedKeys={new Set([status])}
                      onSelectionChange={(keys) => {
                        const selectedStatus =
                          Array.from(keys)[0]?.toString() || "";

                        setStatus(selectedStatus);
                        setValue("status", selectedStatus);
                      }}
                    >
                      <SelectItem key="Ativo">Ativo</SelectItem>
                      <SelectItem key="Inativo">Inativo</SelectItem>
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
                        {tempUpdateID !== "" ? "Atualizar" : "Cadastrar"}{" "}
                        cliente
                      </Button>
                    </div>
                  </div>
                </form>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <Modal
        backdrop="blur"
        isOpen={isOpenModal}
        onClose={onClose}
        classNames={{
          wrapper: "[&[data-overlay-container]]:inert",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Deletar registro?
              </ModalHeader>
              <ModalBody>
                <p>
                  Esta ação não poderá ser revertida posteriormente. Nós
                  realmente excluímos os registros de nosso banco de dados.
                  Deseja continuar?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleting}
                  onPress={onDelete}
                >
                  {!isDeleting && "Deletar"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

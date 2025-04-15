import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Button,
  addToast,
} from "@heroui/react";
import { Eye, PencilSimple, Trash } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/config/axios-config";
import { deleteCustomer } from "@/services/financeService";
import { useStore } from "@/stores/useStore";

export const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "default" | "primary" | "secondary"
> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

type TUser = {
  id: string;
  name: string;
  role: string;
  team: string;
  status: "active" | "paused" | "vacation";
  age: string;
  avatar: string;
  email: string;
};

async function fetchAxios(url: string): Promise<TUser[]> {
  const response = await api.get(url);

  return response.data;
}

export default function App() {
  const { tempCustomer, setTempCustomer } = useStore();
  const route = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["listUsers"],
    queryFn: () => fetchAxios("/users"),
    gcTime: 24 * 60 * 60 * 1000, // 24 horas
    staleTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 4,
  });

  useEffect(() => {
    if (tempCustomer !== null) {
      console.log(tempCustomer);
    }
  }, [tempCustomer]);

  const mutation = useMutation({
    mutationKey: ["delete-customer"],
    mutationFn: async (id: string) => await deleteCustomer(id),
    onError: (error) => {
      addToast({
        title: error.toString(),
        color: "danger",
      });
    },
    onSuccess: () => {
      addToast({
        title: "Cliente deletado com sucesso!",
        color: "success",
      }),
        queryClient.refetchQueries({
          queryKey: ["listUsers"],
        });
    },
    onSettled: () => console.log("TESTE"),
  });

  const renderCell = React.useCallback(
    (user: TUser, columnKey: keyof TUser | "actions") => {
      const cellValue = user[columnKey as keyof TUser];

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: user.avatar }}
              description={user.email}
              name={cellValue}
            >
              {user.email}
            </User>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
              <p className="text-bold text-sm capitalize text-default-400">
                {user.team}
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.status as keyof typeof statusColorMap]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <Eye size={20} />
                </span>
              </Tooltip>
              <Tooltip content="Edit user">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <PencilSimple
                    size={20}
                    onClick={() => setTempCustomer(user)}
                  />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Trash size={20} onClick={() => mutation.mutate(user.id)} />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between w-full items-center mb-4">
        <h1 className="text-2xl font-bold">Página dos clientes</h1>
        <Button color="primary" onPress={() => route("add")}>
          Novo Cliente
        </Button>
      </div>
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data || []}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

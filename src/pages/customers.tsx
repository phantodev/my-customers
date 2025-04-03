import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";

export default function CustomersPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between w-full items-center mb-4">
        <h1 className="text-2xl font-bold">Página dos clientes</h1>
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
        <TableBody>
          <TableRow key="1">
            <TableCell>Maria Silva</TableCell>
            <TableCell>123.456.789-00</TableCell>
            <TableCell>Rua das Flores, 123, São Paulo, SP</TableCell>
            <TableCell>maria.silva@email.com</TableCell>
            <TableCell>(11) 98765-4321</TableCell>
            <TableCell>Ativo</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>José Almeida</TableCell>
            <TableCell>987.654.321-00</TableCell>
            <TableCell>Avenida Paulista, 456, São Paulo, SP</TableCell>
            <TableCell>jose.almeida@email.com</TableCell>
            <TableCell>(11) 91234-5678</TableCell>
            <TableCell>Inativo</TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell>Ana Costa</TableCell>
            <TableCell>345.678.901-23</TableCell>
            <TableCell>Rua dos Três Irmãos, 789, Rio de Janeiro, RJ</TableCell>
            <TableCell>ana.costa@email.com</TableCell>
            <TableCell>(21) 99876-5432</TableCell>
            <TableCell>Ativo</TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell>Paulo Souza</TableCell>
            <TableCell>567.890.123-45</TableCell>
            <TableCell>Travessa da Paz, 321, Porto Alegre, RS</TableCell>
            <TableCell>paulo.souza@email.com</TableCell>
            <TableCell>(51) 92345-6789</TableCell>
            <TableCell>Suspenso</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-center items-center w-full">
        <Pagination isCompact showControls initialPage={1} total={10} />
      </div>
    </div>
  );
}

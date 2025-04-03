import { Button } from "@heroui/button";
import { SignOut } from "@phosphor-icons/react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Authenticated() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div>
      <nav className="flex justify-between items-center h-20 w-screen bg-purple-900 text-white p-4">
        <div className="flex gap-4 items-center h-20">
          <NavLink to="customers">Clientes</NavLink>
          <NavLink to="finance">Financeiro</NavLink>
          <NavLink to="my-profile">Meu Perfil</NavLink>
        </div>
        <Button isIconOnly onPress={handleLogout}>
          <SignOut size={32} />
        </Button>
      </nav>
      <Outlet />
    </div>
  );
}

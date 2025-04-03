import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type RouterGuardProps = {
  children: JSX.Element;
};

export default function RouterGuard({ children }: RouterGuardProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true); // Controle de carregamento

  useEffect(() => {
    // Se estiver na página de login e houver token, redireciona para /customers
    if (window.location.pathname === "/" && token) {
      navigate("/authenticated/customers");
    }

    // Se estiver na página /customers e não houver token, redireciona para login
    if (window.location.pathname === "/authenticated/customers" && !token) {
      navigate("/");
    }

    setIsLoading(false); // Uma vez que o redirecionamento foi decidido, finalize o carregamento
  }, [token, navigate]);

  // Enquanto estiver "carregando", não renderiza nada
  if (isLoading) {
    return null; // Ou renderize um componente de loading, ex: <LoadingSpinner />
  }

  return <>{children}</>; // Renderiza o conteúdo da página
}

import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

export default function IndexPage() {
  return (
    <div className="w-screen h-screen bg-purple-900 flex items-center justify-center">
      <div className="w-96">
        <Card
          classNames={{
            base: "bg-purple-300",
          }}
        >
          <CardBody>
            <h1 className="text-2xl font-semibold mb-4">Faça o login</h1>
            <div className="flex flex-col gap-4">
              <Input
                isRequired
                label="Email"
                placeholder="Digite seu e-mail"
                size="lg"
                type="email"
              />
              <Input
                label="Senha"
                placeholder="Digite sua senha"
                type="password"
              />
              <Button color="primary" size="lg" variant="solid">
                Enviar
              </Button>
              <Button color="primary" size="lg" variant="light">
                Esqueci minha senha
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

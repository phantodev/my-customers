import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/config/axios-config";

export default function IndexPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * The onSubmit function sends a POST request to the "/login" endpoint with the provided data.
   * @param data - The `data` parameter in the `onSubmit` function likely contains the user input or
   * form data that needs to be submitted to the server for the login process. This data could include
   * fields such as username, password, or any other required information for authentication.
   */
  const onSubmit = async (data) => {
    try {
      const response = await api.get("/login", data);

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-screen h-screen bg-purple-900 flex items-center justify-center">
      <div className="w-96">
        <Card
          classNames={{
            base: "bg-purple-300",
          }}
        >
          <CardBody>
            <h1 className="text-2xl font-semibold mb-4">Faça o login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <Input
                  isRequired
                  label="Email"
                  placeholder="Digite seu e-mail"
                  type="email"
                  {...register("email")}
                />
                <Input
                  isRequired
                  endContent={
                    !isPasswordVisible ? (
                      <Eye
                        size={32}
                        onClick={() => setIsPasswordVisible(true)}
                      />
                    ) : (
                      <EyeSlash
                        size={32}
                        onClick={() => setIsPasswordVisible(false)}
                      />
                    )
                  }
                  label="Senha"
                  placeholder="Digite sua senha"
                  type={isPasswordVisible ? "text" : "password"}
                  {...register("password")}
                />
                <Button color="primary" size="lg" type="submit" variant="solid">
                  Enviar
                </Button>
                <Button color="primary" size="lg" variant="light">
                  Esqueci minha senha
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

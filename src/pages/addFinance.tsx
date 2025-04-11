import { Input, Select, SelectItem, Switch } from "@heroui/react";
import { PencilSimple } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const addFinanceSchema = z.object({
  name: z
    .string({ message: "O valor não é uma string" })
    .min(10, { message: "Nome deve ter mínimo 10 caracteres" }),
  email: z
    .string({ message: "O valor não é uma string" })
    .email({ message: "Não é um e-mail válido" }),
  age: z
    .string()
    .regex(/^\d+$/, { message: "Idade deve conter apenas números" })
    .refine((val) => Number(val) >= 18 && Number(val) <= 60, {
      message: "Idade deve estar entre 18 e 60 anos",
    }),
  team: z
    .string({ message: "O valor não é um string" })
    .min(10, { message: "Nome deve ter mínimo 10 caracteres" }),
  role: z
    .string({ message: "O valor não é um string" })
    .min(4, { message: "Selecione um item da Role" }),
  status: z.boolean(),
});

type TAddFinanceForm = z.infer<typeof addFinanceSchema>;

export default function AddFinance() {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TAddFinanceForm>({
    resolver: zodResolver(addFinanceSchema),
    defaultValues: {
      email: "",
      name: "",
      status: true,
      age: "",
      team: "",
      role: "",
    },
  });

  function onSubmit(data) {
    console.log(data);
  }

  //   useEffect(() => {
  //     console.log(addFinanceSchema.parse({ name: "Eduardo" }));
  //   }, []);

  // Adicionando console.log dos erros
  console.log("Form Errors:", errors);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8">
            {/* Avatar Section */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white hover:bg-primary/90"
                >
                  <PencilSimple size={16} />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Controller
                control={control}
                defaultValue=""
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Name"
                    placeholder="Enter your name"
                    type="text"
                    variant="bordered"
                  />
                )}
              />
              <Controller
                control={control}
                defaultValue=""
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                    variant="bordered"
                  />
                )}
              />
              <Controller
                control={control}
                defaultValue=""
                name="team"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Team"
                    placeholder="Enter your team"
                    type="text"
                    variant="bordered"
                  />
                )}
              />
              <Controller
                control={control}
                name="age"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Age"
                    placeholder="Enter your age"
                    type="text"
                    variant="bordered"
                  />
                )}
              />
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Role"
                    placeholder="Select a role"
                    variant="bordered"
                  >
                    <SelectItem key="admin">Admin</SelectItem>
                    <SelectItem key="user">User</SelectItem>
                    <SelectItem key="manager">Manager</SelectItem>
                    <SelectItem key="developer">Developer</SelectItem>
                  </Select>
                )}
              />

              <div className="flex items-center space-x-4">
                <span className="text-sm text-default-700">Status</span>
                <Controller
                  control={control}
                  name="status"
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      color="primary"
                      isSelected={value}
                      onValueChange={onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

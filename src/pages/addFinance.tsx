import {
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { PencilSimple } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Slider,
} from "@heroui/react";
import Cropper from "react-easy-crop";
import ImageUploading, { ImageListType } from "react-images-uploading";
import getCroppedImg from "@/utils/getCroppedImg";
import base64Converter from "@/utils/base64Converter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer, updateCustomer } from "@/services/financeService";
import { useStore } from "@/stores/useStore";
import { addToast } from "@heroui/toast";
import { useNavigate } from "react-router-dom";

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
    .min(10, { message: "Time deve ter mínimo 10 caracteres" }),
  role: z
    .string({ message: "O valor não é um string" })
    .min(4, { message: "Selecione um item da Role" }),
  status: z.boolean(),
});

export type TAddFinanceForm = z.infer<typeof addFinanceSchema>;

type listImagesForUpload = {
  dataURL: string;
};

export default function AddFinance() {
  const navigate = useNavigate();
  const { tempCustomer, setTempCustomer } = useStore();
  const queryClient = useQueryClient();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
  );
  const [images, setImages] = useState<listImagesForUpload[]>([]);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onZoomChange = (zoom) => {
    console.log(zoom);
    setZoom(zoom);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<TAddFinanceForm>({
    resolver: zodResolver(addFinanceSchema),
    defaultValues: {
      email: tempCustomer?.email || "",
      name: tempCustomer?.name || "",
      status: tempCustomer?.status || true,
      age: tempCustomer?.age || "",
      team: tempCustomer?.team || "",
      role: tempCustomer?.role || "",
    },
  });

  const handleCropImage = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedImageUrl = await getCroppedImg(
        images[0].dataURL,
        croppedAreaPixels
      );

      setAvatar(croppedImageUrl); // Atualiza o estado do avatar com a imagem recortada
      onOpenChange();
      setCroppedAreaPixels(null);
      setImages([]);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (e) {
      console.error(e);
    }
  };

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  const { isPending, mutate } = useMutation({
    mutationKey: ["mutate-my-profile"],
    mutationFn: async (data: TAddFinanceForm) => {
      if(tempCustomer){
        await updateCustomer(tempCustomer.id, data, avatar)
      } else {
        await createCustomer(data, avatar)
      }
    },
    onError: (error) => {
      addToast({
        title: error.toString(),
        color: "danger",
      });
    },
    onSuccess: () => {
      addToast({
        title: `Cliente ${tempCustomer?.name ? "atualizado" : "cadastrado"} com sucesso!`,
        color: "success",
      });
        clearErrors();
      reset({
        email: "",
        name: "",
        status: true,
        age: "",
        team: "",
        role: "", // Explicitly set role to empty string
      });
      if(tempCustomer){
        navigate("/authenticated/finance");
      }
      queryClient.refetchQueries({
        queryKey: ["listUsers"],
      });
    },
    onSettled: () => console.log("TESTE"),
  });

  console.log("Form Errors:", errors);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className="space-y-8">
            {/* Avatar Section */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={avatar}
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  onClick={() => onOpen()}
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
                    isInvalid={!!errors?.name?.message}
                    errorMessage={errors?.name?.message}
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
                    isInvalid={!!errors?.email?.message}
                    errorMessage={errors?.email?.message}
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
                    isInvalid={!!errors?.team?.message}
                    errorMessage={errors?.team?.message}
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
                    isInvalid={!!errors?.age?.message}
                    errorMessage={errors?.age?.message}
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
                    selectedKeys={field.value ? [field.value] : []}
                    onChange={field.onChange}
                    isInvalid={!!errors?.role?.message}
                    errorMessage={errors?.role?.message}
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
              <Button
                type="submit"
                isLoading={isPending}
                className="inline-flex justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none"
              >
                {!isPending ? "Save" : ""}
              </Button>
            </div>
          </div>
        </form>
      </div>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 text-primary-700">
                Edite seu avatar
              </DrawerHeader>
              <DrawerBody>
                {images?.length === 0 ? (
                  <ImageUploading multiple value={images} onChange={onChange}>
                    {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                    }) => (
                      // write your building UI
                      <div className="upload__image-wrapper">
                        <div className="w-full h-[300px] border-dashed border-primary-500 border-2 flex justify-center items-center">
                          <button
                            onClick={onImageUpload}
                            className="text-primary-500 font-bold mr-2"
                          >
                            Clique aqui{" "}
                          </button>{" "}
                          para escolher sua foto
                        </div>
                      </div>
                    )}
                  </ImageUploading>
                ) : (
                  <>
                    <div className="crop-container">
                      <Cropper
                        image={images[0].dataURL}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={onCropChange}
                        onCropComplete={onCropComplete}
                        onZoomChange={onZoomChange}
                      />
                    </div>
                    <div className="flex flex-col mt-[330px]">
                      <div className="text-primary text-lg mb-4 font-semibold">
                        Manipule o Zoom
                      </div>

                      <Slider
                        key="full"
                        aria-label="SIze image"
                        className="w-full"
                        defaultValue={0}
                        maxValue={3}
                        minValue={1}
                        radius="full"
                        step={0.1}
                        onChange={onZoomChange}
                      />
                      <Button
                        className="mt-10"
                        color="primary"
                        size="lg"
                        fullWidth
                        onPress={handleCropImage}
                        
                      >
                        Efetuar o crop
                      </Button>
                    </div>
                  </>
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

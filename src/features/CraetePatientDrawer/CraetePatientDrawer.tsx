import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {Drawer, DrawerRef} from "@shared/ux/Drawer";
import { RegisterForm } from "@features/auth/ui/RegisterForm";
import {usersKeys} from "@entities/patient/model/useGetPatients";
import {authApi, queryClient} from "@shared/api";
import Toast from "react-native-toast-message";
import {Text} from "react-native";

export interface CreatePatientDrawerRef {
  open: () => void;
  close: () => void;
}

export const CreatePatientDrawer = forwardRef<
  CreatePatientDrawerRef,
  {onClose:()=>void}
>(({onClose}, ref) => {
  const drawerRef = useRef<DrawerRef>(null);

  const [newPatient, setNewPatient] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    birthDate: "",
  });

  const [loading, setLoading] = useState(false);

  // 👉 прокидываем наружу
  useImperativeHandle(ref, () => ({
    open: () => drawerRef.current?.open(),
    close: () => drawerRef.current?.close(),
  }));

  const handleCreate = async (body: any) => {
    try {
      setLoading(true);
      await authApi.register(body);

      Toast.show({ type: "success", text1: "Пациент добавлен" });

      drawerRef.current?.close();

      setNewPatient({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        birthDate: "",
      });

      await queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    } catch (e) {
      Toast.show({ type: "error", text1: "Ошибка добавления пациента" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer ref={drawerRef} gestureEnabled onClose={onClose}>
      <Text style={{fontSize:18,paddingVertical:20,fontWeight:'bold'}}>Создать новый пациент</Text>
      <RegisterForm
        isNewPatient
        onSubmit={handleCreate}
        loading={loading}
        serverError={""}
      />
    </Drawer>
  );
});
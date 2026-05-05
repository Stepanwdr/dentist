import {Image, StyleSheet, Text} from 'react-native'

import {Drawer, DrawerRef} from "@shared/ux/Drawer";
import React, {FC, useCallback, useEffect, useRef, useState} from "react";
import {PatientsList} from "@entities/patient/patients-list/patients-list";
import {Patient} from "@shared/types/patient";
import {AsignForm} from "@features/patient-asign/ui/AsignForm";
import {useBookSlot} from "@features/book-slot/model/queries";
import {queryClient, useMeQuery} from "@shared/api";
import {ScheduleItem} from "@shared/utils/buildScheduleData";
import {addMinutesToTime} from "@shared/utils/addMinutesToTime";
import {bookingKeys} from "@entities/booking/model/booking.model";
import {RegisterForm} from "@features/auth/ui/RegisterForm";
import {CreatePatientDrawer, CreatePatientDrawerRef} from "@features/CraetePatientDrawer/CraetePatientDrawer";
import {useFocusEffect} from "@react-navigation/native";


export interface AsignData extends ScheduleItem {
  patient: Patient;
  service:string
  notes:string
  date: string
}


interface Props {
  isDrawerOpen: boolean;
  onDrawerClose: () => void;
  asignData: AsignData | null;
  setAsignData: (asignData: AsignData) => void;
}



export const PatientAsignDrawer:FC<Props> = ({isDrawerOpen,onDrawerClose,asignData,setAsignData}) => {
  const {data:user} =useMeQuery()
  const drawerRef=useRef<DrawerRef>(null);
  const drawerRegiserRef=useRef<CreatePatientDrawerRef>(null);
  const { mutate: createBook, isPending } = useBookSlot(()=>{
    onDrawerClose()
  })

  const [showRegister,setShowRegister]=useState(false);


  const onAsign=(patient:Patient)=>{
    setAsignData({...asignData!, patient})
  }
const end= addMinutesToTime(`${asignData?.time}:00`,60)
  const assignAndNotify = async () => {
    if (!asignData) return;
    const dentistId = user?.dentistId ?? user?.id ?? null;
    const payload = {
      dentistId:Number(dentistId),
      date: asignData.date,
      startTime:`${asignData.time}:00`,
      endTime:end,
      patientId:asignData.patient.id,
      service: asignData.service,
      notes: asignData.notes,
    };

    createBook({...payload})
    queryClient.invalidateQueries({ queryKey: bookingKeys.all() });
  };

  const onChangeField=(field:string,value:string)=>{
    setAsignData({...asignData, [field]:value} as AsignData )
  }

  useEffect(() => {
    if(isDrawerOpen)drawerRef.current?.open()
    else drawerRef.current?.close()
  }, [isDrawerOpen]);

  useFocusEffect(useCallback(()=>{
     if(showRegister){
       drawerRegiserRef.current?.open()
     }else {
       drawerRegiserRef.current?.close()
     }
  },[showRegister]));


  console.log({showRegister})
  return (
    <Drawer ref={drawerRef} onClose={()=>{
      onDrawerClose()
    }} gestureEnabled={Boolean(asignData?.patient)}>
      <Text style={styles.title}>{asignData ? 'Детали назначение' : 'Список пациентов'}</Text>
      {!asignData?.patient &&  <PatientsList openDrawer={()=>setShowRegister(true)} onAsign={onAsign}/> }
      {asignData?.patient && <AsignForm asignData={asignData} onChangeField={onChangeField} assignAndNotify={assignAndNotify} />}
      <CreatePatientDrawer ref={drawerRegiserRef} onClose={()=>{setShowRegister(false)}}  />
    </Drawer>
  );
};


const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginBottom: 20,
  }
})
import {Image, StyleSheet, Text} from 'react-native'

import {Drawer} from "@shared/ux/Drawer";
import React, {FC, useState} from "react";
import {PatientsList} from "@entities/patient/patients-list/patients-list";
import {Patient} from "@shared/types/patient";
import {AsignForm} from "@features/patient-asign/ui/AsignForm";
import {useBookSlot} from "@features/book-slot/model/queries";
import {queryClient, useMeQuery} from "@shared/api";
import {ScheduleItem} from "@shared/utils/buildScheduleData";
import {addMinutesToTime} from "@shared/utils/addMinutesToTime";
import {bookingKeys} from "@entities/booking/model/booking.model";


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
  const { mutate: createBook, isPending } = useBookSlot(()=>{
    onDrawerClose()
  })


  const onAsign=(patient:Patient)=>{
    setAsignData({...asignData!, patient})
  }
const end= addMinutesToTime(`${asignData?.time}:00`,30)
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

    console.log({payload})
    createBook({...payload})
    queryClient.invalidateQueries({ queryKey: bookingKeys.all() });
  };

  const onChangeField=(field:string,value:string)=>{
    setAsignData({...asignData, [field]:value} as AsignData )
  }
  return (
    <Drawer onClose={onDrawerClose} visible={isDrawerOpen} isFullHeight >
      <Text style={styles.title}>{asignData ? 'Детали назначение' : 'Список пациентов'}</Text>
      {asignData?.patient ? <AsignForm asignData={asignData} onChangeField={onChangeField} assignAndNotify={assignAndNotify} /> :  <PatientsList onAsign={onAsign}/>}
    </Drawer>
  );
};


const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginBottom: 20,
  }
})
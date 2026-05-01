import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {HomeColor} from "@shared/theme/home";
import React, {FC, useRef} from "react";
import { AsignData } from "./PatientAsignDrawer";
import {Avatar} from "@shared/ui";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/theme/colors";
import {ServicePickerRef, ServicePickerSheet} from "@shared/ui/ServicePickerSheet";


interface IProps {
  asignData: AsignData
  assignAndNotify:  ()=> void;
  onChangeField:(field:string,value:string)=>void;
}
const services = [
  "Чистка зубов",
  "Пломба",
  "Удаление",
  "Имплант",
];
export const AsignForm:FC<IProps> = ({asignData, assignAndNotify,onChangeField}) => {

  const sheetRef = useRef<ServicePickerRef>(null);

  const open = () => {
    requestAnimationFrame(() => {
      sheetRef.current?.open();
    });
  };

  return (
    <View style={{alignItems:"center",position:'relative',flex:1}}>
      <View style={{gap:5,alignItems:'center',position:'relative'}} >
        <View>
          <Avatar initials={asignData.patient.name} size={100}/>
        </View>
        <View style={styles.row}>

          <View>
            <Text style={{textAlign:'center'}}>
              Пациент
            </Text>
            <Text style={{ fontWeight: '700', fontSize: 18 }}>
              {asignData?.patient?.name}
            </Text>
          </View>
        </View>
        <View style={{gap:20,backgroundColor:Colors.successLight,borderRadius:24,padding:20,minWidth:'90%'}}>
          <Text>Данные о визите</Text>
          <View style={styles.row}>
            <View style={styles.iconWrapper}>
              <Ionicons name={'calendar-outline'} color={HomeColor.primary} size={20}/>
            </View>
            <View>
              <Text>
                Дата визита
              </Text>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>
                {asignData?.date} {asignData?.time}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.iconWrapper}>
              <Ionicons name={'medkit-outline'} color={HomeColor.primary} size={20}/>
            </View>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={open}
            >
              <Text>Процедура</Text>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>
                {asignData?.service || "Выбрать"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={styles.iconWrapper}>
              <Ionicons name={'chatbubbles-outline'} color={HomeColor.primary} size={20}/>
            </View>
            <TextInput placeholder={"Заметки о визите"} value={asignData.notes} onChangeText={(text)=>onChangeField('notes',text)} style={styles.input} />
          </View>
          <Text>Данные пациента</Text>
          <View style={styles.row}>
            <View style={styles.iconWrapper}>
              <Ionicons name={'mail-outline'} color={HomeColor.primary} size={20}/>
            </View>
            <View>
              <Text>
                Почта
              </Text>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>
                {asignData?.patient?.email}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.iconWrapper}>
              <Ionicons name={'phone-portrait-outline'} color={HomeColor.primary} size={20}/>
            </View>
            <View>
              <Text>
                Номер
              </Text>
              <Text style={{ fontWeight: '700', fontSize: 18 }}>
                {asignData?.patient?.phone}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={assignAndNotify} style={styles.bookBtn}>
        <Text style={styles.bookTextMd}>Назначит и уведомлять</Text><Ionicons name={'send-outline'} color={'white'}/>
      </TouchableOpacity>
      <ServicePickerSheet
        ref={sheetRef}
        services={services}
        onSelect={(value) => onChangeField("service", value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bookBtn: {
    backgroundColor: HomeColor.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "center",
    gap:5,
  },
  bookTextMd: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "center",
    gap:5,
    color:HomeColor.white,
    flex:1,
    textAlign:"center"
  },
  input:{
    minHeight: 40,
    backgroundColor:'white',
    flex:1,
    borderColor:HomeColor.primary,
    borderWidth:1,
    borderRadius:24,
    paddingLeft:10
  },
  iconWrapper: {
    borderRadius:10,
    backgroundColor:HomeColor.primaryLight,
    paddingVertical:16,
    width:50,
    justifyContent:"center",
    alignItems:"center",
  },
  row:{
    flexDirection:"row",
    gap:10,
    alignItems:"center"
  },
  pickerWrapper: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HomeColor.primary,
    overflow: 'hidden',
  }
})
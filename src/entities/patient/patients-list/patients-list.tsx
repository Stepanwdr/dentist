import React, {FC, useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {shadow} from "@features/book-slot/lib";
import {bookingColors, bookingColors as C} from "@shared/theme/Booking.colors";
import {useGetPatients} from "@entities/patient/model/useGetPatients";
import {useMeQuery} from "@shared/api";
import {Patient} from "@shared/types/patient";
import {useFocusEffect} from "@react-navigation/native";
import {HomeColor} from "@shared/theme/home";
import {Ionicons} from "@expo/vector-icons";
import {NoneUser} from "@shared/ui/NoneUser";

const tabs = [
  { label: 'Мои пациенты', value: 'my' },
  { label: 'Пациенты клиники', value: 'all' },
];
type Props = {
  horizontal?: boolean;
  onAsign?: (patient:Patient, service?: string) => void;
  setDrawerOpen?: (open:boolean) => void;
  openDrawer?: () => void;
};

export const PatientsList: FC<Props> = ({ horizontal, onAsign, openDrawer}) => {
  const [selected, setSelected] = useState('all');
  const { data, refetch } = useGetPatients({ search: '' })
  // Drawer for adding new patient
  const {data:user}=useMeQuery()
  const filteredDoctors = useMemo(() => {
    if (selected === 'all') return data;
    return data?.filter((patient) => user?.id !== patient?.dentistId);
  }, [selected,data]);
  const handleView=(item:Patient)=>{}
  const renderPatient = ({ item }:{item:Patient}) => (
    <View style={[styles.card, !horizontal && { width: "50%" }]} >
      {item.avatar? <Image source={{uri: item.avatar}} style={styles.image}/>:<NoneUser/>}

      <Text style={styles.name}>{item.name}</Text>


      {/*<Text style={styles.rating}>*/}
      {/*  ⭐ {item.rating} ({item.reviews})*/}
      {/*</Text>*/}

      {/* BOOKING BUTTON */}
      <View style={styles.cardActions}>

        {onAsign ?  <TouchableOpacity
          style={[styles.bookBtn,!horizontal && styles.bookBtnMd]}
          onPress={() =>onAsign(item) }
        >
          <Ionicons name="person-add-outline" size={16} color={HomeColor.primary} />
          <Text style={[styles.bookText, !horizontal && styles.btnTextPrimary]}>Назначить</Text>
        </TouchableOpacity> : <TouchableOpacity
          style={[styles.bookBtn,!horizontal && styles.bookBtnMd]}
          onPress={() => handleView(item)}
        >
          <Ionicons name="eye-outline" size={16} color={HomeColor.primary} />
          <Text style={[styles.bookText, !horizontal && styles.btnTextPrimary]}>Смотреть</Text>
        </TouchableOpacity>}
      </View>
    </View>
  );

  const renderFilter = ({ item }:{item: { label: string, value: string }}) => {
    const isActive = item.value === selected;

    return (
      <TouchableOpacity
        onPress={() => setSelected(item.value)}
        style={[
          styles.chip,
          isActive && styles.chipActive,
        ]}
      >
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };


  useFocusEffect(useCallback(()=>refetch,[]))

  return (
    <View style={[styles.container, !horizontal && { paddingRight: 10}]}> 
      {/* FILTER */}

      {/* PATIENTS */}
      <View style={{justifyContent:'space-between', flexDirection:"row",alignItems:'center'}}>
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          renderItem={renderFilter}
          contentContainerStyle={{ gap: 8, marginBottom: 12,paddingHorizontal:12 }}
        />
        <TouchableOpacity style={styles.addBtn} onPress={()=> openDrawer && openDrawer()} >
          <Ionicons name="person-add-outline" size={16} color={HomeColor.white} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredDoctors}
        key={horizontal ? 'horizontal' : 'grid'} // 👈 важно!
        numColumns={horizontal ? 1 : 2}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderPatient}
        contentContainerStyle={{ gap: 8, paddingVertical: 12 }}
        columnWrapperStyle={!horizontal ? { gap: 8, paddingHorizontal: 12 } : undefined}
        horizontal={horizontal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  cardActions: {
    flex: 1,
    marginTop:10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A9FF5',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  link: {
    fontSize: 12,
    color: '#3B82F6',
  },

  /* FILTER */
  chip: {
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    paddingVertical: 8,
    minWidth: 75,
    ...shadow(C.text, 0.2, 5, 7),
  },

  chipActive: {
    backgroundColor: '#4A9FF5',
  },

  chipText: {
    fontSize: 14,
    color: '#4A9FF5',
    fontWeight:"bold",
    textAlign:'center',
  },

  chipTextActive: {
    color: '#fff',
  },

  /* CARD */
  card: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 100,
    borderRadius: 14,
    marginBottom: 8,
  },

  name: {
    fontSize: 13,
    fontWeight: '600',
  },

  spec: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },

  rating: {
    fontSize: 12,
  },

  bookBtn: {
    backgroundColor: HomeColor.primaryLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,flexDirection:"row",alignItems: "center", justifyContent: "center",gap:5
  },
  bookBtnMd: {
    backgroundColor: HomeColor.primaryLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,flexDirection:"row",alignItems: "center", justifyContent: "center",gap:5
  },
  btnTextPrimary: { color: HomeColor.primaryDark, fontWeight: 'bold', fontSize: 12 },

  bookTextMd: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bookText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  addBtn: {
    backgroundColor: bookingColors.pink,
    borderRadius: '50%',
    padding:5,
    minWidth:50,
    minHeight:50,
    color:"white",
    flexDirection:"row",alignItems: "center",justifyContent:"center",gap:5,
  } ,

  addBtnText: {
    color:"white",
  },
  input:{

  }
});

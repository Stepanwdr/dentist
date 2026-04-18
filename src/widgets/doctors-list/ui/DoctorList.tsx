import React, {FC, useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabParamList } from "@app/navigation/types";
import {shadow} from "@features/book-slot/lib";
import {bookingColors as C} from "@shared/theme/Booking.colors";
import {useGetDentists } from "@entities/dentist/model/useGetDentists";
import { Dentist } from "@shared/types/dentist";

const specialties = [
  { label: 'Все', value: 'All' },
  { label: 'Терапевт', value: 'Therapist' },
  { label: 'Хирург', value: 'Surgeon' },
  { label: 'Ортопед', value: 'Prosthodontist' },
  { label: 'Имплантолог', value: 'Implantologist' },
];
type Props = {
  navigation: NativeStackNavigationProp<TabParamList, 'HomeTab'>;
  horizontal?: boolean;
};

export const DoctorList: FC<Props> = ({navigation, horizontal}) => {
  const [selected, setSelected] = useState('Все');
  const { data } = useGetDentists({ search: '' })

  const filteredDoctors = useMemo(() => {
    if (selected === 'Все') return data;
    return data?.filter((doc) => doc.speciality === selected);
  }, [selected,data]);

  const renderDoctor = ({ item }:{item:Dentist}) => (
    <View style={[styles.card, !horizontal && { width: "50%" }]} >
      <Image source={{ uri: item.avatar }} style={styles.image} />

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.spec}>{item.speciality}</Text>

      {/*<Text style={styles.rating}>*/}
      {/*  ⭐ {item.rating} ({item.reviews})*/}
      {/*</Text>*/}

      {/* BOOKING BUTTON */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.bookBtn,!horizontal && styles.bookBtnMd]}
          onPress={() =>
            navigation.navigate('BookingTab', {
              dentistId: item.id,
            })
          }
        >
          <Text style={[styles.bookText, !horizontal && styles.bookTextMd]}>Записаться</Text>
        </TouchableOpacity>
        {!horizontal && <TouchableOpacity
          style={[styles.bookBtn, !horizontal && styles.bookBtnMd]}
          onPress={() =>
            navigation.navigate('BookingTab', {
              dentistId: item.id,
            })
          }
        >
          {<Text style={[styles.bookText, !horizontal && styles.bookTextMd, styles.bookText]}>Смотреть</Text>}
        </TouchableOpacity>}
      </View>
    </View>
  );

  const renderFilter = ({ item }) => {
    const isActive = item.label === selected;

    return (
      <TouchableOpacity
        onPress={() => setSelected(item.label)}
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

  return (
    <View style={[styles.container, !horizontal && { paddingRight: 10}]}>
      {/* FILTER */}
      <FlatList
        data={specialties}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.value}
        renderItem={renderFilter}
        contentContainerStyle={{ gap: 8, marginBottom: 12,paddingHorizontal:12 }}
      />

      {/* DOCTORS */}

      <FlatList
        data={filteredDoctors}
        key={horizontal ? 'horizontal' : 'grid'} // 👈 важно!
        numColumns={horizontal ? 1 : 2}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctor}
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
   flex: 1
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
    marginTop: 8,
    backgroundColor: '#4A9FF5',
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },

  bookBtnMd: {
    marginTop: 20,
    backgroundColor: '#4A9FF5',
    borderRadius: 16,
    height: 30,
    textAlign:"center",
    marginTop: 10,
  },
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
});
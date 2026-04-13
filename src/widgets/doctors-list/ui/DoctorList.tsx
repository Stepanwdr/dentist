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

const doctors = [
  {
    id: '1',
    name: 'Dr. Arnold Chen',
    spec: 'Ортопед',
    rating: 4.9,
    reviews: 124,
    image: 'https://www.pinnacledentalgroupmi.com/wp-content/uploads/2023/11/general-dentistry-img.jpeg'
  },
  {
    id: '2',
    name: 'Dr. Marcus Vance',
    spec: 'Хирург',
    rating: 5.0,
    reviews: 98,
    image: 'https://t4.ftcdn.net/jpg/02/40/98/21/360_F_240982187_auR9cM9G0gGmXvh1RZJoBufjTKVIclC3.jpg',
  },
  {
    id: '3',
    name: 'Dr. Elena Rodriguez',
    spec: 'Имплантолог',
    rating: 4.8,
    reviews: 210,
    image: 'https://www.pinnacledentalgroupmi.com/wp-content/uploads/2023/11/FemaleDentist_1110x700.jpeg',
  },
  {
    id: '4',
    name: 'Dr. Arnold Chen',
    spec: 'Терапевт',
    rating: 4.9,
    reviews: 124,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Taw2jOKl8OTdYdL6ZW4i5J79LimZrjhKkw&s'
  },
  {
    id: '5',
    name: 'Dr. Marcus Vance',
    spec: 'Хирург',
    rating: 5.0,
    reviews: 98,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjoQgcjD2kQjbcZ6zs3BzRhmu94HAN03tI2Q&s',
  },
];

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

  const filteredDoctors = useMemo(() => {
    if (selected === 'Все') return doctors;
    return doctors.filter((doc) => doc.spec === selected);
  }, [selected]);

  const renderDoctor = ({ item }) => (
    <View style={[styles.card, !horizontal && { width: "50%" }]} >
      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.spec}>{item.spec}</Text>

      <Text style={styles.rating}>
        ⭐ {item.rating} ({item.reviews})
      </Text>

      {/* BOOKING BUTTON */}
      <TouchableOpacity
        style={[styles.bookBtn,!horizontal && styles.bookBtnMd]}
        onPress={() =>
          navigation.navigate('BookingTab', {
            screen: item.id,
          })
        }
      >
        <Text style={[styles.bookText, !horizontal && styles.bookTextMd]}>Записаться</Text>
      </TouchableOpacity>
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
    <View style={[styles.container,  !horizontal && {paddingRight:10}]}>
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
  container: {
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
import {FlatList, TextInput, Text, View, TouchableOpacity} from "react-native";
import {FC, useState} from "react";
interface Props {
  services: string[];
  onSelect: (value: string) => void;
  close :() => void;
}
export const ServicesList:FC<Props> = ({services,onSelect,close}) => {
  const [search, setSearch] = useState("");

  const filtered = services.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>
        Выбор процедуры
      </Text>

      <TextInput
        placeholder="Поиск..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 12,
          padding: 10,
        }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              onSelect(item);
              close();
            }}
            style={{
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderColor: "#eee",
            }}
          >
            <Text style={{ fontSize: 16 }}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";

export interface ServicePickerRef {
  open: () => void;
  close: () => void;
}

interface Props {
  services: string[];
  onSelect: (value: string) => void;
}

export const ServicePickerSheet = forwardRef<ServicePickerRef, Props>(
  ({ services, onSelect }, ref) => {
    const sheetRef = useRef<ActionSheetRef>(null);
    const [search, setSearch] = useState("");

    const filtered = services.filter((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    );

    const open = () => sheetRef.current?.show();
    const close = () => sheetRef.current?.hide();

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    return (
      <ActionSheet ref={sheetRef} gestureEnabled>
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
      </ActionSheet>
    );
  }
);
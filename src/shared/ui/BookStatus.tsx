import { View, Text, StyleSheet } from "react-native";
import { bookStatus } from "@shared/types/slot";

const STATUS_STYLES: Record<bookStatus, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#FEF3C7', color: '#92400E', label: 'В ожидании' },
  confirmed: { bg: '#DCFCE7', color: '#166534', label: 'Подтверждено' },
  canceled:  { bg: '#FECACA', color: '#991B1B', label: 'Отменено' },
  finished:  { bg: '#DBEAFE', color: '#3730A3', label: 'Завершено' },
};

export const BookStatus = ({ status }: { status: bookStatus }) => {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.pending;

  return (
    <View style={[styles.root, { backgroundColor: style.bg }]}> 
      <Text style={[styles.text, { color: style.color }]}>{style.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
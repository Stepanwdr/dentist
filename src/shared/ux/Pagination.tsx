import {FC} from "react";
import {TouchableOpacity, View, Text, StyleSheet} from "react-native";
import {shadow} from "@features/book-slot/lib";
import {Colors} from "@shared/theme/colors";
import {PaginationParams} from "@shared/types";

interface Props {
  pagination:PaginationParams
  onPageChange: (page: number) => void
}
export const Pagination: FC<Props> = ({pagination,onPageChange}) => {
  return (
    <View style={styles.pagination}>
      <TouchableOpacity
        disabled={pagination.page === 1}
        onPress={() => onPageChange(pagination.page - 1)}
      >
        <Text style={styles.pageBtn}>Prev</Text>
      </TouchableOpacity>

      <Text>
        {pagination.page} / {pagination.lastPage || 1}
      </Text>

      <TouchableOpacity
        disabled={pagination.page === pagination.lastPage}
        onPress={() => onPageChange(pagination.page + 1)}
      >
        <Text style={styles.pageBtn}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  pagination: {
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 999,
    backgroundColor: "white",
    padding:10,
    borderRadius: 24,
    marginBottom:20,
    ...shadow()
  },

  pageBtn: {
    fontSize: 16,
    color: Colors.primary,
  },
})
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
} from "@entities/notifications/model/notification.hook";

import { Notification } from "@shared/types/notifications";
import { Pagination } from "@shared/ux/Pagination";

type FilterType = "all" | "unread" | "promo" | "booking";

export const Notifications = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");
  const params = {
    page,
    ...(filter === "unread" ? { isRead: false } : {}),
    ...(filter === "promo" ? { type: "promo" } : {}),
    ...(filter === "booking" ? { type: "booking" } : {}),
  };

  const { data, isLoading, isError,isFetched, refetch } = useNotifications(params);
  const markAsRead = useMarkAsRead();
  const markAll = useMarkAllAsRead();

  const notifications = data?.data ?? [];
  const meta = data?.pagination ?? {};


  useEffect(() => {
    void refetch()
  }, [filter]);



  if (isLoading && !isFetched) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Ошибка загрузки</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unread]}
      disabled={markAsRead.isPending}
      onPress={() => {
        if (!item.isRead) {
          markAsRead.mutate(item.id);
        }
      }}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {item.title || "Уведомление"}
        </Text>
        {!item.isRead && <View style={styles.dot} />}
      </View>

      {!!item.message && (
        <Text style={styles.message}>{item.message}</Text>
      )}

      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.root}>
      {/* 🔹 HEADER */}
      <View style={styles.header}>
        <Text style={styles.titleBig}>Notifications</Text>

        <TouchableOpacity
          style={styles.markAllBtn}
          onPress={() => markAll.mutate()}
        >
          <Text style={styles.markAllText}>Mark all</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 FILTERS */}
      <View style={styles.filters}>
        {["all", "unread", "promo", "booking"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.chip,
              filter === f && styles.chipActive,
            ]}
            onPress={() => {
              setFilter(f as FilterType);
              setPage(1);
            }}
          >
            <Text
              style={
                filter === f
                  ? styles.chipTextActive
                  : styles.chipText
              }
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔹 LIST */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 8, paddingBottom: 80 }}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.notData}>Нет уведомлений</Text>
          </View>
        }
      />

      {/* 🔹 PAGINATION */}
      <Pagination pagination={{...meta,page}} onPageChange={setPage} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notData: {
   fontSize: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },

  titleBig: {
    fontSize: 22,
    fontWeight: "700",
  },

  markAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },

  markAllText: {
    color: "#fff",
    fontSize: 12,
  },

  filters: {
    flexDirection: "row",
    paddingHorizontal: 8,
    marginBottom: 8,
  },

  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#eee",
    marginRight: 6,
  },

  chipActive: {
    backgroundColor: "#007AFF",
  },

  chipText: {
    fontSize: 12,
  },

  chipTextActive: {
    fontSize: 12,
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },

  unread: {
    backgroundColor: "#EEF6FF",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    fontWeight: "600",
  },

  message: {
    marginTop: 6,
    color: "#555",
  },

  date: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },

});
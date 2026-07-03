import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { design } from "../../constants/design";
import {
  LeaveStatus,
  leaveFilters,
  leaveStatusStyles,
} from "../../constants/leave";
import { useLeave } from "../../hooks/useLeave";
import NoData from "../noData";

export default function LeaveList() {
  const theme = useTheme();
  const { spacing, radii, typography } = design;

  const [activeFilter, setActiveFilter] = useState<LeaveStatus>("All");
  const { leaves, loading, showDetails } = useLeave(activeFilter);

  return (
    <View style={{ gap: spacing.md }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm, paddingVertical: 2 }}
      >
        {leaveFilters.map((item) => {
          const active = activeFilter === item;
          const statusColor =
            item === "All" ? theme.colors.primary : leaveStatusStyles[item].color;

          return (
            <TouchableOpacity
              key={item}
              activeOpacity={0.8}
              onPress={() => setActiveFilter(item)}
              style={{
                paddingHorizontal: spacing.md,
                height: 36,
                borderRadius: radii.full,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: active ? statusColor : theme.colors.surfaceVariant,
                borderWidth: active ? 0 : 1,
                borderColor: `${theme.colors.outline}15`,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: active ? "800" : "600",
                  color: active ? "#FFF" : theme.colors.onSurfaceVariant,
                }}
              >
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading && leaves.length === 0 ? (
        <View style={{ paddingVertical: spacing["3xl"], alignItems: "center" }}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : leaves.length === 0 ? (
        <NoData
          title={activeFilter === "All" ? "No Leave Records" : `No ${activeFilter} Leave`}
          description={
            activeFilter === "All"
              ? "You haven't applied for any leave yet. Tap Apply Leave to get started."
              : `You have no ${activeFilter.toLowerCase()} leave applications.`
          }
          icon="calendar-blank-outline"
        />
      ) : (
        <View style={{ gap: spacing.sm }}>
          {leaves.map((item, index) => {
            const statusKey = (item.manager_status as keyof typeof leaveStatusStyles) || "Pending";
            const statusStyle = leaveStatusStyles[statusKey] || leaveStatusStyles.Pending;

            return (
              <TouchableOpacity
                key={`${item.leave_id}-${index}`}
                activeOpacity={0.7}
                onPress={() => showDetails(item)}
                style={{
                  flexDirection: "row",
                  borderRadius: radii.xl,
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: `${theme.colors.outline}1A`,
                  overflow: "hidden",
                }}
              >
                {/* Status accent rail */}
                <View style={{ width: 4, backgroundColor: statusStyle.color }} />

                <View style={{ flex: 1, padding: spacing.md, gap: spacing.xs }}>
                  {/* Header: status + applied date */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: radii.full,
                        backgroundColor: `${statusStyle.color}14`,
                      }}
                    >
                      <MaterialCommunityIcons
                        name={statusStyle.icon}
                        size={13}
                        color={statusStyle.color}
                      />
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "800",
                          letterSpacing: 0.4,
                          color: statusStyle.color,
                        }}
                      >
                        {statusStyle.label.toUpperCase()}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: typography.sizes.xs,
                        color: theme.colors.onSurfaceVariant,
                        fontWeight: "600",
                      }}
                    >
                      {item.date}
                    </Text>
                  </View>

                  {/* Title */}
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: typography.sizes.sm,
                      fontWeight: "700",
                      color: theme.colors.onSurface,
                    }}
                  >
                    {item.leave_name}
                  </Text>

                  {/* Footer: period + duration */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="calendar-range"
                      size={13}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        flex: 1,
                        fontSize: typography.sizes.xs,
                        color: theme.colors.onSurfaceVariant,
                        fontWeight: "600",
                      }}
                    >
                      {item.leave_period}
                      {item.duration_name ? ` • ${item.duration_name}` : ""}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

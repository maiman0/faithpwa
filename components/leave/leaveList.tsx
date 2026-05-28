import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { design } from "../../constants/design";
import {
  LeaveStatus,
  leaveFilters,
  leaveStatusStyles,
} from "../../constants/leave";
import { useLeave } from "../../hooks/useLeave";

export default function LeaveList() {
  const theme = useTheme();
  const { spacing, radii } = design;

  const [activeFilter, setActiveFilter] = useState<LeaveStatus>("All");
  const { leaves, loading, showDetails } = useLeave(activeFilter);

  if (loading && leaves.length === 0) {
    return (
      <View style={{ padding: spacing.xl, alignItems: "center" }}>
        <Text>Loading leave records...</Text>
      </View>
    );
  }

  return (
    <View style={{ gap: spacing.md }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm, paddingVertical: 2 }}
      >
        {leaveFilters.map((item) => {
          const active = activeFilter === item;
          const statusStyle = item === "All" 
            ? { color: theme.colors.primary } 
            : leaveStatusStyles[item];

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
                backgroundColor: active ? statusStyle.color : theme.colors.surfaceVariant,
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

      <View style={{ gap: spacing.sm }}>
        {leaves.map((item, index) => {
          const statusKey = (item.manager_status as any) || 'Pending';
          const statusStyle = leaveStatusStyles[statusKey as keyof typeof leaveStatusStyles] || leaveStatusStyles.Pending;

          return (
            <TouchableOpacity
              key={`${item.leave_id}-${index}`}
              activeOpacity={0.7}
              onPress={() => showDetails(item)}
              style={{
                borderRadius: 28,
                padding: spacing.lg,
                backgroundColor: theme.colors.surface,
                elevation: 1,
                overflow: "hidden",
                gap: spacing.xs,
              }}
            >
              {/* Background Decorative Icon */}
              <View
                style={{
                  position: "absolute",
                  right: -15,
                  top: -15,
                  opacity: 0.06,
                  transform: [{ rotate: "-15deg" }],
                }}
              >
                <MaterialCommunityIcons
                  name={statusStyle.icon as any}
                  size={110}
                  color={statusStyle.color}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: radii.full,
                    backgroundColor: `${statusStyle.color}15`,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <View 
                    style={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: 3, 
                      backgroundColor: statusStyle.color 
                    }} 
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "800",
                      color: statusStyle.color,
                      letterSpacing: 0.5,
                    }}
                  >
                    {item.manager_status.toUpperCase()}
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 11,
                    color: theme.colors.onSurfaceVariant,
                    fontWeight: "600",
                  }}
                >
                  {item.date}
                </Text>
              </View>

              <View style={{ marginTop: spacing.xs }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "800",
                    color: theme.colors.onSurface,
                  }}
                >
                  {item.leave_name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: theme.colors.onSurfaceVariant,
                    marginTop: 2,
                    fontWeight: "600",
                  }}
                >
                  {item.leave_period} • {item.duration_name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

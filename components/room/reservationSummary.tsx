import React from "react";
import { View, ImageBackground } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../../contexts/designContext";

type Props = {
  imageUrl?: string | null;
  roomName?: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  label?: string;
  reference?: string;
  statusLabel?: string;
  statusColor?: string;
};

export default function ReservationSummary({
  imageUrl,
  roomName,
  dateLabel,
  timeLabel,
  locationLabel,
  label = "RESERVATION SUMMARY",
  reference,
  statusLabel,
  statusColor,
}: Props) {
  const theme = useTheme();
  const tokens = useDesign();

  return (
    <Card
      mode="contained"
      style={{
        backgroundColor: theme.colors.primaryContainer + "20",
        borderRadius: tokens.radii.xl,
      }}
    >
      <Card.Content
        style={{
          flexDirection: "row",
          gap: tokens.spacing.md,
          padding: tokens.spacing.sm,
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: tokens.radii.lg,
            overflow: "hidden",
            backgroundColor: theme.colors.surfaceVariant,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imageUrl ? (
            <ImageBackground
              source={{ uri: imageUrl }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <MaterialCommunityIcons
              name="door"
              size={36}
              color={theme.colors.onSurfaceVariant}
            />
          )}
        </View>

        <View style={{ flex: 1, justifyContent: "center", gap: 2 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              variant="labelMedium"
              style={{ color: theme.colors.primary, fontWeight: "800" }}
            >
              {label}
            </Text>
            {statusLabel && (
              <View
                style={{
                  backgroundColor: statusColor ?? theme.colors.primary,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: tokens.radii.full,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: "800", color: "#FFF" }}>
                  {statusLabel.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text variant="titleLarge" style={{ fontWeight: "900" }} numberOfLines={1}>
            {roomName}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ fontWeight: "700", color: theme.colors.onSurfaceVariant }}
          >
            {dateLabel}
          </Text>
          <Text
            variant="bodyMedium"
            style={{ fontWeight: "700", color: theme.colors.onSurfaceVariant }}
          >
            {timeLabel}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {locationLabel}
          </Text>
          {reference && (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, fontWeight: "700" }}
            >
              {reference}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

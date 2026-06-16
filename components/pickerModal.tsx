import React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../contexts/designContext";

type PickerModalProps<T> = {
  title: string;
  data: T[];
  selected?: T | null;
  onSelect: (item: T) => void;
  keyExtractor: (item: T) => string;
  labelExtractor: (item: T) => string;
  iconExtractor: (item: T) => keyof typeof MaterialCommunityIcons.glyphMap;
};

// Compact list: show ~4 rows then scroll the rest within the modal.
const VISIBLE_ITEMS = 4;
const ROW_HEIGHT = 56;
const ROW_GAP = 8;

export default function PickerModal<T>({
  title,
  data,
  selected,
  onSelect,
  keyExtractor,
  labelExtractor,
  iconExtractor,
}: PickerModalProps<T>) {
  const { colors } = useTheme();
  const tokens = useDesign();

  const scrollable = data.length > VISIBLE_ITEMS;
  const maxListHeight = ROW_HEIGHT * VISIBLE_ITEMS + ROW_GAP * VISIBLE_ITEMS;

  return (
    <View style={{ gap: tokens.spacing.md }}>
      <View style={{ alignItems: "center" }}>
        <Text variant="titleMedium" style={{ fontWeight: "700" }}>
          {title}
        </Text>
      </View>

      <ScrollView
        style={scrollable ? { maxHeight: maxListHeight } : undefined}
        contentContainerStyle={{ gap: ROW_GAP, paddingVertical: 2 }}
        showsVerticalScrollIndicator={scrollable}
        nestedScrollEnabled
        bounces={false}
      >
        {data.map((item) => {
          const isSelected =
            selected && keyExtractor(selected) === keyExtractor(item);

          return (
            <Pressable
              key={keyExtractor(item)}
              onPress={() => onSelect(item)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: tokens.spacing.md,
                padding: tokens.spacing.sm,
                borderRadius: tokens.radii.lg,
                backgroundColor: isSelected
                  ? colors.primaryContainer
                  : colors.surfaceVariant,
                opacity: pressed ? 0.92 : 1,
              })}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: tokens.radii.md,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                }}
              >
                <MaterialCommunityIcons
                  name={iconExtractor(item)}
                  size={20}
                  color={isSelected ? colors.onPrimary : colors.onSurfaceVariant}
                />
              </View>

              <Text
                variant="titleSmall"
                style={{ flex: 1, fontWeight: "700" }}
              >
                {labelExtractor(item)}
              </Text>

              {isSelected && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={22}
                  color={colors.primary}
                />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

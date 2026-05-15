import React from "react";
import { View, Pressable } from "react-native";
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

  return (
    <View
      style={{
        gap: tokens.spacing.xl,
      }}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Text
          variant="titleMedium"
          style={{
            fontWeight: "700",
          }}
        >
          {title}
        </Text>
      </View>

      <View
        style={{
          gap: tokens.spacing.md,
        }}
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
                gap: tokens.spacing.lg,
                padding: tokens.spacing.lg,
                borderRadius: tokens.radii["2xl"],
                backgroundColor: isSelected
                  ? colors.primaryContainer
                  : colors.surfaceVariant,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: tokens.radii.full,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                }}
              >
                <MaterialCommunityIcons
                  name={iconExtractor(item)}
                  size={24}
                  color={
                    isSelected ? colors.onPrimary : colors.onSurfaceVariant
                  }
                />
              </View>

              <Text
                variant="bodyLarge"
                style={{
                  flex: 1,
                  fontWeight: "600",
                }}
              >
                {labelExtractor(item)}
              </Text>

              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={colors.onSurfaceVariant}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

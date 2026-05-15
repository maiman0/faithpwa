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
        gap: tokens.spacing.md,
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
          gap: tokens.spacing.sm,
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
                padding: tokens.spacing.md,
                borderRadius: tokens.radii["2xl"],
                backgroundColor: isSelected
                  ? colors.primaryContainer
                  : colors.surfaceVariant,
                opacity: pressed ? 0.92 : 1,
              })}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
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
                variant="titleSmall"
                style={{
                  flex: 1,
                  fontWeight: "700",
                }}
              >
                {labelExtractor(item)}
              </Text>

              {isSelected && (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: tokens.radii.full,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={14}
                    color={colors.onPrimary}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

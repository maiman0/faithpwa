import React from "react";
import { View, Pressable } from "react-native";
import { Text, useTheme, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDesign } from "../contexts/designContext";

type DocumentOption = {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  description: string;
  onPress: () => void;
};

type DocumentModalProps = {
  title?: string;
  onPickCamera: () => void;
  onPickGallery: () => void;
  onPickFile: () => void;
};

export default function DocumentModal({
  title = "Attach Document",
  onPickCamera,
  onPickGallery,
  onPickFile,
}: DocumentModalProps) {
  const { colors } = useTheme();
  const tokens = useDesign();

  const options: DocumentOption[] = [
    {
      id: "camera",
      label: "Take Photo",
      icon: "camera-outline",
      description: "Use your camera to snap a document",
      onPress: onPickCamera,
    },
    {
      id: "gallery",
      label: "Photo Library",
      icon: "image-outline",
      description: "Choose from your saved photos",
      onPress: onPickGallery,
    },
    {
      id: "file",
      label: "Browse Files",
      icon: "file-document-outline",
      description: "Select a PDF or document file",
      onPress: onPickFile,
    },
  ];

  return (
    <View style={{ gap: tokens.spacing.lg }}>
      <View style={{ alignItems: "center", gap: 4 }}>
        <Text variant="titleMedium" style={{ fontWeight: "700" }}>
          {title}
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: colors.onSurfaceVariant, textAlign: "center" }}
        >
          Select a source to upload your supporting document
        </Text>
      </View>

      <View style={{ gap: tokens.spacing.sm }}>
        {options.map((option, index) => (
          <React.Fragment key={option.id}>
            <Pressable
              onPress={option.onPress}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: tokens.spacing.lg,
                padding: tokens.spacing.md,
                borderRadius: tokens.radii["2xl"],
                backgroundColor: pressed
                  ? colors.surfaceVariant
                  : colors.surfaceVariant + '40',
              })}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.primaryContainer,
                }}
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={26}
                  color={colors.primary}
                />
              </View>

              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="titleSmall" style={{ fontWeight: "700" }}>
                  {option.label}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: colors.onSurfaceVariant, opacity: 0.8 }}
                >
                  {option.description}
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colors.outline}
              />
            </Pressable>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

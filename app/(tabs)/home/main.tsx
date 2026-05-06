import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Button, Card, useTheme, Divider, Checkbox, Icon } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import { useTabs } from "../../../contexts/tabContext";
import { useOverlay } from "../../../contexts/overlayContext";
import Header from "../../../components/header";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Main() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();
  const { alert, confirm, toast, showModal, hideModal } = useOverlay();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, []);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAlert = () => {
    alert({
      title: "Notification",
      message: "This is a simple alert message to inform you about something.",
      buttonText: "Understood",
    });
  };

  const handleConfirm = () => {
    confirm({
      title: "Are you sure?",
      message: "This action will permanently delete the item. This cannot be undone.",
      confirmText: "Delete",
      cancelText: "Keep it",
      isDestructive: true,
      onConfirm: () => toast("Item deleted successfully"),
    });
  };

  const handleToast = () => {
    toast({
      message: "Changes saved successfully!",
      variant: "success",
      actionLabel: "Undo",
      onAction: () => alert({ title: "Undo", message: "Action has been reversed." }),
    });
  };

  // Re-triggering the modal with updated state to simulate a live picker
  // In a real app, you might use a separate component for the modal content
  useEffect(() => {
    // This is just to make the demo feel interactive if the modal is already open
    // However, showModal normally takes a snapshot. For a real picker, 
    // a dedicated Picker component inside the modal would be better.
  }, [selectedDays]);

  const handleModal = () => {
    showModal({
      content: (
        <View style={{ gap: tokens.spacing.md }}>
          <View style={{ paddingBottom: tokens.spacing.sm, marginBottom: tokens.spacing.xs }}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Select Days</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>Choose your preferred schedule</Text>
          </View>
          
          <View>
            {DAYS.map((day) => (
              <TouchableOpacity 
                key={day} 
                onPress={() => {
                  // In this demo, we'll just show the UI. 
                  // Real state updates would need the modal content to be its own component
                  // to avoid closing/reopening, but for a demo we'll keep it simple.
                  toggleDay(day);
                  toast(`Selected ${day}`);
                }}
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  paddingVertical: tokens.spacing.sm,
                }}
              >
                <Text variant="bodyLarge">{day}</Text>
                <Icon 
                  source={selectedDays.includes(day) ? "check-circle" : "circle-outline"} 
                  size={24} 
                  color={selectedDays.includes(day) ? theme.colors.primary : theme.colors.outline} 
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <Button 
            mode="contained" 
            onPress={hideModal} 
            style={{ marginTop: tokens.spacing.md, borderRadius: tokens.radii.pill }}
          >
            Apply Selection
          </Button>
        </View>
      ),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: tokens.spacing.xl,
          paddingBottom: tokens.spacing["3xl"],
        }}
      >
        <Header title="Overlay Demo" subtitle="Interactive Components" showBack />

        <Card
          mode="elevated"
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: tokens.radii.xl,
            marginTop: tokens.spacing.md,
          }}
          contentStyle={{
            padding: tokens.spacing.xl,
            gap: tokens.spacing.lg,
          }}
        >
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            Explore the different types of interactive overlays available in the application.
          </Text>

          <Divider />

          <View style={{ gap: tokens.spacing.md }}>
            <View>
              <Text variant="titleMedium">Alert Dialog</Text>
              <Text variant="bodySmall" style={{ marginBottom: tokens.spacing.sm }}>
                Used for simple informational messages.
              </Text>
              <Button mode="outlined" onPress={handleAlert}>
                Show Alert
              </Button>
            </View>

            <Divider />

            <View>
              <Text variant="titleMedium">Confirmation Dialog</Text>
              <Text variant="bodySmall" style={{ marginBottom: tokens.spacing.sm }}>
                Used when a user needs to confirm an action.
              </Text>
              <Button mode="outlined" onPress={handleConfirm}>
                Show Confirm
              </Button>
            </View>

            <Divider />

            <View>
              <Text variant="titleMedium">Toast Notification</Text>
              <Text variant="bodySmall" style={{ marginBottom: tokens.spacing.sm }}>
                Non-intrusive feedback messages at the bottom.
              </Text>
              <Button mode="outlined" onPress={handleToast}>
                Show Toast
              </Button>
            </View>

            <Divider />

            <View>
              <Text variant="titleMedium">Custom Modal</Text>
              <Text variant="bodySmall" style={{ marginBottom: tokens.spacing.sm }}>
                Flexible container for complex UI or forms.
              </Text>
              <Button mode="outlined" onPress={handleModal}>
                Show Modal
              </Button>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

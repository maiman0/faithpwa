import React from 'react';
import { View, ScrollView, ImageBackground } from 'react-native';
import { Text, Button, useTheme, TextInput, Card } from 'react-native-paper';
import { useDesign } from '../../../../contexts/designContext';
import { useRoom } from '../../../../hooks/useRoom';
import Header from '../../../../components/header';

export default function BookRoom() {
  const theme = useTheme();
  const tokens = useDesign();
  const { 
    staff,
    selectedRoom,
    selectedSlots,
    selectedDate,
    formattedDate,
    purpose, 
    setPurpose, 
    confirmBooking,
    isBookingValid,
    loading,
    router
  } = useRoom();

  const imageUrl = selectedRoom ? `https://endpoint.daythree.ai/faithMobile/room/${selectedRoom.room_id}.jpeg` : null;

  const bookingSummary = React.useMemo(() => {
    if (selectedSlots.length === 0) return null;
    const firstSlot = selectedSlots[0];
    const lastSlot = selectedSlots[selectedSlots.length - 1];
    
    if (!firstSlot || !lastSlot) return null;

    const start = firstSlot.split(' - ')[0];
    const end = lastSlot.split(' - ')[1];
    return { start, end };
  }, [selectedSlots]);

  const handleConfirm = async () => {
    await confirmBooking();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView 
        contentContainerStyle={{ 
            paddingHorizontal: tokens.spacing.lg,
            paddingBottom: tokens.spacing["3xl"],
            gap: tokens.spacing.lg
        }}
      >
        <Header 
          title="Complete Booking" 
          subtitle="Tell us the purpose of your reservation" 
          showBack 
        />

        <Card mode="contained" style={{ backgroundColor: theme.colors.primaryContainer + "20", borderRadius: tokens.radii.xl }}>
            <Card.Content style={{ flexDirection: 'row', gap: tokens.spacing.md, padding: tokens.spacing.sm }}>
                {imageUrl && (
                    <ImageBackground
                        source={{ uri: imageUrl }}
                        style={{ 
                            width: 100, 
                            height: 100, 
                            borderRadius: tokens.radii.lg, 
                            overflow: 'hidden',
                            backgroundColor: theme.colors.surfaceVariant
                        }}
                    />
                )}
                <View style={{ flex: 1, justifyContent: 'center', gap: 2 }}>
                    <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '800' }}>RESERVATION SUMMARY</Text>
                    <Text variant="titleLarge" style={{ fontWeight: '900' }}>{selectedRoom?.Room_Name}</Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '700', color: theme.colors.onSurfaceVariant }}>
                        {formattedDate}
                    </Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '700', color: theme.colors.onSurfaceVariant }}>
                        {bookingSummary?.start} - {bookingSummary?.end}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {selectedRoom?.Tower} • {selectedRoom?.Level}
                    </Text>
                </View>
            </Card.Content>
        </Card>

        <View style={{ gap: tokens.spacing.lg }}>
            <View style={{ gap: 8 }}>
                <Text variant="titleMedium" style={{ fontWeight: '800', marginLeft: 4 }}>Purpose of Use</Text>
                <TextInput
                    mode="outlined"
                    placeholder="e.g. Project Discussion, Team Meeting"
                    value={purpose}
                    onChangeText={setPurpose}
                    outlineStyle={{ borderRadius: tokens.radii.xl }}
                    style={{ backgroundColor: theme.colors.surface }}
                />
            </View>

            <View style={{ gap: 8 }}>
                <Text variant="titleMedium" style={{ fontWeight: '800', marginLeft: 4 }}>Person In Charge</Text>
                <TextInput
                    mode="outlined"
                    value={staff?.first_name || ""}
                    editable={false}
                    outlineStyle={{ borderRadius: tokens.radii.xl }}
                    style={{ backgroundColor: theme.colors.surfaceVariant + "20" }}
                    left={<TextInput.Icon icon="account-outline" />}
                />
            </View>
        </View>

        <Button
            mode="contained"
            disabled={!isBookingValid || loading}
            onPress={handleConfirm}
            contentStyle={{ height: 56 }}
            style={{ borderRadius: tokens.radii.pill, marginTop: tokens.spacing.md }}
            labelStyle={{ fontWeight: '900', fontSize: 16 }}
        >
            Confirm Reservation
        </Button>
      </ScrollView>
    </View>
  );
}

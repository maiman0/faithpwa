import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, useTheme, TextInput } from 'react-native-paper';
import { useDesign } from '../../../../contexts/designContext';
import { useRoom } from '../../../../hooks/useRoom';
import { roomImageUrl } from '../../../../helpers/room';
import Header from '../../../../components/header';
import ReservationSummary from '../../../../components/room/reservationSummary';

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

  const imageUrl = roomImageUrl(selectedRoom?.room_id);

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

        <ReservationSummary
          imageUrl={imageUrl}
          roomName={selectedRoom?.Room_Name}
          dateLabel={formattedDate}
          timeLabel={bookingSummary ? `${bookingSummary.start} - ${bookingSummary.end}` : ""}
          locationLabel={`${selectedRoom?.Tower} • ${selectedRoom?.Level}`}
        />

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

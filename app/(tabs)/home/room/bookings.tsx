import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDesign } from '../../../../contexts/designContext';
import { useRoom } from '../../../../hooks/useRoom';
import { formatRoomDateMedium, formatRoomTimeRange } from '../../../../helpers/room';
import Header from '../../../../components/header';
import NoData from '../../../../components/noData';
import ScrollTop from '../../../../components/scrollTop';

const BOOKING_FILTERS = [
  { value: 'Upcoming', label: 'Active', icon: 'calendar-clock' },
  { value: 'Past', label: 'History', icon: 'history' },
  { value: 'Cancelled', label: 'Void', icon: 'close-circle-outline' },
] as const;

export default function Bookings() {
  const theme = useTheme();
  const tokens = useDesign();
  const { myBookings, loading, refreshBookings, showBookingDetails } = useRoom();
  const [filter, setFilter] = useState('Upcoming');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const filteredBookings = useMemo(() => {
    return myBookings.filter(b => b.Tag === filter);
  }, [myBookings, filter]);

  const onRefresh = useCallback(() => {
    refreshBookings();
  }, [refreshBookings]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const getStatusColor = (tag: string) => {
    switch (tag) {
      case 'Upcoming': return '#3B82F6';
      case 'Past': return '#10B981';
      case 'Cancelled': return '#EF4444';
      default: return theme.colors.outline;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView 
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ 
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"],
          gap: tokens.spacing.md 
        }}
        refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
        <Header 
          title="My Reservations" 
          subtitle="View and manage your room bookings" 
          showBack 
        />

        <View style={{ flexDirection: 'row', gap: tokens.spacing.sm, marginBottom: tokens.spacing.sm }}>
          {BOOKING_FILTERS.map((item) => {
            const active = filter === item.value;
            const color = getStatusColor(item.value);
            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.8}
                onPress={() => setFilter(item.value)}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  height: 40,
                  borderRadius: tokens.radii.full,
                  backgroundColor: active ? color : theme.colors.surfaceVariant,
                  borderWidth: active ? 0 : 1,
                  borderColor: `${theme.colors.outline}15`,
                }}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={16}
                  color={active ? '#FFF' : theme.colors.onSurfaceVariant}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: active ? '800' : '600',
                    color: active ? '#FFF' : theme.colors.onSurfaceVariant,
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredBookings.length === 0 ? (
          <View style={{ marginTop: 40 }}>
            <NoData 
              title={`No ${filter} Bookings`} 
              description={
                  filter === 'Upcoming' 
                  ? "You don't have any active room reservations at the moment."
                  : `You don't have any ${filter.toLowerCase()} bookings in your history.`
              }
              icon={filter === 'Upcoming' ? 'calendar-blank' : 'history'}
            />
          </View>
        ) : (
          <View style={{ gap: tokens.spacing.sm }}>
            {filteredBookings.map((booking) => {
              const statusColor = getStatusColor(booking.Tag);
              return (
                <TouchableOpacity
                  key={booking.booking_id}
                  activeOpacity={0.7}
                  onPress={() => showBookingDetails(booking)}
                  style={{
                    flexDirection: 'row',
                    borderRadius: tokens.radii.xl,
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: `${theme.colors.outline}1A`,
                    overflow: 'hidden',
                  }}
                >
                  <View style={{ width: 4, backgroundColor: statusColor }} />

                  <View
                    style={{
                      flex: 1,
                      padding: tokens.spacing.md,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: tokens.spacing.sm,
                    }}
                  >
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text variant="titleSmall" style={{ fontWeight: '800' }} numberOfLines={1}>
                        {booking.Room_Name}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <MaterialCommunityIcons name="calendar-clock" size={13} color={theme.colors.onSurfaceVariant} />
                        <Text
                          variant="bodySmall"
                          numberOfLines={1}
                          style={{ flex: 1, color: theme.colors.onSurfaceVariant, fontWeight: '600' }}
                        >
                          {formatRoomDateMedium(booking.Start_Date)} • {formatRoomTimeRange(booking.Start_Date, booking.End_Date)}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: tokens.radii.full,
                        backgroundColor: `${statusColor}14`,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '800', letterSpacing: 0.4, color: statusColor }}>
                        {booking.Tag.toUpperCase()}
                      </Text>
                    </View>

                    <MaterialCommunityIcons name="chevron-right" size={18} color={theme.colors.onSurfaceVariant} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}

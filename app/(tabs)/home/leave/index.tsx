import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  Text,
  Button,
  Card,
  useTheme,
  Divider,
  Icon,
} from "react-native-paper";
import { useDesign } from "../../../../contexts/designContext";
import { useTabs } from "../../../../contexts/tabContext";
import { useOverlay } from "../../../../contexts/overlayContext";
import Header from "../../../../components/header";
import ScrollTop from "../../../../components/scrollTop";
import RowTwo from "../../../../components/rowtwo";
import LeaveList from "../../../../components/leave/leaveList";
import { useLeave } from "../../../../hooks/useLeave";

export default function Leave() {
  const theme = useTheme();
  const tokens = useDesign();
  const { setHideTabBar } = useTabs();
  const { toast, showSheet, hideModal } = useOverlay();
  const { stats } = useLeave();

  const scrollViewRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleApplyLeave = () => {
    showSheet({
      title: "Apply for Leave",
      content: (
        <View style={{ gap: tokens.spacing.lg }}>
          <Text variant="bodyMedium">
            Fill in the details below to submit your leave request. This will be
            sent to your supervisor for approval.
          </Text>

          <Divider />

          <View style={{ gap: tokens.spacing.md }}>
            <Text variant="titleSmall">Select Leave Type</Text>
            {[
              "Annual Leave",
              "Medical Leave",
              "Unpaid Leave",
              "Emergency Leave",
            ].map((type) => (
              <TouchableOpacity
                key={type}
                style={{
                  padding: tokens.spacing.md,
                  backgroundColor: theme.colors.surfaceVariant,
                  borderRadius: tokens.radii.md,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                onPress={() => {
                  toast(`Selected ${type}`);
                }}
              >
                <Text>{type}</Text>
                <Icon source="chevron-right" size={20} />
              </TouchableOpacity>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={() => {
              toast({
                message: "Leave request submitted!",
                variant: "success",
              });
              // In a real app, you'd close the sheet here
            }}
            style={{ marginTop: tokens.spacing.md }}
          >
            Submit Request
          </Button>
        </View>
      ),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: tokens.spacing.lg,
          paddingBottom: tokens.spacing["3xl"],
          gap: tokens.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Leave Management"
          subtitle="View balances and apply for leave"
          showBack
        />

        <RowTwo
          left={{
            icon: "clock-outline",
            label: "Pending Leave",
            value: stats.pending.toString(),
            color: "#F59E0B",
          }}
          right={{
            icon: "briefcase-outline",
            label: "Annual Balance",
            value: stats.annualBalance.toString(),
            color: "#10B981",
          }}
        />

        <Button
          mode="outlined"
          onPress={handleApplyLeave}
          style={{
            borderRadius: tokens.radii.pill,
          }}
          icon="plus"
        >
          Apply for Leave
        </Button>
        <LeaveList />
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}

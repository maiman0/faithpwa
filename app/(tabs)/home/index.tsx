import React, { useRef, useState } from "react";
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
} from "react-native";
import { useTheme, Text, Card } from "react-native-paper";
import { useDesign } from "../../../contexts/designContext";
import ScrollTop from "../../../components/scrollTop";
import { useTabs } from "../../../contexts/tabContext";

export default function Home() {
  const theme = useTheme();
  const tokens = useDesign();
  const { onScroll } = useTabs();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    setShowScrollTop(offset > 300);
    onScroll(offset);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: tokens.spacing.md,
          paddingBottom: tokens.spacing["3xl"],
          paddingHorizontal: tokens.spacing.lg,
          gap: tokens.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", gap: tokens.spacing.md }}>
          <Card
            mode="contained"
            style={{ flex: 1, backgroundColor: theme.colors.primaryContainer }}
          >
            <Card.Content>
              <Text variant="labelMedium">Shift Progress</Text>
              <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                6h 45m
              </Text>
            </Card.Content>
          </Card>
          <Card
            mode="contained"
            style={{
              flex: 1,
              backgroundColor: theme.colors.secondaryContainer,
            }}
          >
            <Card.Content>
              <Text variant="labelMedium">Satisfaction</Text>
              <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                98%
              </Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <ScrollTop visible={showScrollTop} onPress={scrollToTop} />
    </View>
  );
}

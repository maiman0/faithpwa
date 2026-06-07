import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "" }} />
      <Stack.Screen name="main" options={{ title: "" }} />
      <Stack.Screen name="attendance/index" options={{ title: "" }} />
      <Stack.Screen name="leave/index" options={{ title: "" }} />
      <Stack.Screen name="newsflash/index" options={{ title: "" }} />
    </Stack>
  );
}

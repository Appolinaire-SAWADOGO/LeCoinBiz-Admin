import { Stack } from "expo-router";
import { QueryProvider } from "../providers/QueryProvider";
import { useEffect } from "react";
import { subscribeToAdminTopic } from "../utils/notifications";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      await subscribeToAdminTopic();
    })();
  }, []);

  return (
    <>
      <StatusBar style="dark" />

      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </QueryProvider>
    </>
  );
}

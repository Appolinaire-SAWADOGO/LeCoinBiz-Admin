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
import { useFonts } from "expo-font";

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    "BasisGrotesqueArabicPro-Black": require("../assets/fonts/BasisGrotesqueArabicPro-Black.ttf"),
    "BasisGrotesqueArabicPro-Bold": require("../assets/fonts/BasisGrotesqueArabicPro-Bold.ttf"),
    "BasisGrotesqueArabicPro-Light": require("../assets/fonts/BasisGrotesqueArabicPro-Light.ttf"),
    "BasisGrotesqueArabicPro-Medium": require("../assets/fonts/BasisGrotesqueArabicPro-Medium.ttf"),
    "BasisGrotesqueArabicPro-Regular": require("../assets/fonts/BasisGrotesqueArabicPro-Regular.ttf"),
  });

  useEffect(() => {
    (async () => {
      await subscribeToAdminTopic();
    })();
  }, []);

  if (!fontsLoaded) return null;

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

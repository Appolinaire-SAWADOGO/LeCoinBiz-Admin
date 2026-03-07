import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

export default function AppText({
  font,
  fontSize,
  color,
  children,
  style,
  numberOfLines,
}: {
  font?: "Black" | "Bold" | "Light" | "Medium" | "Regular";
  fontSize?: number;
  color?: string;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number | undefined;
}) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontFamily: font
            ? `BasisGrotesqueArabicPro-${font}`
            : "BasisGrotesqueArabicPro-Regular",
          fontSize: fontSize,
          color: color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

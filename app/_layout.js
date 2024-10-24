import { View } from "react-native";
import React, { useEffect } from "react";
import { Stack, usePathname, useRouter } from "expo-router";

const Layout = ({ children }) => {
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathName.match("/_sitemap") || pathName === "/") {
      router.push("/auth/Login");
    }
  }, [pathName, router]);
  // console.log(pathName);

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {children}
      </Stack>
    </View>
  );
};

export default Layout;

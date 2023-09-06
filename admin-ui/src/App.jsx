import NavHelper from "./utils/nav-helper";
import CustomAppShell from "./app-shell/app-shell";
import { useState } from "react";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import useRouter from "./hooks/useRouter";
import { AuthProvider } from "./utils/auth";

export default function App() {
  const [Route, routeParams] = useRouter();
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <MantineProvider
      theme={{
        colorScheme: colorScheme,
        primaryColor: "bright-pink",
        colors: {
          "bright-pink": [
            "#F0BBDD",
            "#ED9BCF",
            "#EC7CC3",
            "#ED5DB8",
            "#F13EAF",
            "#F71FA7",
            "#FF00A1",
            "#E00890",
            "#C50E82",
            "#AD1374",
          ],
        },
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <DatesProvider>
          <AuthProvider>
            <NavHelper>
              <CustomAppShell>
                <Route routeParams={routeParams} />
              </CustomAppShell>
            </NavHelper>
          </AuthProvider>
        </DatesProvider>
      </ColorSchemeProvider>
    </MantineProvider>
  );
}

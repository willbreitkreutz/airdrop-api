import { getNavHelper } from "internal-nav-helper";
// import { useConnect } from "redux-bundler-hook";
import CustomAppShell from "./app-shell/app-shell";
import { useState } from "react";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";

export default function App() {
  // const { route: Route, doUpdateUrl } = useConnect(
  //   "selectRoute",
  //   "doUpdateUrl"
  // );
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
        <div
          onClick={getNavHelper((url) => {
            console.log(url, "implement nav helper here");
          })}
        >
          <CustomAppShell>{/* <Route /> */}</CustomAppShell>
        </div>
      </ColorSchemeProvider>
    </MantineProvider>
  );
}

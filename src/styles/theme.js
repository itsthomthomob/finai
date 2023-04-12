import * as React from "react";
import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#FFA07A", // Light Coral
        },
        secondary: {
            main: "#1E90FF", // Dodger Blue
            light: "#7FFF00", // Chartreuse
            dark: "#A9A9A9", // Dark Gray
        },
        background: {
            default: "#1B1B37", // Dark Blue
        },
        text: {
            primary: "#FDEDEF",
            secondary: "#E6E6E6",
        },
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
    typography: {
        logo: {
            fontSize: "48px",
        },
        logoSubheader: {
            fontSize: "32px",
        },
        subheader: {
            fontSize: "18px",
            fontWeight: "bold",
            letterSpacing: 2
        },
    },
});
export default theme;

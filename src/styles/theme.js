import * as React from "react";
import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
          main: "#FFA07A",
        },
        background: {
          default: "#1B1B37",
        },
        text: {
          primary: "#FDEDEF",
          secondary: "#E6E6E6",
        },
      },
    typography: {
        logo: {
            fontSize: "48px",
        },
        logoSubheader: {
            fontSize: "32px",
        },
        subheader: {
            fontSize: "28px",
        }
    }
});
export default theme;

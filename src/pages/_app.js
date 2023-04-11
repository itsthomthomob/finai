import "@/styles/globals.css";

import { ThemeProvider } from "@emotion/react";
import theme from "../styles/theme";
import CssBaseline from "@mui/material/CssBaseline";

export default function App({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

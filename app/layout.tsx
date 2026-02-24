import type { Metadata } from "next";
import {
  MantineProvider,
  ColorSchemeScript,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";

const theme = createTheme({
  primaryColor: "violet",
  defaultRadius: "md",
});

export const metadata: Metadata = {
  title: "CRM Nilis",
  description: "Sistema de gestión de clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}

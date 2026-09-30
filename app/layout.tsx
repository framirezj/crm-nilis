import type { Metadata, Viewport } from "next";
import {
  MantineProvider,
  ColorSchemeScript,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./globals.css";

const theme = createTheme({
  primaryColor: "violet",
  defaultRadius: "md",
});

export const metadata: Metadata = {
  title: "CRM Nilis",
  description: "Sistema de gestión de clientes",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // No ponemos maximumScale: 1 para no romper accesibilidad (usuarios pueden
  // hacer zoom manual con gesture de pinch), solo evitamos el auto-zoom en inputs.
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
          <ModalsProvider>
            <Notifications position="top-right" />
            {children}
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

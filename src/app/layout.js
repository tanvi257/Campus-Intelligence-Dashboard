import "./globals.css";

export const metadata = {
  title: "Campus Intelligence - Unified Student & Academic Dashboard",
  description: "A centralized dashboard powered by real-time Model Context Protocol (MCP) microservices and AI, providing campus news, library status, cafeteria crowds, events, and academic calendars.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}

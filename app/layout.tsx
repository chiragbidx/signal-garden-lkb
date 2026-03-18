import "@/app/globals.css";
import "@/app/shadcn.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ErrorReporter } from "@/components/ErrorReporter";

export const metadata = {
  title: "PulseCRM — Team-First CRM Platform",
  description:
    "PulseCRM empowers your teams to manage contacts, organizations, deals, and client activities with clarity and speed. Modern CRM for internal teams.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PulseCRM — Team-First CRM Platform",
    description:
      "PulseCRM empowers your teams to manage contacts, organizations, deals, and client activities with clarity and speed. Modern CRM for internal teams.",
    type: "website",
    url: "https://your-pulsecrm-domain.com",
    images: [
      {
        url: "/hero-image-light.jpeg",
        width: 1200,
        height: 630,
        alt: "PulseCRM Hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@chiragdodiya",
    title: "PulseCRM — Team-First CRM Platform",
    description:
      "PulseCRM empowers your teams to manage contacts, organizations, deals, and client activities with clarity and speed. Modern CRM for internal teams.",
    image: "/hero-image-light.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          <ErrorReporter />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
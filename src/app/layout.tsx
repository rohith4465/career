import "./globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Chatbot } from "./components/Chatbot";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Mithra Resumes - Free Open-source Resume Builder and Parser",
  description:
    "Mithra Resumes is a free, open-source, and powerful resume builder that allows anyone to create a modern professional resume in 3 simple steps. For those who have an existing resume, Mithra Resumes also provides a resume parser to help test and confirm its ATS readability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TopNavBar />
          {children}
          <Analytics />
          {/* MithraBot Chatbot at bottom of every page */}
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}

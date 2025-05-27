import type React from "react"
import type { Metadata } from "next"
import { Archivo } from "next/font/google"
import { ThemeProvider } from "./components/theme-provider"
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Header } from "./components/header"
import './globals.css'


export const metadata: Metadata = {
  title: "Find your tempo",
  description: "A collection of functional drinks from Estonian grocery stores. Find your tempo.",
}

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={archivo.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}

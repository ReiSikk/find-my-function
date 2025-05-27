import type React from "react"
import type { Metadata } from "next"
import { Archivo } from "next/font/google"
import { ThemeProvider } from "./components/theme-provider"
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Header } from "./components/header"
import './globals.css'
import { SidebarProvider } from "@/components/ui/sidebar"


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
      <body className={`${archivo.className} bg-(--color-bg)`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SidebarProvider>
        <Header />
          {children}
      </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}

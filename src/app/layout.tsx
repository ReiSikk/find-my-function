import type React from "react"
import type { Metadata } from "next"
import { Archivo } from "next/font/google"
import { ThemeProvider } from "./components/theme-provider"
import './globals.css'


export const metadata: Metadata = {
  title: "Estonian Functional Drinks",
  description: "A collection of functional drinks from Estonian grocery stores",
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
    <html lang="en" suppressHydrationWarning>
      <body className={archivo.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

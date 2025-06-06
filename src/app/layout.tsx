import type React from "react"
import type { Metadata } from "next"
import { Archivo } from "next/font/google"
import { Header } from "./components/header"
import './globals.css'
import { SidebarProvider } from "@/components/ui/sidebar"
import SiteFooter from "./components/site-footer"
import { Providers } from "../lib/context/Providers"
import { Toaster } from "@/components/ui/sonner"


export const metadata: Metadata = {
  title: "Fuel Your Tempo",
  description: "A collection of functional drinks from Estonian grocery stores. Fuel your tempo.",
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
      <body className={`${archivo.className} bg-(--color-bg)`}>
        <Providers>
          <SidebarProvider>
          <Header />
            {children}
          <SiteFooter />
          </SidebarProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

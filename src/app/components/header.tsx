import Link from "next/link"
import { ModeToggle } from "../components/mode-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-[var(--fs-h1)] font-semibold">
          Find your tempo
        </Link>
        <ModeToggle />
      </div>
    </header>
  )
}

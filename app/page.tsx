import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroSection from "./components/HeroSection"
import FeaturesSection from "./components/Features"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-white font-bold text-xl">ImageMagic</h1>
          <div className="space-x-4">
            <Link href="#features" className="text-white/80 hover:text-white">
              Features
            </Link>
            <Link href={"/sign-in"}>
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Client Component for animations) */}
      <HeroSection />
      <FeaturesSection/>
    </div>
  )
}

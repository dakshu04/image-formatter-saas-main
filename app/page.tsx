import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import HeroSection from "./components/HeroSection"

export const metadata = {
  title: "ImageMagic | AI Image Editing",
  description:
    "Transform your images with AI-powered editing tools. Enhance, create, and edit visuals like never before with ImageMagic.",
  openGraph: {
    title: "ImageMagic | AI Image Editing",
    description:
      "AI tools to edit, enhance, and create stunning visuals effortlessly.",
    url: "https://yourdomain.com",
    siteName: "ImageMagic",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ImageMagic - AI Image Editing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageMagic | AI Image Editing",
    description:
      "Edit, enhance, and create stunning visuals with AI-powered tools.",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
}

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
            <Link href="#pricing" className="text-white/80 hover:text-white">
              Pricing
            </Link>
            <Link href={"/sign-in"}>
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Client Component for animations) */}
      <HeroSection />
    </div>
  )
}

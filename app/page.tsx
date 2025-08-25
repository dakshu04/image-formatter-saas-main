"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Star,
  Users,
  Shield,
  CheckCircle,
  Play,
  Quote,
  Sparkles,
  Globe,
  Layers,
  Wand2,
  Rocket,
} from "lucide-react"
import { motion, Variants, Transition } from "framer-motion"
import { useState, useEffect, useCallback } from "react"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as Transition["ease"],
    },
  },
}

const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as Transition["ease"],
    },
  },
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const updateMousePosition = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => {
    let animationFrame: number

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => updateMousePosition(e))
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [updateMousePosition])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
        transition={{ type: "tween", ease: "backOut" as Transition["ease"], duration: 0.15 }}
      />

      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-40"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-white font-bold text-xl">ImageMagic</h1>
          <div className="space-x-4">
            <Link href="#features" className="text-white/80 hover:text-white">Features</Link>
            <Link href="#pricing" className="text-white/80 hover:text-white">Pricing</Link>
            <Link href={"/sign-in"}>
            <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants}>
            <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Image Magic
            </Badge>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-bold text-white mb-6"
          >
            Transform Your Images Like Never Before
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg text-white/70 mb-8 max-w-2xl mx-auto"
          >
            Experience next-level AI tools to edit, enhance, and create stunning visuals effortlessly.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center space-x-4">
            <Link href={"/sign-up"} className="flex items-center text-white/90 hover:text-white">
            <Button size="lg">Get Started</Button>
            </Link>
            <Button size="lg" variant="outline">Learn More</Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-xl"
        />
      </section>
    </div>
  )
}
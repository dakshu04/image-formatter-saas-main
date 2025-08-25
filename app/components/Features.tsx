"use client"

import { motion } from "framer-motion"
import { Image, Scissors } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Smart Social Resizer",
    description:
      "Instantly resize your images to perfectly fit Instagram, Facebook, Twitter, and LinkedIn with one click.",
    icon: <Image className="w-6 h-6 text-cyan-400" />,
  },
  {
    title: "AI Background Remover",
    description:
      "Remove backgrounds effortlessly with AI-powered precision and generate stunning transparent images.",
    icon: <Scissors className="w-6 h-6 text-purple-400" />,
  },
]

export default function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20" id="features">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Powerful Features
        </h2>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Unlock the full potential of your images with AI tools designed for
          creators, marketers, and designers.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
              <CardHeader className="flex flex-row items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
                  {feature.icon}
                </div>
                <CardTitle className="text-white text-xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

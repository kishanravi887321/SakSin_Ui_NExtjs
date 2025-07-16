"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Brain, Camera, BarChart3, Sparkles, Star, Shield, Zap, Target } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"

const companies = [
  { name: "Google", logo: "🔍" },
  { name: "Meta", logo: "📘" },
  { name: "Apple", logo: "🍎" },
  { name: "Microsoft", logo: "🪟" },
  { name: "Amazon", logo: "📦" },
  { name: "Netflix", logo: "🎬" },
  { name: "Tesla", logo: "⚡" },
  { name: "Spotify", logo: "🎵" },
]

const features = [
  {
    icon: Brain,
    title: "AI-Powered Questions",
    description:
      "Advanced LLM generates contextual, role-specific interview questions tailored to your experience level",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Camera,
    title: "Real-time Emotion Analysis",
    description: "Computer vision tracks micro-expressions and body language to provide confidence insights",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Comprehensive metrics including speech patterns, response time, and improvement tracking",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Industry Standards",
    description: "Questions based on real interview patterns from Fortune 500 companies and top startups",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get immediate, actionable feedback powered by advanced natural language processing",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Target,
    title: "Personalized Learning",
    description: "Adaptive learning paths that evolve based on your performance and career goals",
    color: "from-violet-500 to-purple-500",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Software Engineer at Google",
    content:
      "SakSin AI helped me transition from mid-level to senior. The AI feedback was incredibly detailed and actionable.",
    rating: 5,
    avatar: "👩‍💻",
    company: "Google",
  },
  {
    name: "Michael Rodriguez",
    role: "Product Manager at Meta",
    content: "The emotion tracking feature gave me insights I never knew I needed. Landed my dream PM role!",
    rating: 5,
    avatar: "👨‍💼",
    company: "Meta",
  },
  {
    name: "Emily Johnson",
    role: "Data Scientist at Amazon",
    content: "Best interview prep platform I've used. The analytics dashboard is incredibly comprehensive.",
    rating: 5,
    avatar: "👩‍🔬",
    company: "Amazon",
  },
]

const stats = [
  { label: "Success Rate", value: "94%", description: "Users land their target role" },
  { label: "Practice Sessions", value: "50K+", description: "Completed this month" },
  { label: "Companies", value: "500+", description: "Interview patterns analyzed" },
  { label: "User Rating", value: "4.9/5", description: "Average user satisfaction" },
]

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              className="inline-block mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-6 py-2">
                <span className="text-emerald-400 font-semibold">🚀 Trusted by 10,000+ professionals</span>
              </div>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              Master Your Next
              <br />
              <span className="text-emerald-400">AI Interview</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Practice with AI-powered questions, get real-time emotion tracking, and receive personalized feedback to
              land your dream job at top tech companies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group"
              >
                <motion.span
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(16, 185, 129, 0.7)",
                      "0 0 0 10px rgba(16, 185, 129, 0)",
                      "0 0 0 0 rgba(16, 185, 129, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="flex items-center space-x-3"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-500/50 text-slate-300 hover:bg-slate-800/50 px-12 py-6 text-xl rounded-2xl bg-transparent backdrop-blur-sm"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-slate-400">{stat.description}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Showcase */}
      <section className="py-16 px-6 bg-slate-800/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <motion.h2
            className="text-center text-2xl text-slate-300 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Trusted by candidates interviewing at
          </motion.h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-4xl">{company.logo}</span>
                <span className="text-xl font-semibold">{company.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">Why Choose SakSin AI?</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with proven interview techniques to give you the
              competitive edge
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl hover:bg-slate-800/70 transition-all duration-300 group h-full">
                  <CardContent className="p-8 text-center h-full flex flex-col">
                    <motion.div
                      className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed flex-grow">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-slate-800/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">Success Stories</h2>
            <p className="text-xl text-slate-300">See what our users have to say</p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardContent className="p-12 text-center">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-2xl text-slate-300 mb-8 italic leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <h4 className="text-white font-semibold text-xl">{testimonials[currentTestimonial].name}</h4>
                      <p className="text-emerald-400 text-lg">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? "bg-emerald-400 scale-125" : "bg-slate-600 hover:bg-slate-500"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl font-bold text-white mb-6">Ready to Ace Your Interview?</h2>
            <p className="text-xl text-slate-300 mb-12">
              Join thousands of successful candidates who used SakSin AI to land their dream jobs at top companies
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-500/50 text-slate-300 hover:bg-slate-800/50 px-12 py-6 text-xl rounded-2xl bg-transparent backdrop-blur-sm"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-slate-900 border-t border-slate-700/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  SakSin AI
                </span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Empowering professionals to ace their interviews with AI-powered practice and personalized feedback.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  📧
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  🐦
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  💼
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">Features</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
                <li className="hover:text-white transition-colors cursor-pointer">API</li>
                <li className="hover:text-white transition-colors cursor-pointer">Integrations</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">About</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center">
            <p className="text-slate-400">© 2024 SakSin AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

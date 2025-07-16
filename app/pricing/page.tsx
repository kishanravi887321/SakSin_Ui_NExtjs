"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Star, Zap, Crown, Sparkles } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { useState } from "react"

const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with AI interview prep",
    badge: null,
    color: "from-slate-500 to-slate-600",
    features: [
      { name: "5 practice sessions per month", included: true },
      { name: "Basic AI feedback", included: true },
      { name: "3 interview roles", included: true },
      { name: "Email support", included: true },
      { name: "Basic performance analytics", included: true },
      { name: "Advanced AI insights", included: false },
      { name: "Unlimited practice sessions", included: false },
      { name: "Priority support", included: false },
      { name: "Custom interview scenarios", included: false },
      { name: "Team collaboration", included: false },
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    description: "Ideal for serious job seekers and career changers",
    badge: "Most Popular",
    color: "from-emerald-500 to-blue-500",
    features: [
      { name: "Unlimited practice sessions", included: true },
      { name: "Advanced AI feedback & insights", included: true },
      { name: "All interview roles & scenarios", included: true },
      { name: "Priority email & chat support", included: true },
      { name: "Detailed performance analytics", included: true },
      { name: "Custom interview scenarios", included: true },
      { name: "Resume analysis & tips", included: true },
      { name: "Interview scheduling assistant", included: true },
      { name: "Team collaboration", included: false },
      { name: "White-label solution", included: false },
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "Perfect for teams, companies, and educational institutions",
    badge: "Best Value",
    color: "from-purple-500 to-pink-500",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Team collaboration & management", included: true },
      { name: "Custom branding & white-label", included: true },
      { name: "Advanced team analytics", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom integrations & API", included: true },
      { name: "SSO & enterprise security", included: true },
      { name: "Custom interview templates", included: true },
      { name: "Bulk user management", included: true },
      { name: "24/7 phone support", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

const faqs = [
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Yes, we offer a 14-day free trial for both Pro and Enterprise plans. No credit card required to start.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.",
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes! Students get 50% off Pro plans with a valid student email address. Contact support for verification.",
  },
  {
    question: "Can I get a refund?",
    answer: "We offer a 30-day money-back guarantee for all paid plans. No questions asked.",
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-6 py-16">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Start free and upgrade as you grow. All plans include our core AI interview features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg ${billingCycle === "monthly" ? "text-white" : "text-slate-400"}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                billingCycle === "yearly" ? "bg-emerald-500" : "bg-slate-600"
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: billingCycle === "yearly" ? 32 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-lg ${billingCycle === "yearly" ? "text-white" : "text-slate-400"}`}>
              Yearly
              <Badge className="ml-2 bg-emerald-500 text-white">Save 20%</Badge>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-1 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full ${
                  plan.popular
                    ? "bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-emerald-500/30 border-2"
                    : "bg-slate-800/50 border-slate-700/50"
                } backdrop-blur-sm rounded-2xl relative overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5" />
                )}

                <CardHeader className="text-center pb-8 relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    {plan.id === "free" && <Sparkles className="w-8 h-8 text-slate-400" />}
                    {plan.id === "pro" && <Zap className="w-8 h-8 text-emerald-400" />}
                    {plan.id === "enterprise" && <Crown className="w-8 h-8 text-purple-400" />}
                  </div>

                  <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                  <p className="text-slate-400 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-white">
                        ${billingCycle === "yearly" && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-slate-400 ml-2">
                          /{billingCycle === "yearly" ? "month" : plan.period}
                        </span>
                      )}
                    </div>
                    {billingCycle === "yearly" && plan.price > 0 && (
                      <p className="text-emerald-400 text-sm mt-2">
                        Billed annually (${Math.round(plan.price * 0.8 * 12)}/year)
                      </p>
                    )}
                  </div>

                  <Button
                    className={`w-full h-12 rounded-xl font-semibold ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
                        : "bg-slate-700 hover:bg-slate-600 text-white"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardHeader>

                <CardContent className="relative z-10">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                      >
                        {feature.included ? (
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-slate-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? "text-slate-300" : "text-slate-500"}`}>
                          {feature.name}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full text-left p-6 hover:bg-slate-700/30 transition-colors rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                      <motion.div animate={{ rotate: expandedFaq === index ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to ace your next interview?</h2>
          <p className="text-slate-300 mb-8">Join thousands of successful candidates who used SakSin AI</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-slate-500/50 text-slate-300 hover:bg-slate-800/50 px-8 py-3 rounded-xl text-lg bg-transparent"
            >
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

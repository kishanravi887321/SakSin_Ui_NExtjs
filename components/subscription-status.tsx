"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Zap, Sparkles, Calendar, CreditCard, ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface SubscriptionStatusProps {
  plan?: "free" | "pro" | "enterprise"
  usage?: {
    sessionsUsed: number
    sessionsLimit: number
    period: string
  }
  nextBilling?: string
  showUpgrade?: boolean
}

export function SubscriptionStatus({
  plan = "free",
  usage = { sessionsUsed: 3, sessionsLimit: 5, period: "this month" },
  nextBilling,
  showUpgrade = true,
}: SubscriptionStatusProps) {
  const planConfig = {
    free: {
      name: "Free Plan",
      icon: Sparkles,
      color: "text-slate-400",
      bgColor: "from-slate-500/20 to-slate-600/20",
      borderColor: "border-slate-500/30",
    },
    pro: {
      name: "Pro Plan",
      icon: Zap,
      color: "text-emerald-400",
      bgColor: "from-emerald-500/20 to-blue-500/20",
      borderColor: "border-emerald-500/30",
    },
    enterprise: {
      name: "Enterprise Plan",
      icon: Crown,
      color: "text-purple-400",
      bgColor: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
    },
  }

  const config = planConfig[plan]
  const usagePercentage = (usage.sessionsUsed / usage.sessionsLimit) * 100

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card
        className={`bg-gradient-to-br ${config.bgColor} backdrop-blur-sm border-2 ${config.borderColor} rounded-2xl`}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${config.bgColor} rounded-xl flex items-center justify-center border ${config.borderColor}`}
              >
                <config.icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{config.name}</h3>
                {plan !== "free" && nextBilling && (
                  <p className="text-slate-400 text-sm">Next billing: {nextBilling}</p>
                )}
              </div>
            </div>
            <Badge
              className={`${
                plan === "free"
                  ? "bg-slate-600 text-slate-200"
                  : plan === "pro"
                    ? "bg-emerald-500 text-white"
                    : "bg-purple-500 text-white"
              }`}
            >
              {plan === "free" ? "Free" : plan === "pro" ? "Active" : "Enterprise"}
            </Badge>
          </div>

          {/* Usage for Free Plan */}
          {plan === "free" && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300 font-medium">Practice Sessions</span>
                <span className="text-white font-semibold">
                  {usage.sessionsUsed} / {usage.sessionsLimit} used
                </span>
              </div>
              <Progress value={usagePercentage} className="h-3 mb-2" />
              <p className="text-slate-400 text-sm">
                {usage.sessionsLimit - usage.sessionsUsed} sessions remaining {usage.period}
              </p>
            </div>
          )}

          {/* Pro/Enterprise Features */}
          {plan !== "free" && (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-800/30 rounded-xl">
                  <p className="text-2xl font-bold text-white">∞</p>
                  <p className="text-slate-400 text-sm">Sessions</p>
                </div>
                <div className="text-center p-3 bg-slate-800/30 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-400">24/7</p>
                  <p className="text-slate-400 text-sm">Support</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {showUpgrade && plan === "free" && (
              <Link href="/pricing">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
            )}

            {plan !== "free" && (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Usage
                </Button>
              </div>
            )}

            {plan === "free" && (
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="w-full border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                >
                  View All Plans
                </Button>
              </Link>
            )}
          </div>

          {/* Warning for Free Plan */}
          {plan === "free" && usagePercentage > 80 && (
            <motion.div
              className="mt-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-orange-400 text-sm font-medium">
                ⚠️ You're running low on sessions. Upgrade to Pro for unlimited practice!
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

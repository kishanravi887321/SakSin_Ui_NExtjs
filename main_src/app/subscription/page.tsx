"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Zap,
  Calendar,
  CreditCard,
  Download,
  Settings,
  MoreVertical,
  TrendingUp,
  Users,
  Clock,
  Target,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SubscriptionStatus } from "@/components/subscription-status"
import Link from "next/link"

const usageData = [
  { month: "Jan", sessions: 12, score: 85 },
  { month: "Feb", sessions: 18, score: 88 },
  { month: "Mar", sessions: 24, score: 92 },
  { month: "Apr", sessions: 15, score: 87 },
  { month: "May", sessions: 22, score: 90 },
  { month: "Jun", sessions: 28, score: 94 },
]

const billingHistory = [
  {
    id: 1,
    date: "2024-01-15",
    amount: "$29.00",
    status: "paid",
    plan: "Pro Monthly",
    invoice: "INV-2024-001",
  },
  {
    id: 2,
    date: "2023-12-15",
    amount: "$29.00",
    status: "paid",
    plan: "Pro Monthly",
    invoice: "INV-2023-012",
  },
  {
    id: 3,
    date: "2023-11-15",
    amount: "$29.00",
    status: "paid",
    plan: "Pro Monthly",
    invoice: "INV-2023-011",
  },
]

export default function SubscriptionPage() {
  const currentPlan = "pro" // This would come from your auth/subscription context
  const nextBilling = "February 15, 2024"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Subscription & Billing</h1>
          <p className="text-slate-300 text-lg">Manage your subscription, billing, and usage analytics</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">Current Subscription</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Plan
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-slate-700">
                          Cancel Subscription
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-6 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">Pro Plan</h3>
                        <p className="text-emerald-400">$29/month • Next billing: {nextBilling}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500 text-white">Active</Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                      <Target className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">∞</p>
                      <p className="text-slate-400 text-sm">Practice Sessions</p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                      <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">24/7</p>
                      <p className="text-slate-400 text-sm">Priority Support</p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-xl">
                      <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">Advanced</p>
                      <p className="text-slate-400 text-sm">AI Analytics</p>
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-6">
                    <Link href="/pricing">
                      <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl">
                        Upgrade Plan
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Usage Analytics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-emerald-400" />
                    Usage Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {usageData.map((data, index) => (
                      <motion.div
                        key={data.month}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {data.month}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{data.sessions} sessions</p>
                            <p className="text-slate-400 text-sm">Average score: {data.score}%</p>
                          </div>
                        </div>
                        <div className="w-24">
                          <Progress value={data.score} className="h-2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Billing History */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center">
                    <CreditCard className="w-6 h-6 mr-2 text-emerald-400" />
                    Billing History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {billingHistory.map((bill, index) => (
                      <motion.div
                        key={bill.id}
                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{bill.plan}</p>
                            <p className="text-slate-400 text-sm">{bill.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-white font-semibold">{bill.amount}</p>
                            <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Paid</Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status Widget */}
            <SubscriptionStatus
              plan={currentPlan as "free" | "pro" | "enterprise"}
              nextBilling={nextBilling}
              showUpgrade={false}
            />

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Update Payment Method
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All Invoices
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-slate-600/50 text-slate-300 hover:bg-slate-700/50 bg-transparent rounded-xl"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Change Billing Date
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent rounded-xl"
                  >
                    Cancel Subscription
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-sm border-emerald-500/30 rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Need Help?</h3>
                  <p className="text-slate-300 text-sm mb-4">
                    Our support team is here to help with any billing questions.
                  </p>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

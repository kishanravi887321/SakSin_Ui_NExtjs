"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2,
  Download,
  Rss,
  Send,
  Copy,
  Check
} from "lucide-react"

interface ChatMessage {
  id: string
  type: 'user' | 'bot' | 'system'
  content: string
  timestamp: Date
}

interface ApiKeyResponse {
  api_key: string
  message?: string
  status?: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [activeTab, setActiveTab] = useState<'get' | 'feed'>('get')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [feedInput, setFeedInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [copied, setCopied] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  // Feed specific states
  const [isRefeedMode, setIsRefeedMode] = useState(false)
  const [refeedApiKey, setRefeedApiKey] = useState('')
  const [isApiKeyVerified, setIsApiKeyVerified] = useState(false)
  
  // Get chat specific states
  const [userEmail, setUserEmail] = useState('')
  const [isEmailProvided, setIsEmailProvided] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  
  const chatbotRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize messages when tab changes to get
  useEffect(() => {
    if (activeTab === 'get' && messages.length === 0) {
      setMessages([
        {
          id: '1',
          type: 'bot',
          content: 'Welcome! To get started, please provide the email address of the person you want to inquire about.',
          timestamp: new Date()
        }
      ])
    }
  }, [activeTab, messages.length])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (content: string, type: 'user' | 'bot' | 'system') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const resetGetConversation = () => {
    setUserEmail('')
    setIsEmailProvided(false)
    setChatInput('')
    setIsChatLoading(false)
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'Welcome! To get started, please provide the email address of the person you want to inquire about.',
        timestamp: new Date()
      }
    ])
  }

  const resetFeedConversation = () => {
    setFeedInput('')
    setIsRefeedMode(false)
    setRefeedApiKey('')
    setIsApiKeyVerified(false)
    setApiKey('')
  }

  const handleRefeedMode = () => {
    setIsRefeedMode(true)
    setIsApiKeyVerified(false)
    setRefeedApiKey('')
  }

  const handleApiKeySubmit = () => {
    if (!refeedApiKey.trim()) return
    
    // Simple API key validation (you can enhance this)
    if (refeedApiKey.length < 10) {
      alert('Please enter a valid API key')
      return
    }

    setIsApiKeyVerified(true)
  }

  const handleEmailSubmit = () => {
    if (!userEmail.trim()) return
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userEmail)) {
      addMessage('Please enter a valid email address.', 'system')
      return
    }

    addMessage(userEmail, 'user')
    setIsEmailProvided(true)
    addMessage(`Great! I'm now ready to help you with information about ${userEmail}. What would you like to know?`, 'bot')
  }

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || !isEmailProvided) return

    setIsChatLoading(true)
    addMessage(chatInput, 'user')
    
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/chat/get/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userEmail,
          query: chatInput,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.response || data.answer || data.text || data.message) {
          const responseText = data.response || data.answer || data.text || data.message
          addMessage(responseText, 'bot')
        } else {
          addMessage('I received your message. How else can I help you?', 'bot')
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        addMessage(`Error: ${errorData.message || 'Failed to get response'}`, 'system')
      }
    } catch (error) {
      console.error('Chat error:', error)
      addMessage('Network error: Please check your connection and try again.', 'system')
    } finally {
      setIsChatLoading(false)
      setChatInput('')
    }
  }

  const handleFeedSubmit = async () => {
    if (!feedInput.trim()) return

    setIsLoading(true)
    
    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token')
      
      // Prepare request body based on mode
      const requestBody = isRefeedMode 
        ? {
            content: feedInput,
            api_key: refeedApiKey,
            refeed: true,
            timestamp: new Date().toISOString()
          }
        : {
            content: feedInput,
            timestamp: new Date().toISOString()
          }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/chat/feed/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const data: ApiKeyResponse = await response.json()
        
        if (data.api_key) {
          setApiKey(data.api_key)
          if (isRefeedMode) {
            alert(`Refeed successful! Updated API Key: ${data.api_key}`)
          } else {
            alert(`Feed successful! API Key generated: ${data.api_key}`)
          }
        } else {
          alert(data.message || `${isRefeedMode ? 'Refeed' : 'Feed'} submitted successfully!`)
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        alert(`Error: ${errorData.message || `Failed to submit ${isRefeedMode ? 'refeed' : 'feed'}`}`)
      }
    } catch (error) {
      console.error(`${isRefeedMode ? 'Refeed' : 'Feed'} submission error:`, error)
      alert('Network error: Please check your connection and try again.')
    } finally {
      setIsLoading(false)
      setFeedInput('')
      
      // Reset refeed state after successful submission
      if (isRefeedMode && isApiKeyVerified) {
        setIsRefeedMode(false)
        setRefeedApiKey('')
        setIsApiKeyVerified(false)
      }
    }
  }

  const copyApiKey = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isMaximized) {
      setIsDragging(true)
      const rect = chatbotRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isMaximized) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  const chatbotSize = isMaximized 
    ? 'w-screen h-screen' 
    : isMinimized 
    ? 'w-80 h-12' 
    : 'w-96 h-[500px]'

  const chatbotPosition = isMaximized 
    ? 'fixed inset-0 z-50' 
    : `fixed z-50`

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </motion.div>
      )}

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatbotRef}
            className={`${chatbotPosition} ${chatbotSize} select-none`}
            style={!isMaximized ? { left: position.x, top: position.y } : {}}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="w-full h-full bg-slate-800/95 backdrop-blur-sm border-slate-700 shadow-2xl flex flex-col">
              {/* Header */}
              <CardHeader 
                className="pb-3 cursor-move border-b border-slate-700"
                onMouseDown={handleMouseDown}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                    <span>AI Assistant</span>
                  </CardTitle>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Tab Navigation */}
                {!isMinimized && (
                  <div className="flex space-x-1 mt-3">
                    <Button
                      variant={activeTab === 'get' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab('get')}
                      className={`flex items-center space-x-2 ${
                        activeTab === 'get' 
                          ? 'bg-emerald-500 text-white' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>Get</span>
                    </Button>
                    
                    <Button
                      variant={activeTab === 'feed' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab('feed')}
                      className={`flex items-center space-x-2 ${
                        activeTab === 'feed' 
                          ? 'bg-blue-500 text-white' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      <Rss className="w-4 h-4" />
                      <span>Feed</span>
                    </Button>
                  </div>
                )}
              </CardHeader>

              {!isMinimized && (
                <CardContent className="flex-1 p-4 flex flex-col overflow-hidden">
                  {/* Get Tab Content */}
                  {activeTab === 'get' && (
                    <div className="flex-1 flex flex-col">
                      {/* Reset Button - Show when email is provided */}
                      {isEmailProvided && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-3 flex items-center justify-between p-2 bg-slate-700/30 rounded-lg border border-slate-600"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-slate-300">Chatting about:</span>
                            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                              {userEmail}
                            </Badge>
                          </div>
                          <Button
                            onClick={resetGetConversation}
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white hover:bg-slate-600 p-1"
                            title="Reset conversation to inquire about a different person"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      )}

                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 max-h-[300px] min-h-[200px] scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
                        <div className="space-y-3 p-1">
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  message.type === 'user'
                                    ? 'bg-emerald-500 text-white'
                                    : message.type === 'system'
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                    : 'bg-slate-700 text-slate-200'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>

                      {/* Email Input Section */}
                      {!isEmailProvided && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg"
                        >
                          <h4 className="text-blue-400 font-semibold text-sm mb-2">Enter Email Address</h4>
                          <div className="flex space-x-2">
                            <input
                              type="email"
                              value={userEmail}
                              onChange={(e) => setUserEmail(e.target.value)}
                              placeholder="Enter the email of the person you want to inquire about"
                              className="flex-1 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                              onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
                            />
                            <Button
                              onClick={handleEmailSubmit}
                              disabled={!userEmail.trim()}
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              Submit
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Chat Input Section */}
                      {isEmailProvided && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex space-x-2"
                        >
                          <Textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none min-h-[60px] max-h-[120px]"
                            disabled={isChatLoading}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleChatSubmit()
                              }
                            }}
                          />
                          <Button
                            onClick={handleChatSubmit}
                            disabled={isChatLoading || !chatInput.trim()}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white self-end"
                          >
                            {isChatLoading ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        </motion.div>
                      )}

                      {/* API Key Display */}
                      {apiKey && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-emerald-400 font-semibold text-sm">Generated API Key</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={copyApiKey}
                              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 p-1"
                            >
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                          <code className="text-xs text-emerald-300 break-all bg-slate-900/50 p-2 rounded block">
                            {apiKey}
                          </code>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Feed Tab Content */}
                  {activeTab === 'feed' && (
                    <div className="flex-1 flex flex-col">
                      {/* Feed Header with Refeed Button */}
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold mb-2">
                            {isRefeedMode ? 'Refeed Data' : 'Submit Feed Data'}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {isRefeedMode 
                              ? 'Enter your API key to continue with re-feeding data.' 
                              : 'Send your data to generate an API key for your application.'
                            }
                          </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          {/* Mode Indicator */}
                          <Badge variant="secondary" className={`${isRefeedMode ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {isRefeedMode ? 'Refeed Mode' : 'Feed Mode'}
                          </Badge>
                          
                          {/* Refeed Button */}
                          {!isRefeedMode && (
                            <Button
                              onClick={handleRefeedMode}
                              variant="outline"
                              size="sm"
                              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                            >
                              Refeed
                            </Button>
                          )}

                          {/* Reset Button - Show when in refeed mode */}
                          {isRefeedMode && (
                            <Button
                              onClick={resetFeedConversation}
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-white hover:bg-slate-600"
                              title="Reset to normal feed mode"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Refeed Mode - API Key Input */}
                      {isRefeedMode && !isApiKeyVerified && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg"
                        >
                          <h4 className="text-blue-400 font-semibold text-sm mb-2">Enter API Key</h4>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={refeedApiKey}
                              onChange={(e) => setRefeedApiKey(e.target.value)}
                              placeholder="Enter your API key to continue"
                              className="flex-1 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                              onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
                            />
                            <Button
                              onClick={handleApiKeySubmit}
                              disabled={!refeedApiKey.trim()}
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              Verify
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Feed Data Input - Show when not in refeed mode OR when API key is verified */}
                      {(!isRefeedMode || (isRefeedMode && isApiKeyVerified)) && (
                        <div className="flex-1 flex flex-col">
                          <Textarea
                            value={feedInput}
                            onChange={(e) => setFeedInput(e.target.value)}
                            placeholder="Enter your feed data here..."
                            className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none mb-4"
                            disabled={isLoading}
                          />

                          <Button
                            onClick={handleFeedSubmit}
                            disabled={isLoading || !feedInput.trim()}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                          >
                            {isLoading ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                            ) : (
                              <Send className="w-4 h-4 mr-2" />
                            )}
                            {isLoading ? 'Sending...' : (isRefeedMode ? 'Send Refeed' : 'Send Feed')}
                          </Button>
                        </div>
                      )}

                      {/* API Key Display */}
                      {apiKey && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-slate-300 font-semibold text-sm">
                              {isRefeedMode ? 'Updated API Key' : 'Latest API Key'}
                            </h4>
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                              Generated
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <code className="text-xs text-slate-300 break-all bg-slate-900/50 p-2 rounded flex-1">
                              {apiKey}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={copyApiKey}
                              className="text-slate-400 hover:text-white hover:bg-slate-600 p-2"
                            >
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

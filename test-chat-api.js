// Test script for the /chat/feed/ endpoint
// You can run this in the browser console to test the API

const testChatFeedAPI = async () => {
  try {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token')
    
    if (!token) {
      console.error('❌ No access token found. Please login first.')
      return
    }

    console.log('🚀 Testing /chat/feed/ endpoint...')
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat/feed/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: 'Test feed data from chatbot',
        timestamp: new Date().toISOString()
      })
    })

    console.log('📡 Response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Success! Response data:', data)
      
      if (data.api_key) {
        console.log('🔑 API Key received:', data.api_key)
      }
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      console.error('❌ Error response:', errorData)
    }
  } catch (error) {
    console.error('💥 Network error:', error)
  }
}

// Run the test
// testChatFeedAPI()

console.log('📋 To test the API manually, run: testChatFeedAPI()')

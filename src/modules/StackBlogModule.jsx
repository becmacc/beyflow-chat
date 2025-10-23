import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { getTheme } from '../store/themes'

export default function StackBlogModule() {
  const { themePersona, spectrum } = useStore()
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' })
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showNewPost, setShowNewPost] = useState(false)
  const theme = getTheme(themePersona)

  // Get spectrum values
  const blur = spectrum?.blur ?? 0.3
  const glow = spectrum?.glow ?? 0.3

  useEffect(() => {
    // Check Stack Blog connection
    checkConnection()
    
    // Register with BeyFlow integration
    if (window.BeyFlowIntegration) {
      window.BeyFlowIntegration.registerModule('stackblog', {
        createPost: handleCreatePost,
        getStatus: () => ({ connected: isConnected }),
        refresh: loadPosts
      })
    }

    // Listen for chat messages to auto-create posts
    if (window.BeyFlow) {
      window.BeyFlow.on('chat:message_sent', (data) => {
        if (data.flags?.blogPost) {
          handleAutoPost(data.message, data.response)
        }
      })
    }
  }, [isConnected])

  const checkConnection = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/health')
      if (response.ok) {
        setIsConnected(true)
        loadPosts()
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      setIsConnected(false)
    }
  }

  const loadPosts = async () => {
    if (!isConnected) return
    
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8888/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (postData) => {
    if (!isConnected) return
    
    try {
      const response = await fetch('http://localhost:8888/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })
      
      if (response.ok) {
        const result = await response.json()
        setPosts(prev => [result.post, ...prev])
        
        // Emit event for workflow automation
        if (window.BeyFlow) {
          window.BeyFlow.emit('stackblog:post_created', result.post)
        }
        
        return result
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const handleAutoPost = async (message, response) => {
    const postData = {
      title: `Chat Session - ${new Date().toLocaleDateString()}`,
      content: `
## User Question
${message}

## AI Response
${response}

---
*Auto-generated from BeyFlow chat session*
      `,
      category: 'chat-logs',
      tags: ['auto-generated', 'chat', 'ai']
    }
    
    await handleCreatePost(postData)
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault()
    if (!newPost.title.trim() || !newPost.content.trim()) return
    
    const result = await handleCreatePost({
      ...newPost,
      tags: ['manual', 'blog']
    })
    
    if (result) {
      setNewPost({ title: '', content: '', category: 'general' })
      setShowNewPost(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <motion.div
          className="text-red-400 text-6xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📝
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">Stack Blog Offline</h3>
        <p className="text-gray-400 mb-4">Kirby CMS not running on localhost:8888</p>
        <motion.button
          onClick={checkConnection}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry Connection
        </motion.button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`p-4 border-b ${theme.colors.border}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📝</span>
            <div>
              <h2 className="text-xl font-bold text-white">Stack Blog</h2>
              <p className="text-green-400 text-sm font-mono">CONNECTED</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setShowNewPost(!showNewPost)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showNewPost ? '✕' : '+ New'}
            </motion.button>
            <motion.button
              onClick={loadPosts}
              disabled={loading}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? '⟳' : '↻'}
            </motion.button>
          </div>
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <motion.form
            onSubmit={handleSubmitPost}
            className={`p-4 bg-black/50 border ${theme.colors.border} rounded-lg space-y-3`}
            style={{ backdropFilter: `blur(${8 + blur * 16}px)` }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Post title..."
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-400"
              required
            />
            <select
              value={newPost.category}
              onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 bg-black/50 border border-gray-600 rounded text-white"
            >
              <option value="general">General</option>
              <option value="tech">Technology</option>
              <option value="workflow">Workflow</option>
              <option value="chat-logs">Chat Logs</option>
            </select>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your post content here..."
              rows={4}
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-400 resize-none"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Publish
              </button>
              <button
                type="button"
                onClick={() => setShowNewPost(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </div>

      {/* Posts List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <motion.div
              className="text-blue-400 text-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⟳
            </motion.div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.article
                key={post.id || index}
                className={`p-4 bg-black/30 border ${theme.colors.border} rounded-lg`}
                style={{
                  backdropFilter: `blur(${8 + blur * 16}px)`,
                  boxShadow: glow > 0.5 ? `0 0 ${glow * 20}px rgba(0, 255, 255, ${glow * 0.2})` : 'none'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{post.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span>📅 {post.date || 'Today'}</span>
                      <span>📂 {post.category}</span>
                      {post.tags && (
                        <span>🏷️ {post.tags.join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-gray-300 text-sm leading-relaxed">
                  {post.content.length > 200 
                    ? `${post.content.substring(0, 200)}...`
                    : post.content
                  }
                </div>
                <div className="flex justify-end mt-3">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Read More →
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <span className="text-4xl mb-4 block">📄</span>
            <p>No posts yet</p>
            <p className="text-sm mt-2">Create your first post or enable auto-posting from chat</p>
          </div>
        )}
      </div>
    </div>
  )
}
/**
 * Stack Blog Integration Adapter  
 * Connects Kirby CMS Stack Blog to BeyFlow ecosystem
 */

class StackBlogAdapter {
  constructor(baseUrl = 'http://localhost:8888') {
    this.baseUrl = baseUrl;
    this.isConnected = false;
    this.posts = [];
    this.pages = [];
    this.drafts = [];
    
    this.checkConnection();
  }

  async checkConnection() {
    try {
      // Try to connect to Kirby CMS
      const response = await fetch(`${this.baseUrl}`);
      this.isConnected = response.ok;
      
      if (this.isConnected) {
        this.emit('stackblog:connected', { baseUrl: this.baseUrl });
        console.log('📝 Stack Blog connected');
        await this.loadContent();
      }
    } catch (error) {
      this.isConnected = false;
      console.log('📝 Stack Blog offline - start Kirby server');
    }
  }

  async loadContent() {
    try {
      // Load content from Kirby API (if available)
      // For now, we'll simulate the structure
      this.emit('stackblog:content_loaded', {
        posts: this.posts.length,
        pages: this.pages.length,
        drafts: this.drafts.length
      });
    } catch (error) {
      console.error('Failed to load blog content:', error);
    }
  }

  // Content creation methods
  async createPost(data) {
    const { title, content, category = 'general', tags = [], publish = false } = data;
    
    const post = {
      id: Date.now(),
      title,
      content,
      category,
      tags,
      status: publish ? 'published' : 'draft',
      created: new Date().toISOString(),
      slug: this.createSlug(title)
    };

    if (publish) {
      this.posts.push(post);
      this.emit('stackblog:post_published', post);
    } else {
      this.drafts.push(post);
      this.emit('stackblog:draft_created', post);
    }

    return post;
  }

  async updatePost(id, updates) {
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex !== -1) {
      this.posts[postIndex] = { ...this.posts[postIndex], ...updates };
      this.emit('stackblog:post_updated', this.posts[postIndex]);
      return this.posts[postIndex];
    }
    
    const draftIndex = this.drafts.findIndex(d => d.id === id);
    if (draftIndex !== -1) {
      this.drafts[draftIndex] = { ...this.drafts[draftIndex], ...updates };
      this.emit('stackblog:draft_updated', this.drafts[draftIndex]);
      return this.drafts[draftIndex];
    }
    
    return null;
  }

  async publishDraft(id) {
    const draftIndex = this.drafts.findIndex(d => d.id === id);
    if (draftIndex !== -1) {
      const draft = this.drafts.splice(draftIndex, 1)[0];
      draft.status = 'published';
      draft.published = new Date().toISOString();
      
      this.posts.push(draft);
      this.emit('stackblog:post_published', draft);
      return draft;
    }
    return null;
  }

  async deletePost(id) {
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex !== -1) {
      const post = this.posts.splice(postIndex, 1)[0];
      this.emit('stackblog:post_deleted', post);
      return true;
    }
    return false;
  }

  // Chat integration methods
  handleChatCommand(message) {
    const text = message.toLowerCase();
    
    if (text.includes('blog') || text.includes('post')) {
      if (text.includes('create') || text.includes('write')) {
        return this.handleCreatePostRequest(message);
      }
      
      if (text.includes('publish')) {
        return this.handlePublishRequest(message);
      }
      
      if (text.includes('latest') || text.includes('recent')) {
        return this.getLatestPosts();
      }
      
      if (text.includes('draft')) {
        return this.getDrafts();
      }
    }
    
    return null;
  }

  handleCreatePostRequest(message) {
    // Extract title and content from chat message
    const titleMatch = message.match(/(?:title|called?|named?)[:\s]+"([^"]+)"/i);
    const contentMatch = message.match(/(?:content|about|write)[:\s]+"([^"]+)"/i);
    
    const title = titleMatch ? titleMatch[1] : `Chat Post ${Date.now()}`;
    const content = contentMatch ? contentMatch[1] : message;
    
    return this.createPostFromChat(title, content);
  }

  async createPostFromChat(title, content) {
    const post = await this.createPost({
      title,
      content,
      category: 'chat-generated',
      tags: ['chat', 'auto-generated'],
      publish: false // Start as draft
    });
    
    this.emit('stackblog:chat_post_created', {
      post,
      source: 'chat'
    });
    
    return {
      action: 'post_created',
      title: post.title,
      id: post.id,
      status: post.status,
      message: `Created draft post: "${title}"`
    };
  }

  handlePublishRequest(message) {
    // Look for draft to publish
    if (this.drafts.length === 0) {
      return { message: 'No drafts available to publish' };
    }
    
    // Extract draft identifier or publish latest
    const latest = this.drafts[this.drafts.length - 1];
    return this.publishDraft(latest.id).then(post => ({
      action: 'post_published',
      title: post.title,
      url: `${this.baseUrl}/${post.slug}`,
      message: `Published: "${post.title}"`
    }));
  }

  getLatestPosts(limit = 5) {
    return this.posts
      .slice(-limit)
      .reverse()
      .map(post => ({
        title: post.title,
        category: post.category,
        created: post.created,
        url: `${this.baseUrl}/${post.slug}`,
        excerpt: post.content.substring(0, 100) + '...'
      }));
  }

  getDrafts() {
    return this.drafts.map(draft => ({
      title: draft.title,
      created: draft.created,
      category: draft.category,
      preview: draft.content.substring(0, 100) + '...',
      action: () => this.publishDraft(draft.id)
    }));
  }

  // AI integration methods
  async processAIContent(aiData) {
    const { type, content, suggestions } = aiData;
    
    switch (type) {
      case 'blog_suggestion':
        return this.handleBlogSuggestion(suggestions);
      case 'content_enhancement':
        return this.enhanceContent(content);
      case 'auto_post':
        return this.createAutoPost(content);
      default:
        return null;
    }
  }

  async handleBlogSuggestion(suggestions) {
    const posts = [];
    
    for (const suggestion of suggestions.slice(0, 3)) { // Limit to 3
      const post = await this.createPost({
        title: suggestion.title,
        content: suggestion.content,
        category: 'ai-suggested',
        tags: ['ai', 'suggested', ...suggestion.tags],
        publish: false
      });
      posts.push(post);
    }
    
    this.emit('stackblog:ai_suggestions_created', { count: posts.length, posts });
    return posts;
  }

  async enhanceContent(content) {
    // Find matching draft or post to enhance
    const target = this.drafts.find(d => d.content.includes(content.substring(0, 50))) ||
                   this.posts.find(p => p.content.includes(content.substring(0, 50)));
    
    if (target) {
      const enhanced = {
        ...target,
        content: content,
        enhanced: true,
        enhancedAt: new Date().toISOString()
      };
      
      await this.updatePost(target.id, enhanced);
      return enhanced;
    }
    
    return null;
  }

  async createAutoPost(content) {
    const title = this.extractTitleFromContent(content);
    
    const post = await this.createPost({
      title,
      content,
      category: 'auto-generated',
      tags: ['auto', 'ai-generated'],
      publish: true // Auto-publish AI content
    });
    
    return post;
  }

  // Workflow automation support
  async executeWorkflow(workflowType, data) {
    switch (workflowType) {
      case 'chat_to_blog':
        return this.chatToBlogWorkflow(data);
      case 'scheduled_publish':
        return this.scheduledPublishWorkflow(data);
      case 'content_series':
        return this.contentSeriesWorkflow(data);
      default:
        return { error: 'Unknown workflow' };
    }
  }

  async chatToBlogWorkflow(data) {
    const { messages, category = 'chat-logs' } = data;
    
    const content = messages.map(msg => 
      `**${msg.user}**: ${msg.message}`
    ).join('\n\n');
    
    const title = `Chat Session - ${new Date().toLocaleDateString()}`;
    
    const post = await this.createPost({
      title,
      content,
      category,
      tags: ['chat', 'session', 'auto-generated'],
      publish: false
    });
    
    return {
      created: true,
      post: post,
      messageCount: messages.length
    };
  }

  async scheduledPublishWorkflow(data) {
    const { publishTime } = data;
    
    // Simple implementation - publish all drafts
    const published = [];
    
    for (const draft of this.drafts.slice()) {
      const post = await this.publishDraft(draft.id);
      if (post) published.push(post);
    }
    
    return {
      published: published.length,
      posts: published
    };
  }

  async contentSeriesWorkflow(data) {
    const { seriesTitle, topics, category = 'series' } = data;
    
    const posts = [];
    
    for (const [index, topic] of topics.entries()) {
      const post = await this.createPost({
        title: `${seriesTitle} - Part ${index + 1}: ${topic.title}`,
        content: topic.content || `Content for ${topic.title}`,
        category,
        tags: ['series', seriesTitle.toLowerCase().replace(/\s+/g, '-'), ...topic.tags],
        publish: false
      });
      posts.push(post);
    }
    
    return {
      created: posts.length,
      series: seriesTitle,
      posts: posts
    };
  }

  // Utility methods
  createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  extractTitleFromContent(content) {
    // Try to extract a title from content
    const lines = content.split('\n');
    const firstLine = lines[0].trim();
    
    if (firstLine.length > 0 && firstLine.length < 100) {
      return firstLine.replace(/^#+\s*/, ''); // Remove markdown headers
    }
    
    return `Auto Post ${Date.now()}`;
  }

  getStatus() {
    return {
      connected: this.isConnected,
      baseUrl: this.baseUrl,
      posts: this.posts.length,
      drafts: this.drafts.length,
      lastUpdate: new Date().toISOString()
    };
  }

  // Search and content discovery
  searchPosts(query) {
    const searchTerm = query.toLowerCase();
    
    return this.posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  getPostsByCategory(category) {
    return this.posts.filter(post => post.category === category);
  }

  getPostsByTag(tag) {
    return this.posts.filter(post => post.tags.includes(tag));
  }
}

export default StackBlogAdapter;
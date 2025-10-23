/**
 * BeyTV Integration Adapter
 * Connects Python BeyTV server to BeyFlow ecosystem
 */

class BeyTVAdapter {
  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
    this.isConnected = false;
    this.downloads = new Map();
    this.rssFeeds = [];
    
    this.checkConnection();
    this.startStatusPolling();
  }

  async checkConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/api/qbt-status`);
      this.isConnected = response.ok;
      
      if (this.isConnected) {
        this.emit('beytv:connected', { baseUrl: this.baseUrl });
        console.log('📺 BeyTV connected');
      }
    } catch (error) {
      this.isConnected = false;
      console.log('📺 BeyTV offline - start Python server');
    }
  }

  startStatusPolling() {
    setInterval(() => {
      if (this.isConnected) {
        this.updateStatus();
        this.checkDownloads();
      } else {
        this.checkConnection();
      }
    }, 10000);
  }

  async updateStatus() {
    try {
      const [statusRes, torrentRes, queueRes] = await Promise.all([
        fetch(`${this.baseUrl}/api/qbt-status`),
        fetch(`${this.baseUrl}/api/qbt-torrents`),
        fetch(`${this.baseUrl}/api/queue`)
      ]);

      const status = await statusRes.json();
      const torrents = await torrentRes.json();
      const queue = await queueRes.json();

      this.emit('beytv:status_update', {
        qbittorrent: status,
        active_torrents: torrents,
        download_queue: queue
      });

    } catch (error) {
      console.error('BeyTV status update failed:', error);
    }
  }

  async checkDownloads() {
    try {
      const response = await fetch(`${this.baseUrl}/api/qbt-torrents`);
      const torrents = await response.json();
      
      torrents.forEach(torrent => {
        const prevProgress = this.downloads.get(torrent.hash)?.progress || 0;
        
        if (torrent.progress === 1 && prevProgress < 1) {
          this.emit('beytv:download_complete', {
            title: torrent.name,
            hash: torrent.hash,
            size: torrent.size,
            path: torrent.save_path
          });
        }
        
        this.downloads.set(torrent.hash, torrent);
      });
      
    } catch (error) {
      console.error('Download check failed:', error);
    }
  }

  // Methods for BeyFlow integration
  async searchMedia(query) {
    if (!this.isConnected) return [];
    
    try {
      const response = await fetch(`${this.baseUrl}/api/search?q=${encodeURIComponent(query)}`);
      return await response.json();
    } catch (error) {
      console.error('BeyTV search failed:', error);
      return [];
    }
  }

  async addDownload(magnetUrl, title) {
    if (!this.isConnected) return false;
    
    try {
      const response = await fetch(`${this.baseUrl}/api/add-torrent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: magnetUrl, title })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        this.emit('beytv:download_started', { title, magnetUrl });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Add download failed:', error);
      return false;
    }
  }

  async queueForPlex(magnetUrl, title) {
    if (!this.isConnected) return false;
    
    try {
      const response = await fetch(`${this.baseUrl}/api/queue-download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Date.now(),
          title,
          url: magnetUrl
        })
      });
      
      if (response.ok) {
        this.emit('beytv:queued_for_plex', { title, magnetUrl });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Queue for Plex failed:', error);
      return false;
    }
  }

  async getRSSFeeds(feedName = 'all') {
    if (!this.isConnected) return [];
    
    try {
      const url = feedName === 'all' 
        ? `${this.baseUrl}/api/feeds`
        : `${this.baseUrl}/api/feeds/${feedName}`;
        
      const response = await fetch(url);
      const feeds = await response.json();
      
      this.rssFeeds = feeds;
      return feeds;
    } catch (error) {
      console.error('RSS fetch failed:', error);
      return [];
    }
  }

  async refreshFeeds() {
    if (!this.isConnected) return [];
    
    try {
      const response = await fetch(`${this.baseUrl}/api/feeds/refresh`);
      const result = await response.json();
      
      this.rssFeeds = result.items || [];
      this.emit('beytv:feeds_refreshed', this.rssFeeds);
      
      return this.rssFeeds;
    } catch (error) {
      console.error('Feed refresh failed:', error);
      return [];
    }
  }

  // Chat integration methods
  handleChatCommand(message) {
    const text = message.toLowerCase();
    
    if (text.includes('download') || text.includes('torrent')) {
      const query = text.replace(/download|torrent|get|find/g, '').trim();
      if (query) {
        return this.searchAndSuggest(query);
      }
    }
    
    if (text.includes('status') && text.includes('download')) {
      return this.getDownloadStatus();
    }
    
    if (text.includes('rss') || text.includes('feed')) {
      return this.getLatestFromFeeds();
    }
    
    return null;
  }

  async searchAndSuggest(query) {
    const results = await this.searchMedia(query);
    
    if (results.length > 0) {
      const suggestions = results.slice(0, 3).map(item => ({
        title: item.fileName || item.title,
        size: item.fileSize || item.size,
        seeds: item.nbSeeders || 0,
        action: () => this.addDownload(item.descrLink || item.url, item.fileName || item.title)
      }));
      
      this.emit('beytv:search_suggestions', {
        query,
        suggestions
      });
      
      return suggestions;
    }
    
    return [];
  }

  async getDownloadStatus() {
    if (!this.isConnected) {
      return { status: 'BeyTV offline' };
    }
    
    try {
      const [statusRes, torrentRes] = await Promise.all([
        fetch(`${this.baseUrl}/api/qbt-status`),
        fetch(`${this.baseUrl}/api/qbt-torrents`)
      ]);
      
      const status = await statusRes.json();
      const torrents = await torrentRes.json();
      
      return {
        connected: status.connected,
        active: torrents.length,
        downloading: torrents.filter(t => t.state === 'downloading').length,
        completed: torrents.filter(t => t.progress === 1).length,
        totalDownload: Math.round((status.download_speed || 0) / 1024) + ' KB/s',
        totalUpload: Math.round((status.upload_speed || 0) / 1024) + ' KB/s'
      };
    } catch (error) {
      return { status: 'Error getting status' };
    }
  }

  async getLatestFromFeeds() {
    const feeds = await this.getRSSFeeds('all');
    return feeds.slice(0, 5).map(item => ({
      title: item.title,
      size: item.size,
      source: item.source,
      published: item.published,
      action: () => this.queueForPlex(item.magnet, item.title)
    }));
  }

  // Workflow automation support
  async executeWorkflow(workflowType, data) {
    switch (workflowType) {
      case 'auto_download':
        return this.autoDownloadWorkflow(data);
      case 'rss_monitor':
        return this.rssMonitorWorkflow(data);
      case 'plex_queue':
        return this.plexQueueWorkflow(data);
      default:
        return { error: 'Unknown workflow' };
    }
  }

  async autoDownloadWorkflow(data) {
    const { query, autoQueue } = data;
    
    const results = await this.searchMedia(query);
    if (results.length === 0) return { found: 0 };
    
    const best = results[0]; // Take best result
    
    if (autoQueue) {
      await this.queueForPlex(best.descrLink || best.url, best.fileName || best.title);
    } else {
      await this.addDownload(best.descrLink || best.url, best.fileName || best.title);
    }
    
    return {
      found: results.length,
      downloaded: best.fileName || best.title,
      autoQueued: autoQueue
    };
  }

  async rssMonitorWorkflow(data) {
    const { keywords, autoDownload } = data;
    
    const feeds = await this.refreshFeeds();
    const matches = feeds.filter(item => 
      keywords.some(keyword => 
        item.title.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (autoDownload && matches.length > 0) {
      for (const match of matches.slice(0, 3)) { // Limit to 3
        await this.queueForPlex(match.magnet, match.title);
      }
    }
    
    return {
      checked: feeds.length,
      matches: matches.length,
      autoDownloaded: autoDownload ? Math.min(matches.length, 3) : 0
    };
  }

  async plexQueueWorkflow(data) {
    const { items } = data;
    
    const results = [];
    for (const item of items) {
      const success = await this.queueForPlex(item.url, item.title);
      results.push({ title: item.title, success });
    }
    
    return {
      processed: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };
  }

  getStatus() {
    return {
      connected: this.isConnected,
      baseUrl: this.baseUrl,
      activeDownloads: this.downloads.size,
      rssItems: this.rssFeeds.length
    };
  }
}

export default BeyTVAdapter;
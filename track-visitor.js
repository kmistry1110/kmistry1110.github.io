// Track visitor - sends event to GitHub Actions workflow
(function() {
  // Only track once per visitor per day
  const today = new Date().toISOString().split('T')[0];
  const trackedKey = `visitor_tracked_${today}`;
  
  if (sessionStorage.getItem(trackedKey)) {
    return; // Already tracked today in this session
  }
  
  // Mark as tracked
  sessionStorage.setItem(trackedKey, 'true');
  
  // Trigger GitHub Actions workflow via repository dispatch
  async function trackVisitor() {
    try {
      // Replace with your GitHub token
      const token = 'github_pat_YOUR_TOKEN_HERE';
      const owner = 'kmistry1110';
      const repo = 'kmistry1110.github.io';
      
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/dispatches`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+raw+json',
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'visitor_event',
            client_payload: {
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
            },
          }),
        }
      );
      
      if (!response.ok) {
        console.debug('Visitor tracking: Response status', response.status);
      }
    } catch (error) {
      // Fail silently - don't interrupt user experience
      console.debug('Visitor tracking error:', error.message);
    }
  }
  
  // Track visitor after page load to not impact performance
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackVisitor);
  } else {
    trackVisitor();
  }
})();

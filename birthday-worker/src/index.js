export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // Normalize path to strip "/jasper-8th-birthday"
    if (pathname.startsWith('/jasper-8th-birthday')) {
      pathname = pathname.slice('/jasper-8th-birthday'.length);
    }
    
    // Ensure it starts with /
    if (!pathname.startsWith('/')) {
      pathname = '/' + pathname;
    }
    
    // Fetch from Pages deployment
    const targetUrl = new URL(pathname + url.search, 'https://birthday-party-plan-8th.pages.dev');
    
    // Clone request with target URL
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'manual'
    });
    
    return fetch(modifiedRequest);
  }
};

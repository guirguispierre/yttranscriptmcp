const ENDPOINT_URL = "https://yttranscriptmcp.guirguispierre.workers.dev/mcp";

const SHARED_STYLES = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  @font-face {
    font-family: 'Departure Mono';
    src: url('https://cdn.jsdelivr.net/gh/rougier/departure-mono@master/fonts/DepartureMono-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --bg: #060608;
    --surface: #0e0e12;
    --surface-2: #16161d;
    --border: #1e1e28;
    --border-bright: #2a2a38;
    --text: #c8c8d0;
    --text-dim: #6e6e7a;
    --text-bright: #eaeaf0;
    --green: #39ff14;
    --green-dim: #1a8a0a;
    --green-glow: rgba(57, 255, 20, 0.15);
    --amber: #ffb627;
    --amber-dim: #a67a1a;
    --mono: 'Departure Mono', 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
  }

  html {
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--mono);
    background: var(--bg);
    color: var(--text);
    line-height: 1.7;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255,255,255,0.008) 2px,
      rgba(255,255,255,0.008) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(57,255,20,0.03) 0%, transparent 60%);
    pointer-events: none;
    z-index: 1;
  }

  .wrap {
    max-width: 720px;
    margin: 0 auto;
    padding: 4rem 2rem 6rem;
    position: relative;
    z-index: 2;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--green);
    border: 1px solid var(--green-dim);
    border-radius: 2px;
    padding: 0.3rem 0.7rem;
    background: var(--green-glow);
    margin-bottom: 2rem;
    animation: fadeIn 0.6s ease both;
  }

  .badge .dot {
    width: 6px;
    height: 6px;
    background: var(--green);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
    box-shadow: 0 0 6px var(--green);
  }

  h1 {
    font-size: 2rem;
    font-weight: 400;
    color: var(--text-bright);
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: 1rem;
    animation: fadeIn 0.6s ease 0.1s both;
  }

  h1 .accent {
    color: var(--green);
    text-shadow: 0 0 30px var(--green-glow);
  }

  .subtitle {
    font-size: 0.85rem;
    color: var(--text-dim);
    margin-bottom: 3.5rem;
    animation: fadeIn 0.6s ease 0.2s both;
    max-width: 50ch;
  }

  h2 {
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 1rem;
    margin-top: 3.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }

  .endpoint-block {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 1.2rem 1.4rem;
    margin-bottom: 1.5rem;
    animation: fadeIn 0.6s ease 0.3s both;
  }

  .endpoint-label {
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 0.6rem;
  }

  .endpoint-url {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
  }

  .endpoint-url code {
    font-family: var(--mono);
    font-size: 0.85rem;
    color: var(--green);
    word-break: break-all;
  }

  .copy-btn {
    font-family: var(--mono);
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: var(--surface-2);
    color: var(--text-dim);
    border: 1px solid var(--border-bright);
    border-radius: 2px;
    padding: 0.35rem 0.75rem;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;
  }

  .copy-btn:hover {
    color: var(--text-bright);
    border-color: var(--green-dim);
    background: var(--green-glow);
  }

  .copy-btn.copied {
    color: var(--green);
    border-color: var(--green);
  }

  pre {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 1.2rem 1.4rem;
    overflow-x: auto;
    margin: 0.75rem 0 1.5rem;
    font-size: 0.78rem;
    line-height: 1.8;
    color: var(--text);
  }

  pre code {
    font-family: var(--mono);
  }

  .k { color: var(--amber); }
  .s { color: var(--green); }
  .c { color: var(--text-dim); }
  .p { color: var(--text-dim); }
  .n { color: var(--text); }

  p {
    margin-bottom: 1rem;
    font-size: 0.82rem;
  }

  .tool-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 1.4rem;
    margin: 0.75rem 0 1.5rem;
  }

  .tool-name {
    font-size: 0.9rem;
    color: var(--green);
    margin-bottom: 0.4rem;
  }

  .tool-desc {
    font-size: 0.78rem;
    color: var(--text-dim);
    margin-bottom: 1rem;
  }

  .tool-param {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    font-size: 0.78rem;
    padding: 0.5rem 0;
    border-top: 1px solid var(--border);
  }

  .tool-param-name {
    color: var(--amber);
  }

  .tool-param-type {
    color: var(--text-dim);
    font-size: 0.7rem;
  }

  .tool-param-desc {
    color: var(--text);
  }

  .nav-bar {
    display: flex;
    gap: 2rem;
    margin-bottom: 3rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
    animation: fadeIn 0.6s ease both;
  }

  .nav-bar a {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--text-dim);
    transition: color 0.15s ease;
  }

  .nav-bar a:hover,
  .nav-bar a.active {
    color: var(--text-bright);
  }

  .nav-bar a.active {
    color: var(--green);
  }

  footer {
    margin-top: 5rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
    font-size: 0.7rem;
    color: var(--text-dim);
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  footer a {
    color: var(--text-dim);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  footer a:hover {
    color: var(--text);
  }

  .step {
    display: flex;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .step-num {
    font-size: 0.75rem;
    color: var(--amber);
    flex-shrink: 0;
    width: 1.6rem;
    height: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--amber-dim);
    border-radius: 2px;
    margin-top: 0.1rem;
  }

  .step-content h3 {
    font-size: 0.82rem;
    font-weight: 400;
    color: var(--text-bright);
    margin-bottom: 0.3rem;
  }

  .step-content p {
    font-size: 0.78rem;
    color: var(--text-dim);
    margin-bottom: 0.5rem;
  }

  .tab-group {
    margin: 0.75rem 0 1.5rem;
  }

  .tab-buttons {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--border);
  }

  .tab-btn {
    font-family: var(--mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: none;
    color: var(--text-dim);
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.15s ease;
  }

  .tab-btn:hover {
    color: var(--text);
  }

  .tab-btn.active {
    color: var(--green);
    border-bottom-color: var(--green);
  }

  .tab-panel {
    display: none;
  }

  .tab-panel.active {
    display: block;
  }

  .highlight-box {
    background: var(--green-glow);
    border: 1px solid var(--green-dim);
    border-radius: 3px;
    padding: 1.2rem 1.4rem;
    margin: 1.5rem 0;
  }

  .highlight-box p {
    font-size: 0.78rem;
    color: var(--text);
    margin: 0;
  }

  .highlight-box code {
    color: var(--green);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @media (max-width: 600px) {
    .wrap { padding: 2.5rem 1.2rem 4rem; }
    h1 { font-size: 1.4rem; }
    .endpoint-url { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  }
`;

const COPY_SCRIPT = `
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;
    var target = btn.getAttribute('data-copy');
    var text = '';
    if (target === 'endpoint') {
      text = '${ENDPOINT_URL}';
    } else {
      var container = btn.closest('.tab-panel') || btn.closest('.step-content') || btn.parentElement;
      var pre = container ? container.querySelector('pre') : null;
      if (!pre) pre = btn.previousElementSibling;
      if (pre) text = pre.textContent;
    }
    if (text) {
      navigator.clipboard.writeText(text.trim()).then(function() {
        btn.textContent = 'copied';
        btn.classList.add('copied');
        setTimeout(function() {
          btn.textContent = 'copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    }
  });

  document.querySelectorAll('.tab-group').forEach(function(group) {
    var buttons = group.querySelectorAll('.tab-btn');
    var panels = group.querySelectorAll('.tab-panel');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        buttons.forEach(function(b) { b.classList.remove('active'); });
        panels.forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        var panel = group.querySelector('#' + btn.getAttribute('data-tab'));
        if (panel) panel.classList.add('active');
      });
    });
  });
`;

export function landingPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>YouTube Transcript MCP</title>
  <meta name="description" content="A remote MCP server that extracts full plain-text transcripts from YouTube videos. Connect from Claude, Cursor, or any MCP-compatible client.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#9654;</text></svg>">
  <style>${SHARED_STYLES}</style>
</head>
<body>
  <div class="wrap">

    <nav class="nav-bar">
      <a href="/" class="active">Overview</a>
      <a href="/mcp">Connect</a>
    </nav>

    <div class="badge">
      <span class="dot"></span>
      operational
    </div>

    <h1>YouTube Transcript <span class="accent">MCP</span></h1>
    <p class="subtitle">A remote Model Context Protocol server that extracts full plain-text transcripts from any YouTube video. No API keys. No auth. Just connect and go.</p>

    <div class="endpoint-block">
      <div class="endpoint-label">MCP Endpoint</div>
      <div class="endpoint-url">
        <code>${ENDPOINT_URL}</code>
        <button class="copy-btn" data-copy="endpoint">copy</button>
      </div>
    </div>

    <h2>Available Tool</h2>

    <div class="tool-card">
      <div class="tool-name">get_youtube_transcript</div>
      <div class="tool-desc">Fetch the full plain-text transcript for a YouTube video URL.</div>
      <div class="tool-param">
        <span class="tool-param-name">youtube_url</span>
        <span class="tool-param-type">string (url)</span>
        <span class="tool-param-desc">&mdash; A valid YouTube video URL</span>
      </div>
    </div>

    <p>Supports all standard YouTube URL formats including <code style="color:var(--text-dim);font-size:0.78rem">youtube.com/watch?v=</code>, <code style="color:var(--text-dim);font-size:0.78rem">youtu.be/</code>, <code style="color:var(--text-dim);font-size:0.78rem">/shorts/</code>, <code style="color:var(--text-dim);font-size:0.78rem">/embed/</code>, and <code style="color:var(--text-dim);font-size:0.78rem">/live/</code> paths. Uses a dual-provider fallback strategy for maximum reliability.</p>

    <h2>Quick Setup</h2>

    <div class="tab-group">
      <div class="tab-buttons">
        <button class="tab-btn active" data-tab="tab-claude">Claude Desktop</button>
        <button class="tab-btn" data-tab="tab-cursor">Cursor</button>
        <button class="tab-btn" data-tab="tab-generic">Other Clients</button>
      </div>

      <div class="tab-panel active" id="tab-claude">
        <p style="margin-top:1rem;font-size:0.78rem;color:var(--text-dim)">Add to your <code style="color:var(--text-dim);font-size:0.75rem">claude_desktop_config.json</code>:</p>
<pre><code><span class="p">{</span>
  <span class="k">"mcpServers"</span><span class="p">:</span> <span class="p">{</span>
    <span class="k">"youtube-transcript"</span><span class="p">:</span> <span class="p">{</span>
      <span class="k">"type"</span><span class="p">:</span> <span class="s">"url"</span><span class="p">,</span>
      <span class="k">"url"</span><span class="p">:</span> <span class="s">"${ENDPOINT_URL}"</span>
    <span class="p">}</span>
  <span class="p">}</span>
<span class="p">}</span></code></pre>
        <button class="copy-btn">copy</button>
      </div>

      <div class="tab-panel" id="tab-cursor">
        <p style="margin-top:1rem;font-size:0.78rem;color:var(--text-dim)">In Cursor Settings &rarr; MCP, add a new server:</p>
<pre><code><span class="p">{</span>
  <span class="k">"mcpServers"</span><span class="p">:</span> <span class="p">{</span>
    <span class="k">"youtube-transcript"</span><span class="p">:</span> <span class="p">{</span>
      <span class="k">"url"</span><span class="p">:</span> <span class="s">"${ENDPOINT_URL}"</span>
    <span class="p">}</span>
  <span class="p">}</span>
<span class="p">}</span></code></pre>
        <button class="copy-btn">copy</button>
      </div>

      <div class="tab-panel" id="tab-generic">
        <p style="margin-top:1rem;font-size:0.78rem;color:var(--text-dim)">Point any MCP-compatible client at the endpoint via Streamable HTTP transport:</p>
<pre><code><span class="c">// Endpoint</span>
<span class="n">POST</span> <span class="s">${ENDPOINT_URL}</span>

<span class="c">// Content-Type</span>
<span class="n">application/json</span>

<span class="c">// Protocol</span>
<span class="n">MCP Streamable HTTP (no sessions)</span></code></pre>
        <button class="copy-btn">copy</button>
      </div>
    </div>

    <h2>How It Works</h2>

    <div class="step">
      <div class="step-num">1</div>
      <div class="step-content">
        <h3>Connect your MCP client</h3>
        <p>Add the endpoint URL to your client's configuration. No API keys or authentication required.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-num">2</div>
      <div class="step-content">
        <h3>Send a YouTube URL</h3>
        <p>Ask your AI assistant to fetch a transcript, or invoke the tool directly with any YouTube video URL.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-num">3</div>
      <div class="step-content">
        <h3>Get the full transcript</h3>
        <p>The server extracts the complete plain-text transcript with dual-provider fallback for maximum reliability. No timestamps, just clean text.</p>
      </div>
    </div>

    <h2>Example</h2>

<pre><code><span class="c">// Ask your AI assistant:</span>
<span class="s">"Get me the transcript for https://youtube.com/watch?v=dQw4w9WgXcQ"</span>

<span class="c">// The tool returns the full transcript as plain text.</span>
<span class="c">// No timestamps. No formatting. Just the words.</span></code></pre>

    <footer>
      <a href="/mcp">Connection Guide &rarr;</a>
      <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener">MCP Spec</a>
      <a href="https://github.com/guirguispierre/yttranscriptmcp" target="_blank" rel="noopener">Source</a>
    </footer>

  </div>
  <script>${COPY_SCRIPT}</script>
</body>
</html>`;
}

export function mcpGuideHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Connect &mdash; YouTube Transcript MCP</title>
  <meta name="description" content="How to connect to the YouTube Transcript MCP server from Claude, Cursor, or any MCP-compatible client.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#9654;</text></svg>">
  <style>${SHARED_STYLES}</style>
</head>
<body>
  <div class="wrap">

    <nav class="nav-bar">
      <a href="/">Overview</a>
      <a href="/mcp" class="active">Connect</a>
    </nav>

    <h1>Connect to this <span class="accent">MCP</span> server</h1>
    <p class="subtitle">This endpoint speaks the Model Context Protocol over Streamable HTTP. Point your MCP client here and start extracting YouTube transcripts.</p>

    <div class="endpoint-block">
      <div class="endpoint-label">MCP Endpoint URL</div>
      <div class="endpoint-url">
        <code>${ENDPOINT_URL}</code>
        <button class="copy-btn" data-copy="endpoint">copy</button>
      </div>
    </div>

    <div class="highlight-box">
      <p>This is a <strong>Streamable HTTP</strong> MCP server. It requires <code>POST</code> requests with <code>Content-Type: application/json</code>. No authentication, sessions, or API keys needed.</p>
    </div>

    <h2>Claude Desktop</h2>

    <div class="step">
      <div class="step-num">1</div>
      <div class="step-content">
        <h3>Open your config file</h3>
        <p>macOS: <code style="color:var(--text-dim);font-size:0.75rem">~/Library/Application Support/Claude/claude_desktop_config.json</code></p>
        <p>Windows: <code style="color:var(--text-dim);font-size:0.75rem">%APPDATA%\\Claude\\claude_desktop_config.json</code></p>
      </div>
    </div>

    <div class="step">
      <div class="step-num">2</div>
      <div class="step-content">
        <h3>Add the server entry</h3>
<pre><code><span class="p">{</span>
  <span class="k">"mcpServers"</span><span class="p">:</span> <span class="p">{</span>
    <span class="k">"youtube-transcript"</span><span class="p">:</span> <span class="p">{</span>
      <span class="k">"type"</span><span class="p">:</span> <span class="s">"url"</span><span class="p">,</span>
      <span class="k">"url"</span><span class="p">:</span> <span class="s">"${ENDPOINT_URL}"</span>
    <span class="p">}</span>
  <span class="p">}</span>
<span class="p">}</span></code></pre>
        <button class="copy-btn">copy</button>
      </div>
    </div>

    <div class="step">
      <div class="step-num">3</div>
      <div class="step-content">
        <h3>Restart Claude Desktop</h3>
        <p>The tool will appear in your available tools. Try asking: "Get the transcript for [any YouTube URL]"</p>
      </div>
    </div>

    <h2>Cursor</h2>

    <div class="step">
      <div class="step-num">1</div>
      <div class="step-content">
        <h3>Open MCP settings</h3>
        <p>Go to Cursor Settings &rarr; MCP &rarr; Add new MCP server.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-num">2</div>
      <div class="step-content">
        <h3>Add the configuration</h3>
<pre><code><span class="p">{</span>
  <span class="k">"mcpServers"</span><span class="p">:</span> <span class="p">{</span>
    <span class="k">"youtube-transcript"</span><span class="p">:</span> <span class="p">{</span>
      <span class="k">"url"</span><span class="p">:</span> <span class="s">"${ENDPOINT_URL}"</span>
    <span class="p">}</span>
  <span class="p">}</span>
<span class="p">}</span></code></pre>
        <button class="copy-btn">copy</button>
      </div>
    </div>

    <h2>Windsurf / Cline / Other</h2>

    <p>Any client that supports MCP over Streamable HTTP can connect. Use these details:</p>

<pre><code><span class="k">Transport</span><span class="p">:</span>  <span class="n">Streamable HTTP</span>
<span class="k">URL</span><span class="p">:</span>        <span class="s">${ENDPOINT_URL}</span>
<span class="k">Method</span><span class="p">:</span>     <span class="n">POST</span>
<span class="k">Auth</span><span class="p">:</span>       <span class="n">None</span>
<span class="k">Sessions</span><span class="p">:</span>   <span class="n">Disabled</span></code></pre>

    <h2>Test with cURL</h2>

    <p>Verify the endpoint is working by sending a raw MCP request:</p>

<pre><code><span class="n">curl -X POST ${ENDPOINT_URL} \\
  -H "Content-Type: application/json" \\
  -H "MCP-Protocol-Version: 2025-03-26" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "capabilities": {},
      "clientInfo": {
        "name": "test",
        "version": "1.0.0"
      }
    }
  }'</span></code></pre>
    <button class="copy-btn">copy</button>

    <p style="margin-top:1rem;font-size:0.78rem;color:var(--text-dim)">A successful response returns the server's capabilities and tool listings.</p>

    <footer>
      <a href="/">&larr; Overview</a>
      <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener">MCP Spec</a>
      <a href="https://github.com/guirguispierre/yttranscriptmcp" target="_blank" rel="noopener">Source</a>
    </footer>

  </div>
  <script>${COPY_SCRIPT}</script>
</body>
</html>`;
}

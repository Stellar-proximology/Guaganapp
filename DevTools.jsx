import { useState, useRef, useEffect } from 'react';
import { Code, Wand2, Globe, Terminal, Play, Save, Download, Upload } from 'lucide-react';

export default function DevTools({ theme, onClose }) {
  const [activeTab, setActiveTab] = useState('agent');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [websitePrompt, setWebsitePrompt] = useState('');
  const [code, setCode] = useState('// Your code here\nconsole.log("Hello World");');
  const [output, setOutput] = useState('');
  const [preview, setPreview] = useState('');
  const iframeRef = useRef(null);

  const buildAgent = () => {
    const agentCode = `// AI Agent: ${agentPrompt}
class Agent {
  constructor(prompt) {
    this.prompt = prompt;
  }
  
  async respond(userInput) {
    // Agent logic based on: ${agentPrompt}
    return \`Agent response to: \${userInput}\`;
  }
}

const agent = new Agent("${agentPrompt}");
console.log("Agent created:", agent.prompt);`;
    
    setCode(agentCode);
    setOutput(`✓ Agent created: ${agentPrompt}`);
  };

  const buildWebsite = () => {
    const websiteHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(255,255,255,0.1);
      padding: 40px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
    }
    h1 { font-size: 2.5rem; margin-bottom: 20px; }
    p { font-size: 1.1rem; line-height: 1.6; }
    button {
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 20px;
    }
    button:hover { transform: scale(1.05); }
  </style>
</head>
<body>
  <div class="container">
    <h1>${websitePrompt || 'Your Website'}</h1>
    <p>This website was generated from your prompt: "${websitePrompt}"</p>
    <button onclick="alert('Button clicked!')">Click Me</button>
  </div>
  <script>
    console.log('Website loaded: ${websitePrompt}');
  </script>
</body>
</html>`;
    
    setPreview(websiteHTML);
    setCode(websiteHTML);
    setOutput(`✓ Website generated: ${websitePrompt}`);
  };

  const runCode = () => {
    try {
      const result = eval(code);
      setOutput(`✓ Code executed\n${result || ''}`);
    } catch (err) {
      setOutput(`✗ Error: ${err.message}`);
    }
  };

  useEffect(() => {
    if (preview && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(preview);
      doc.close();
    }
  }, [preview]);

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('agent')}
          className={`flex items-center gap-2 px-4 py-3 text-sm ${activeTab === 'agent' ? 'bg-gray-900 text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
        >
          <Wand2 size={16} />
          Agent Builder
        </button>
        <button
          onClick={() => setActiveTab('website')}
          className={`flex items-center gap-2 px-4 py-3 text-sm ${activeTab === 'website' ? 'bg-gray-900 text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
        >
          <Globe size={16} />
          Website Builder
        </button>
        <button
          onClick={() => setActiveTab('ide')}
          className={`flex items-center gap-2 px-4 py-3 text-sm ${activeTab === 'ide' ? 'bg-gray-900 text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
        >
          <Code size={16} />
          Code Editor
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Input/Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-800">
          {activeTab === 'agent' && (
            <div className="p-4 flex flex-col h-full">
              <h3 className="text-white font-bold mb-3">AI Agent Builder</h3>
              <textarea
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="Describe your AI agent... e.g., 'A helpful assistant that answers questions about coding'"
                className="flex-1 bg-gray-900 text-white p-4 rounded-lg border border-gray-700 resize-none outline-none mb-3"
              />
              <button
                onClick={buildAgent}
                className="px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.background
                }}
              >
                <Wand2 size={16} />
                Generate Agent Code
              </button>
            </div>
          )}

          {activeTab === 'website' && (
            <div className="p-4 flex flex-col h-full">
              <h3 className="text-white font-bold mb-3">Website Builder</h3>
              <textarea
                value={websitePrompt}
                onChange={(e) => setWebsitePrompt(e.target.value)}
                placeholder="Describe your website... e.g., 'A portfolio site for a designer with dark theme'"
                className="flex-1 bg-gray-900 text-white p-4 rounded-lg border border-gray-700 resize-none outline-none mb-3"
              />
              <button
                onClick={buildWebsite}
                className="px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.background
                }}
              >
                <Globe size={16} />
                Generate Website
              </button>
            </div>
          )}

          {activeTab === 'ide' && (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 p-2 border-b border-gray-800">
                <button
                  onClick={runCode}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <Play size={14} />
                  Run
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                  <Save size={14} />
                  Save
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                  <Download size={14} />
                  Export
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-gray-900 text-green-400 p-4 font-mono text-sm resize-none outline-none"
                spellCheck={false}
              />
            </div>
          )}
        </div>

        {/* Right Panel - Preview/Output */}
        <div className="w-1/2 flex flex-col bg-gray-900">
          <div className="p-2 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">
              {activeTab === 'website' ? 'LIVE PREVIEW' : 'OUTPUT'}
            </span>
            <Terminal size={14} className="text-gray-500" />
          </div>
          
          {activeTab === 'website' && preview ? (
            <iframe
              ref={iframeRef}
              className="flex-1 bg-white"
              title="preview"
            />
          ) : (
            <div className="flex-1 p-4 overflow-auto">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                {output || '// Output will appear here'}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

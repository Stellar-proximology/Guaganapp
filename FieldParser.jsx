import { useState } from 'react';
import { Zap, Sparkles, ChevronRight } from 'lucide-react';

export default function FieldParser({ theme, onParse }) {
  const [input, setInput] = useState('');
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState(null);

  const parseField = async () => {
    setParsing(true);
    
    try {
      // Call our secure backend API for AI text analysis
      const response = await fetch('/api/text-embedding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const { embedding } = await response.json();
      
      // Use AI embedding as vector
      const aiVector = Array.isArray(embedding) ? embedding.slice(0, 8).map(v => parseFloat(v).toFixed(3)) : generateVector(input);
      
      const semanticVector = {
        input: input,
        operator: extractOperator(input),
        intent: extractIntent(input),
        entities: extractEntities(input),
        vector: aiVector,
        confidence: 0.95,
        aiPowered: true,
        timestamp: Date.now()
      };

      setResult(semanticVector);
      setParsing(false);
      if (onParse) onParse(semanticVector);
      
    } catch (error) {
      console.error('AI parsing error:', error);
      
      // Fallback to local processing if API fails
      const semanticVector = {
        input: input,
        operator: extractOperator(input),
        intent: extractIntent(input),
        entities: extractEntities(input),
        vector: generateVector(input),
        confidence: 0.75,
        aiPowered: false,
        error: error.message,
        timestamp: Date.now()
      };

      setResult(semanticVector);
      setParsing(false);
      if (onParse) onParse(semanticVector);
    }
  };

  const extractOperator = (text) => {
    const operators = {
      'create': 'Generate',
      'build': 'Construct',
      'make': 'Fabricate',
      'design': 'Architect',
      'visualize': 'Render',
      'analyze': 'Process',
      'understand': 'Comprehend'
    };
    
    for (const [key, value] of Object.entries(operators)) {
      if (text.toLowerCase().includes(key)) return value;
    }
    return 'Process';
  };

  const extractIntent = (text) => {
    if (text.toLowerCase().includes('website') || text.toLowerCase().includes('page')) return 'web_generation';
    if (text.toLowerCase().includes('agent') || text.toLowerCase().includes('assistant')) return 'agent_creation';
    if (text.toLowerCase().includes('image') || text.toLowerCase().includes('visual')) return 'visual_generation';
    if (text.toLowerCase().includes('analyze') || text.toLowerCase().includes('understand')) return 'semantic_analysis';
    return 'general_processing';
  };

  const extractEntities = (text) => {
    const entities = [];
    const words = text.toLowerCase().split(' ');
    
    const entityMap = {
      'website': 'web',
      'agent': 'ai_agent',
      'image': 'visual',
      'game': 'interactive',
      'app': 'application',
      'code': 'programming'
    };
    
    words.forEach(word => {
      if (entityMap[word]) {
        entities.push({ type: entityMap[word], value: word });
      }
    });
    
    return entities;
  };

  const generateVector = (text) => {
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array.from({ length: 8 }, (_, i) => 
      ((Math.sin(hash + i) + 1) / 2).toFixed(3)
    );
  };

  return (
    <div className="h-full flex flex-col p-6" style={{ backgroundColor: theme.background }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3" style={{ color: theme.text }}>
          <Zap className="w-6 h-6" style={{ color: theme.primary }} />
          Field Parser
        </h2>
        <p className="text-sm" style={{ color: theme.text + '80' }}>
          Convert natural language into semantic field vectors
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt... e.g., 'Create a landing page for a tech startup' or 'Build an AI assistant for customer support'"
            className="w-full h-32 p-4 rounded-lg border resize-none outline-none"
            style={{
              backgroundColor: theme.secondary,
              color: theme.text,
              borderColor: theme.primary + '30'
            }}
          />
        </div>

        <button
          onClick={parseField}
          disabled={!input.trim() || parsing}
          className="px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition disabled:opacity-30 mb-6"
          style={{ 
            backgroundColor: theme.primary,
            color: theme.background 
          }}
        >
          {parsing ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              Parsing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Parse Field Vector
            </>
          )}
        </button>

        {result && (
          <div className="flex-1 overflow-y-auto">
            <div className="border rounded-lg p-6 mb-4" style={{ 
              backgroundColor: theme.secondary, 
              borderColor: theme.primary + '50' 
            }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.primary }}>
                <Sparkles className="w-5 h-5" />
                Semantic Analysis
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-xs mb-1" style={{ color: theme.text + '60' }}>Operator</div>
                  <div className="font-bold text-lg" style={{ color: theme.primary }}>{result.operator}</div>
                </div>

                <div>
                  <div className="text-xs mb-1" style={{ color: theme.text + '60' }}>Intent</div>
                  <div className="font-mono text-sm px-3 py-1 rounded inline-block" style={{ 
                    backgroundColor: theme.primary + '20',
                    color: theme.text
                  }}>
                    {result.intent}
                  </div>
                </div>

                {result.entities.length > 0 && (
                  <div>
                    <div className="text-xs mb-2" style={{ color: theme.text + '60' }}>Entities</div>
                    <div className="flex flex-wrap gap-2">
                      {result.entities.map((entity, i) => (
                        <div key={i} className="px-3 py-1 rounded-full text-xs font-mono" style={{
                          backgroundColor: theme.primary + '30',
                          color: theme.text
                        }}>
                          {entity.type}: {entity.value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs mb-2" style={{ color: theme.text + '60' }}>Semantic Vector</div>
                  <div className="font-mono text-xs p-3 rounded" style={{ 
                    backgroundColor: theme.background,
                    color: '#10b981'
                  }}>
                    [{result.vector.join(', ')}]
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: theme.primary + '20' }}>
                  <div className="text-xs" style={{ color: theme.text + '60' }}>
                    Confidence: <span className="font-bold" style={{ color: '#10b981' }}>
                      {(result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <button className="text-xs px-4 py-2 rounded flex items-center gap-1" style={{
                    backgroundColor: theme.primary,
                    color: 'white'
                  }}>
                    Send to Visual Engine
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!result && !parsing && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-center" style={{ color: theme.text + '40' }}>
              Enter a prompt above and click Parse to see the semantic analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

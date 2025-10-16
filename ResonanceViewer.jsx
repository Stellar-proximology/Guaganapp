import { useState, useEffect } from 'react';
import { Network, Brain, Activity, Zap } from 'lucide-react';

export default function ResonanceViewer({ theme }) {
  const [conceptText, setConceptText] = useState('');
  const [conceptLabel, setConceptLabel] = useState('');
  const [queryText, setQueryText] = useState('');
  const [stats, setStats] = useState({ nodeCount: 0, edgeCount: 0, avgEnergy: 0 });
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [resonantResults, setResonantResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStats();
    fetchGraph();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/resonance/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchGraph = async () => {
    try {
      const response = await fetch('/api/resonance/graph');
      const data = await response.json();
      setGraphData(data);
    } catch (error) {
      console.error('Failed to fetch graph:', error);
    }
  };

  const addConcept = async () => {
    if (!conceptLabel.trim()) {
      setMessage('Please enter a concept label');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/resonance/add-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          label: conceptLabel, 
          text: conceptText || conceptLabel 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(`Added concept: ${data.label} (ID: ${data.id})`);
        setConceptLabel('');
        setConceptText('');
        await fetchStats();
        await fetchGraph();
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const findResonant = async () => {
    if (!queryText.trim()) {
      setMessage('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/resonance/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: queryText, topK: 5 }),
      });

      const data = await response.json();
      setResonantResults(data.results || []);
      setMessage(`Found ${data.results?.length || 0} resonant concepts`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const connectConcepts = async (sourceId, targetId) => {
    try {
      await fetch('/api/resonance/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId, targetId, weight: 1.0 }),
      });

      setMessage(`Connected concept ${sourceId} → ${targetId}`);
      await fetchStats();
      await fetchGraph();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="h-full p-6 overflow-auto" style={{ backgroundColor: theme.background, color: theme.text }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Resonance Graph
          </h1>
          <p className="text-sm" style={{ color: theme.text + 'AA' }}>
            Concept mapping with semantic resonance tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
            <div className="flex items-center gap-2 mb-2">
              <Network size={20} style={{ color: theme.primary }} />
              <span className="font-bold">Nodes</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: theme.primary }}>{stats.nodeCount}</p>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
            <div className="flex items-center gap-2 mb-2">
              <Activity size={20} style={{ color: theme.primary }} />
              <span className="font-bold">Connections</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: theme.primary }}>{stats.edgeCount}</p>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={20} style={{ color: theme.primary }} />
              <span className="font-bold">Avg Energy</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: theme.primary }}>{stats.avgEnergy.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Brain size={18} style={{ color: theme.primary }} />
              Add Concept
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: theme.text + 'AA' }}>
                  Concept Label *
                </label>
                <input
                  type="text"
                  value={conceptLabel}
                  onChange={(e) => setConceptLabel(e.target.value)}
                  placeholder="e.g., creativity, innovation, flow"
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    backgroundColor: theme.background, 
                    color: theme.text,
                    borderColor: theme.primary + '30'
                  }}
                />
              </div>

              <div>
                <label className="text-xs mb-1 block" style={{ color: theme.text + 'AA' }}>
                  Description (optional)
                </label>
                <textarea
                  value={conceptText}
                  onChange={(e) => setConceptText(e.target.value)}
                  placeholder="Describe this concept for better semantic matching..."
                  rows="3"
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    backgroundColor: theme.background, 
                    color: theme.text,
                    borderColor: theme.primary + '30'
                  }}
                />
              </div>

              <button
                onClick={addConcept}
                disabled={isLoading}
                className="w-full py-2 rounded font-medium text-sm transition-opacity disabled:opacity-50"
                style={{ backgroundColor: theme.primary, color: 'white' }}
              >
                {isLoading ? 'Adding...' : 'Add Concept'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Activity size={18} style={{ color: theme.primary }} />
              Find Resonant Concepts
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: theme.text + 'AA' }}>
                  Search Query
                </label>
                <input
                  type="text"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Enter a concept or question..."
                  className="w-full px-3 py-2 rounded border text-sm"
                  style={{ 
                    backgroundColor: theme.background, 
                    color: theme.text,
                    borderColor: theme.primary + '30'
                  }}
                />
              </div>

              <button
                onClick={findResonant}
                disabled={isLoading}
                className="w-full py-2 rounded font-medium text-sm transition-opacity disabled:opacity-50"
                style={{ backgroundColor: theme.primary, color: 'white' }}
              >
                {isLoading ? 'Searching...' : 'Find Resonance'}
              </button>

              {resonantResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold" style={{ color: theme.text + 'AA' }}>Results:</p>
                  {resonantResults.map((result, idx) => (
                    <div 
                      key={idx}
                      className="p-2 rounded text-sm"
                      style={{ backgroundColor: theme.background }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{result.label}</span>
                        <span className="text-xs px-2 py-1 rounded" style={{ 
                          backgroundColor: theme.primary + '30',
                          color: theme.primary 
                        }}>
                          {(result.similarity * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-xs mt-1" style={{ color: theme.text + '60' }}>
                        Energy: {result.energy.toFixed(2)} | Resonance: {result.resonance.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded border" style={{ 
            backgroundColor: theme.secondary, 
            borderColor: theme.primary + '30',
            color: theme.text 
          }}>
            {message}
          </div>
        )}

        {graphData.nodes.length > 0 && (
          <div className="mt-6 p-4 rounded-lg border" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
            <h3 className="font-bold mb-4">Graph Visualization</h3>
            <div className="space-y-2">
              {graphData.nodes.map(node => (
                <div key={node.id} className="p-2 rounded flex justify-between items-center" style={{ backgroundColor: theme.background }}>
                  <span className="text-sm">
                    <span className="font-mono text-xs" style={{ color: theme.primary }}>#{node.id}</span>{' '}
                    <span>{node.label}</span>
                  </span>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: theme.primary + '20' }}>
                    Energy: {node.energy.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

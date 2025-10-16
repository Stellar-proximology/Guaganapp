import { useState, useEffect } from 'react';
import { Puzzle, Eye, Zap, Network, Code, Brain, Activity } from 'lucide-react';

export default function Extensions({ theme, enabledModules, onToggle }) {
  const [modules, setModules] = useState([
    { 
      id: 'fieldParser', 
      name: 'Field Parser', 
      icon: Zap,
      description: 'LLM-based prompt interpreter for semantic field analysis',
      enabled: false,
      category: 'AI'
    },
    { 
      id: 'visualEngine', 
      name: 'Visual Engine', 
      icon: Eye,
      description: 'GAN-based visual generation from semantic vectors',
      enabled: false,
      category: 'Generation'
    },
    { 
      id: 'semanticBridge', 
      name: 'Semantic Bridge', 
      icon: Network,
      description: 'LLM↔GAN alignment and latent space synchronization',
      enabled: false,
      category: 'AI'
    },
    { 
      id: 'ontologyGraph', 
      name: 'Ontology Graph', 
      icon: Brain,
      description: 'Knowledge graph visualization and semantic relationships',
      enabled: false,
      category: 'Knowledge'
    },
    { 
      id: 'agentBuilder', 
      name: 'Agent Builder', 
      icon: Code,
      description: 'Create autonomous AI agents for task automation',
      enabled: false,
      category: 'Development'
    },
    { 
      id: 'quantumGAN', 
      name: 'Quantum GAN', 
      icon: Activity,
      description: 'Quantum-enhanced generative adversarial networks',
      enabled: false,
      category: 'Advanced'
    },
    { 
      id: 'resonanceViewer', 
      name: 'Resonance Graph', 
      icon: Network,
      description: 'Concept mapping with semantic resonance tracking',
      enabled: false,
      category: 'Knowledge'
    }
  ]);

  useEffect(() => {
    if (enabledModules) {
      setModules(prev => prev.map(mod => ({
        ...mod,
        enabled: enabledModules.includes(mod.id)
      })));
    }
  }, [enabledModules]);

  const handleToggle = (moduleId) => {
    setModules(prev => prev.map(mod => 
      mod.id === moduleId ? { ...mod, enabled: !mod.enabled } : mod
    ));
    
    if (onToggle) {
      const module = modules.find(m => m.id === moduleId);
      onToggle(moduleId, !module.enabled);
    }
  };

  const categories = ['All', 'AI', 'Generation', 'Knowledge', 'Development', 'Advanced'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredModules = activeCategory === 'All' 
    ? modules 
    : modules.filter(m => m.category === activeCategory);

  const enabledCount = modules.filter(m => m.enabled).length;

  return (
    <div className="h-full flex flex-col p-6" style={{ backgroundColor: theme.background }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3" style={{ color: theme.text }}>
          <Puzzle className="w-6 h-6" style={{ color: theme.primary }} />
          Extensions
        </h2>
        <p className="text-sm" style={{ color: theme.text + '80' }}>
          Manage modular components and capabilities
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg" style={{ backgroundColor: theme.secondary }}>
          <div className="text-2xl font-bold mb-1" style={{ color: theme.primary }}>
            {modules.length}
          </div>
          <div className="text-xs" style={{ color: theme.text + '80' }}>Total Modules</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: theme.secondary }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>
            {enabledCount}
          </div>
          <div className="text-xs" style={{ color: theme.text + '80' }}>Active</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: theme.secondary }}>
          <div className="text-2xl font-bold mb-1" style={{ color: theme.text + '60' }}>
            {modules.length - enabledCount}
          </div>
          <div className="text-xs" style={{ color: theme.text + '80' }}>Disabled</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition"
            style={{
              backgroundColor: activeCategory === cat ? theme.primary : theme.secondary,
              color: activeCategory === cat ? 'white' : theme.text
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredModules.map(module => {
          const Icon = module.icon;
          
          return (
            <div 
              key={module.id}
              className="border rounded-lg p-4 transition"
              style={{ 
                backgroundColor: module.enabled ? theme.primary + '10' : theme.secondary,
                borderColor: module.enabled ? theme.primary : theme.primary + '30'
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    backgroundColor: module.enabled ? theme.primary + '30' : theme.background 
                  }}
                >
                  <Icon 
                    className="w-6 h-6" 
                    style={{ color: module.enabled ? theme.primary : theme.text + '60' }} 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold" style={{ color: theme.text }}>
                      {module.name}
                    </h3>
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: theme.primary + '20',
                        color: theme.text + 'CC'
                      }}
                    >
                      {module.category}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: theme.text + '80' }}>
                    {module.description}
                  </p>
                </div>

                <button
                  onClick={() => handleToggle(module.id)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition"
                  style={{ 
                    backgroundColor: module.enabled ? theme.primary : theme.background 
                  }}
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    style={{
                      transform: module.enabled ? 'translateX(1.5rem)' : 'translateX(0.25rem)'
                    }}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: theme.primary + '20' }}>
        <button
          onClick={() => modules.forEach(m => !m.enabled && handleToggle(m.id))}
          className="flex-1 px-4 py-2 rounded-lg border font-medium transition"
          style={{ 
            borderColor: theme.primary,
            color: theme.primary
          }}
        >
          Enable All
        </button>
        <button
          onClick={() => modules.forEach(m => m.enabled && handleToggle(m.id))}
          className="flex-1 px-4 py-2 rounded-lg border font-medium transition"
          style={{ 
            borderColor: theme.text + '40',
            color: theme.text
          }}
        >
          Disable All
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Code, Wand2, Globe, Gamepad2, Sparkles, Plus } from 'lucide-react';

export default function DeveloperPanel({ theme, onClose }) {
  const [activeTab, setActiveTab] = useState('general');
  const [skillLevel, setSkillLevel] = useState(null);
  const [showSkillSelector, setShowSkillSelector] = useState(true);

  const templates = {
    agents: [
      { name: 'Chat Agent', desc: 'AI assistant that can answer questions', difficulty: 'beginner' },
      { name: 'Task Agent', desc: 'Automated task executor', difficulty: 'intermediate' },
      { name: 'Custom Agent', desc: 'Build your own AI agent', difficulty: 'advanced', custom: true }
    ],
    games: [
      { name: 'Particle Game', desc: 'Interactive particle system', difficulty: 'beginner' },
      { name: 'Platformer', desc: '2D platform game', difficulty: 'intermediate' },
      { name: 'Custom Game', desc: 'Create your own game', difficulty: 'advanced', custom: true }
    ],
    websites: [
      { name: 'Landing Page', desc: 'Simple landing page', difficulty: 'beginner' },
      { name: 'Portfolio', desc: 'Personal portfolio site', difficulty: 'intermediate' },
      { name: 'Custom Website', desc: 'Build from scratch', difficulty: 'advanced', custom: true }
    ],
    artifacts: [
      { name: 'Interactive Chart', desc: 'Data visualization', difficulty: 'beginner' },
      { name: 'Animation', desc: 'Interactive animation', difficulty: 'intermediate' },
      { name: 'Custom Artifact', desc: 'Create custom interactive', difficulty: 'advanced', custom: true }
    ]
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Code },
    { id: 'agents', label: 'AI Agents', icon: Wand2 },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'websites', label: 'Websites', icon: Globe },
    { id: 'artifacts', label: 'Artifacts', icon: Sparkles }
  ];

  const handleCreateWithAgent = (template) => {
    alert(`Agent will create: ${template.name}\n\nThe AI agent will build this for you automatically based on your requirements.`);
  };

  const handleCreateManually = (template) => {
    alert(`Opening editor for: ${template.name}\n\nYou can customize the code yourself.`);
  };

  if (showSkillSelector && !skillLevel) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: theme.text }}>Welcome to Developer Mode</h2>
          <p className="mb-6" style={{ color: theme.text + 'CC' }}>What's your experience level?</p>
          <div className="space-y-3">
            <button
              onClick={() => setSkillLevel('beginner')}
              className="w-full p-4 rounded-lg border-2 hover:opacity-80 transition text-left"
              style={{ backgroundColor: theme.background, borderColor: theme.primary }}
            >
              <div className="font-semibold mb-1" style={{ color: theme.text }}>Beginner</div>
              <div className="text-sm" style={{ color: theme.text + 'AA' }}>I want the agent to do everything for me</div>
            </button>
            <button
              onClick={() => setSkillLevel('intermediate')}
              className="w-full p-4 rounded-lg border-2 hover:opacity-80 transition text-left"
              style={{ backgroundColor: theme.background, borderColor: theme.primary }}
            >
              <div className="font-semibold mb-1" style={{ color: theme.text }}>Intermediate</div>
              <div className="text-sm" style={{ color: theme.text + 'AA' }}>I can code with some help from the agent</div>
            </button>
            <button
              onClick={() => setSkillLevel('advanced')}
              className="w-full p-4 rounded-lg border-2 hover:opacity-80 transition text-left"
              style={{ backgroundColor: theme.background, borderColor: theme.primary }}
            >
              <div className="font-semibold mb-1" style={{ color: theme.text }}>Advanced</div>
              <div className="text-sm" style={{ color: theme.text + 'AA' }}>I want full control and manual coding</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Skill Level Badge */}
      <div className="p-4 border-b" style={{ borderColor: theme.primary + '30' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: theme.primary, color: 'white' }}>
              {skillLevel}
            </span>
            <span className="text-sm" style={{ color: theme.text }}>Developer Mode</span>
          </div>
          <button 
            onClick={() => { setSkillLevel(null); setShowSkillSelector(true); }}
            className="text-xs hover:opacity-80"
            style={{ color: theme.primary }}
          >
            Change Level
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto" style={{ borderColor: theme.primary + '30' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap"
              style={{
                borderColor: activeTab === tab.id ? theme.primary : 'transparent',
                color: activeTab === tab.id ? theme.primary : theme.text + 'AA'
              }}
            >
              <Icon size={16} />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'general' ? (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3" style={{ color: theme.text }}>General Development</h3>
            <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.background, borderColor: theme.primary + '30' }}>
              <textarea
                placeholder="Describe what you want to build... The agent will create it for you."
                className="w-full h-32 p-3 rounded border outline-none resize-none"
                style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.primary + '30' }}
              />
              <button 
                className="mt-3 px-4 py-2 rounded text-white hover:opacity-90 transition"
                style={{ backgroundColor: theme.primary }}
              >
                {skillLevel === 'beginner' ? 'Let Agent Build This' : 'Start Building'}
              </button>
            </div>
            <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
              <h4 className="font-medium mb-2" style={{ color: theme.text }}>AI Tools Available</h4>
              <div className="text-sm space-y-1" style={{ color: theme.text + 'CC' }}>
                <div>✓ LLM (Text Generation) - OpenAI, Anthropic, Hugging Face</div>
                <div>✓ GAN (Image Generation) - Stable Diffusion, DALL-E</div>
                <div>✓ Code Generator - Auto-generate code from descriptions</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3" style={{ color: theme.text }}>
              {tabs.find(t => t.id === activeTab)?.label} Templates
            </h3>
            <div className="grid gap-3">
              {templates[activeTab]?.map((template, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border hover:shadow-lg transition"
                  style={{ backgroundColor: theme.background, borderColor: theme.primary + '30' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium" style={{ color: theme.text }}>{template.name}</h4>
                      <p className="text-sm mt-1" style={{ color: theme.text + 'AA' }}>{template.desc}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: theme.secondary, color: theme.text }}>
                      {template.difficulty}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {skillLevel === 'beginner' || template.custom ? (
                      <button
                        onClick={() => handleCreateWithAgent(template)}
                        className="flex-1 px-3 py-2 rounded text-sm text-white hover:opacity-90 transition flex items-center justify-center gap-2"
                        style={{ backgroundColor: theme.primary }}
                      >
                        <Wand2 size={14} />
                        Agent Build
                      </button>
                    ) : null}
                    {skillLevel !== 'beginner' ? (
                      <button
                        onClick={() => handleCreateManually(template)}
                        className="flex-1 px-3 py-2 rounded text-sm border hover:opacity-80 transition"
                        style={{ borderColor: theme.primary, color: theme.primary }}
                      >
                        {template.custom ? <><Plus size={14} className="inline mr-1" /> Create Custom</> : 'Edit Code'}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

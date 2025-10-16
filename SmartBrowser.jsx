import { useState, useRef } from 'react';
import { Plus, X, Home, RefreshCw, Settings, ChevronLeft, ChevronRight, MoreVertical, History, Bookmark, Download, Share2, Search, Globe, Trash2, Zap, ChevronRight as ChevronRightIcon, Layers, Brain, Eye, Network, LayoutDashboard, Code, Package, GitFork, Terminal, Puzzle } from 'lucide-react';
import DevTools from './DevTools';
import OnboardingEngine from './OnboardingEngine';
import FieldParser from './FieldParser';
import VisualEngine from './VisualEngine';
import SemanticBridge from './SemanticBridge';
import Extensions from './Extensions';
import ResonanceViewer from './ResonanceViewer';

export default function SmartBrowser() {
  const [tabs, setTabs] = useState([
    { id: 1, title: 'New Tab', url: '', type: 'home' }
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [address, setAddress] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);
  const [settingsTab, setSettingsTab] = useState('colors');
  const [devMenuTab, setDevMenuTab] = useState('templates');
  const [apiProvider, setApiProvider] = useState('openai');
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    huggingface: '',
    google: ''
  });
  const [theme, setTheme] = useState({
    primary: '#8b5cf6',
    background: '#030712',
    text: '#f9fafb',
    secondary: '#111827'
  });
  
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [enabledModules, setEnabledModules] = useState(['browser', 'devTools']);
  const [activeModule, setActiveModule] = useState(null);
  const [fieldVector, setFieldVector] = useState(null);
  const [visualOutput, setVisualOutput] = useState(null);

  const inputRef = useRef(null);

  const createTab = (url = '', title = 'New Tab') => {
    const id = Date.now();
    setTabs(t => [...t, {
      id,
      title,
      url,
      type: url ? 'web' : 'home'
    }]);
    setActiveTab(id);
    setAddress(url);
  };

  const closeTab = (id) => {
    if (tabs.length === 1) return;
    setTabs(t => t.filter(tab => tab.id !== id));
    if (activeTab === id) {
      const next = tabs.find(t => t.id !== id);
      if (next) {
        setActiveTab(next.id);
        setAddress(next.url);
      }
    }
  };

  const handleNavigate = () => {
    if (!address.trim()) return;
    
    let url = address;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTab 
        ? { ...tab, url, type: 'web', title: url.replace(/^https?:\/\//,'').split('/')[0] }
        : tab
    );
    setTabs(updatedTabs);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile);
    setEnabledModules(profile.enabledModules || ['browser', 'devTools']);
    setShowOnboarding(false);
  };

  const handleModuleToggle = (moduleId, enabled) => {
    setEnabledModules(prev => 
      enabled ? [...prev, moduleId] : prev.filter(id => id !== moduleId)
    );
  };

  const handleFieldParse = (vector) => {
    setFieldVector(vector);
  };

  const handleVisualGenerate = (output) => {
    setVisualOutput(output);
  };

  const presetThemes = {
    semantic: { primary: '#8b5cf6', background: '#030712', text: '#f9fafb', secondary: '#111827' },
    purple: { primary: '#a855f7', background: '#030712', text: '#f9fafb', secondary: '#1f2937' },
    blue: { primary: '#3b82f6', background: '#030712', text: '#f9fafb', secondary: '#1e293b' },
    green: { primary: '#10b981', background: '#030712', text: '#f9fafb', secondary: '#14532d' },
    pink: { primary: '#ec4899', background: '#030712', text: '#f9fafb', secondary: '#1f1729' },
    cyan: { primary: '#06b6d4', background: '#030712', text: '#f9fafb', secondary: '#0c1e2b' },
    light: { primary: '#3b82f6', background: '#ffffff', text: '#1f2937', secondary: '#f3f4f6' },
    ocean: { primary: '#0ea5e9', background: '#ffffff', text: '#0f172a', secondary: '#e0f2fe' },
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  if (showOnboarding && !userProfile) {
    return <OnboardingEngine onComplete={handleOnboardingComplete} theme={theme} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden font-mono" style={{ backgroundColor: theme.background }}>
      {/* Top Bar - Semantic OS Style */}
      <div className="border-b flex items-center px-4 py-2 justify-between" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: theme.primary }} />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-xs tracking-wide" style={{ color: theme.text }}>GUAGAN</span>
              <span className="font-bold text-xs tracking-widest" style={{ color: theme.primary }}>P R O</span>
              <span className="font-bold text-xs tracking-wide" style={{ color: theme.text }}>BROWSER</span>
            </div>
          </div>

          {/* Navigation Buttons - Hidden on small screens */}
          <div className="hidden md:flex items-center gap-1">
            <button className="p-1.5 hover:bg-gray-800 rounded" style={{ color: theme.text + '80' }}>
              <ChevronLeft size={16} />
            </button>
            <button className="p-1.5 hover:bg-gray-800 rounded" style={{ color: theme.text + '80' }}>
              <ChevronRight size={16} />
            </button>
            <button className="p-1.5 hover:bg-gray-800 rounded" style={{ color: theme.text + '80' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-2xl">
          {/* Address Bar */}
          <div className="flex-1 flex items-center border rounded px-3 py-1.5" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
            <Home 
              size={14} 
              className="mr-2 cursor-pointer hover:opacity-80" 
              style={{ color: theme.primary }}
              onClick={() => {
                setAddress('');
                setActiveModule(null);
                const updatedTabs = tabs.map(tab => 
                  tab.id === activeTab ? { ...tab, url: '', type: 'home', title: 'New Tab' } : tab
                );
                setTabs(updatedTabs);
              }}
            />
            <input
              ref={inputRef}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search or enter address"
              className="flex-1 outline-none text-xs w-full"
              style={{ backgroundColor: 'transparent', color: theme.text }}
            />
          </div>

          {/* Menu Button */}
          <button 
            className="p-1.5 hover:bg-gray-800 rounded flex-shrink-0"
            style={{ color: theme.text }}
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Browser Menu Dropdown */}
      {showMenu && (
        <div className="fixed top-14 right-4 w-64 rounded-lg shadow-2xl border z-50 max-h-[calc(100vh-4rem)] overflow-y-auto" style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}>
          <div className="py-2">
            <button 
              onClick={() => { createTab(); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:opacity-80 flex items-center gap-3 text-sm"
              style={{ color: theme.text }}
            >
              <Plus size={16} /> New tab
            </button>
            <button 
              onClick={() => { alert('Incognito mode coming soon!'); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:opacity-80 flex items-center gap-3 text-sm"
              style={{ color: theme.text }}
            >
              <Globe size={16} /> New Incognito tab
            </button>
            <div className="border-t my-2" style={{ borderColor: theme.primary + '30' }}></div>
            <button 
              onClick={() => { setActiveModule('extensions'); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:opacity-80 flex items-center gap-3 text-sm"
              style={{ color: theme.text }}
            >
              <Puzzle size={16} /> Extensions
            </button>
            <button 
              onClick={() => { setActiveModule('fieldParser'); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:opacity-80 flex items-center gap-3 text-sm"
              style={{ color: theme.text }}
            >
              <Zap size={16} /> Field Parser
            </button>
            <button 
              onClick={() => { setActiveModule('visualEngine'); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:opacity-80 flex items-center gap-3 text-sm"
              style={{ color: theme.text }}
            >
              <Eye size={16} /> Visual Engine
            </button>
            <button 
              onClick={() => { setActiveModule('semanticBridge'); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:opacity-80 flex items-center gap-3 text-sm"
              style={{ color: theme.text }}
            >
              <Network size={16} /> Semantic Bridge
            </button>
            <div className="border-t my-2" style={{ borderColor: theme.primary + '30' }}></div>
            <button 
              onClick={() => { setShowDevMenu(true); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:opacity-80 flex items-center gap-3 text-sm"
              style={{ color: theme.text }}
            >
              <Code size={16} /> Dev Menu
            </button>
            <div className="border-t my-2" style={{ borderColor: theme.primary + '30' }}></div>
            <button 
              onClick={() => { setShowSettings(true); setSettingsTab('colors'); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left hover:opacity-80 flex items-center gap-3 text-sm"
              style={{ color: theme.text }}
            >
              <Settings size={16} /> Settings
            </button>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="border-b flex items-center px-2 gap-1 overflow-x-auto" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-sm min-w-[150px] max-w-[200px] rounded-t-lg transition`}
            style={{
              backgroundColor: tab.id === activeTab ? theme.background : theme.secondary,
              color: theme.text,
              borderTop: tab.id === activeTab ? `2px solid ${theme.primary}` : 'none'
            }}
            onClick={() => {
              setActiveTab(tab.id);
              setAddress(tab.url);
            }}
          >
            <span className="flex-1 truncate">{tab.title}</span>
            {tabs.length > 1 && (
              <X
                size={14}
                className="hover:opacity-70 flex-shrink-0"
                style={{ color: theme.text }}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              />
            )}
          </div>
        ))}
        <button
          onClick={() => createTab()}
          className="p-2 hover:opacity-80 rounded"
        >
          <Plus size={16} style={{ color: theme.text }} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative" style={{ backgroundColor: theme.background }}>
        {activeModule === 'extensions' ? (
          <Extensions theme={theme} enabledModules={enabledModules} onToggle={handleModuleToggle} />
        ) : activeModule === 'fieldParser' ? (
          <FieldParser theme={theme} onParse={handleFieldParse} />
        ) : activeModule === 'visualEngine' ? (
          <VisualEngine theme={theme} semanticVector={fieldVector} onGenerate={handleVisualGenerate} />
        ) : activeModule === 'semanticBridge' ? (
          <SemanticBridge theme={theme} fieldVector={fieldVector} visualOutput={visualOutput} />
        ) : activeModule === 'resonanceViewer' ? (
          <ResonanceViewer theme={theme} />
        ) : currentTab?.type === 'home' ? (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Guagan Browser Pro
              </h1>
              <p className="text-sm" style={{ color: theme.text + 'AA' }}>Modular AI-powered browser with LLM + GAN integration</p>
            </div>

            {/* User Profile */}
            {userProfile && (
              <div className="mb-6 border rounded-lg p-4" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold" style={{ color: theme.text }}>Your Profile</h3>
                  <button 
                    onClick={() => setShowOnboarding(true)}
                    className="text-xs px-3 py-1 rounded"
                    style={{ backgroundColor: theme.primary + '20', color: theme.primary }}
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span style={{ color: theme.text + '60' }}>Type: </span>
                    <span className="font-bold capitalize" style={{ color: theme.primary }}>{userProfile.userType}</span>
                  </div>
                  <div>
                    <span style={{ color: theme.text + '60' }}>Experience: </span>
                    <span className="font-bold capitalize" style={{ color: theme.primary }}>{userProfile.experience}</span>
                  </div>
                  <div>
                    <span style={{ color: theme.text + '60' }}>Mode: </span>
                    <span className="font-bold capitalize" style={{ color: theme.primary }}>{userProfile.uiMode}</span>
                  </div>
                  <div>
                    <span style={{ color: theme.text + '60' }}>Modules: </span>
                    <span className="font-bold" style={{ color: theme.primary }}>{enabledModules.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="border rounded p-4" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
                <div className="text-xs mb-1" style={{ color: theme.text + '80' }}>Active Theme</div>
                <div className="text-2xl font-bold capitalize" style={{ color: theme.primary }}>
                  {Object.keys(presetThemes).find(key => 
                    JSON.stringify(presetThemes[key]) === JSON.stringify(theme)
                  ) || 'Custom'}
                </div>
              </div>
              <div className="border rounded p-4" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
                <div className="text-xs mb-1" style={{ color: theme.text + '80' }}>Open Tabs</div>
                <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{tabs.length}</div>
              </div>
              <div className="border rounded p-4" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
                <div className="text-xs mb-1" style={{ color: theme.text + '80' }}>AI Status</div>
                <div className="text-2xl font-bold" style={{ color: apiKeys[apiProvider] ? '#10b981' : '#6b7280' }}>
                  {apiKeys[apiProvider] ? 'Ready' : 'Setup'}
                </div>
              </div>
              <div className="border rounded p-4" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
                <div className="text-xs mb-1" style={{ color: theme.text + '80' }}>Extensions</div>
                <div className="text-2xl font-bold" style={{ color: '#ec4899' }}>{enabledModules.length}</div>
              </div>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                className="border rounded-lg p-5 hover:border-opacity-70 cursor-pointer transition-all group"
                style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}
                onClick={() => setActiveModule('extensions')}
              >
                <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: theme.primary + '20' }}>
                  <Puzzle className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: theme.text }}>Extensions Manager</h3>
                <p className="text-xs" style={{ color: theme.text + '80' }}>Toggle and configure modules</p>
              </div>

              <div 
                className="border rounded-lg p-5 hover:border-opacity-70 cursor-pointer transition-all group"
                style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}
                onClick={() => setActiveModule('fieldParser')}
              >
                <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: '#8b5cf6' + '20' }}>
                  <Zap className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: theme.text }}>Field Parser</h3>
                <p className="text-xs" style={{ color: theme.text + '80' }}>LLM semantic field analysis</p>
              </div>

              <div 
                className="border rounded-lg p-5 hover:border-opacity-70 cursor-pointer transition-all group"
                style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}
                onClick={() => setActiveModule('visualEngine')}
              >
                <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: '#ec4899' + '20' }}>
                  <Eye className="w-5 h-5" style={{ color: '#ec4899' }} />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: theme.text }}>Visual Engine</h3>
                <p className="text-xs" style={{ color: theme.text + '80' }}>GAN-based visual generation</p>
              </div>

              <div 
                className="border rounded-lg p-5 hover:border-opacity-70 cursor-pointer transition-all group"
                style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}
                onClick={() => setActiveModule('semanticBridge')}
              >
                <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: '#06b6d4' + '20' }}>
                  <Network className="w-5 h-5" style={{ color: '#06b6d4' }} />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: theme.text }}>Semantic Bridge</h3>
                <p className="text-xs" style={{ color: theme.text + '80' }}>LLM↔GAN alignment system</p>
              </div>

              <div 
                className="border rounded-lg p-5 hover:border-opacity-70 cursor-pointer transition-all group"
                style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}
                onClick={() => setAddress('google.com')}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChevronRightIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: theme.text }}>Google Search</h3>
                <p className="text-xs" style={{ color: theme.text + '80' }}>Quick access to web search</p>
              </div>

              <div 
                className="border rounded-lg p-5 hover:border-opacity-70 cursor-pointer transition-all group"
                style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}
                onClick={() => { setShowDevMenu(true); }}
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: theme.text }}>Dev Tools</h3>
                <p className="text-xs" style={{ color: theme.text + '80' }}>Agent & Website Builder</p>
              </div>
            </div>
          </div>
        ) : currentTab?.url ? (
          <iframe
            src={currentTab.url}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title="Browser Content"
          />
        ) : (
          <div className="h-full flex items-center justify-center" style={{ color: theme.text + '66' }}>
            Loading...
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-0 right-0 w-96 h-full border-l shadow-xl flex flex-col" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.primary + '30' }}>
              <h2 className="text-xl font-semibold" style={{ color: theme.text }}>Settings</h2>
              <button onClick={() => setShowSettings(false)}>
                <X size={20} style={{ color: theme.text }} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b overflow-x-auto" style={{ borderColor: theme.primary + '30' }}>
              <button
                onClick={() => setSettingsTab('colors')}
                className="px-4 py-3 border-b-2 transition whitespace-nowrap"
                style={{
                  borderColor: settingsTab === 'colors' ? theme.primary : 'transparent',
                  color: settingsTab === 'colors' ? theme.primary : theme.text + 'AA'
                }}
              >
                Colors
              </button>
              <button
                onClick={() => setSettingsTab('api')}
                className="px-4 py-3 border-b-2 transition whitespace-nowrap"
                style={{
                  borderColor: settingsTab === 'api' ? theme.primary : 'transparent',
                  color: settingsTab === 'api' ? theme.primary : theme.text + 'AA'
                }}
              >
                AI & API
              </button>
              <button
                onClick={() => setSettingsTab('developer')}
                className="px-4 py-3 border-b-2 transition whitespace-nowrap"
                style={{
                  borderColor: settingsTab === 'developer' ? theme.primary : 'transparent',
                  color: settingsTab === 'developer' ? theme.primary : theme.text + 'AA'
                }}
              >
                Developer
              </button>
              <button
                onClick={() => setSettingsTab('about')}
                className="px-4 py-3 border-b-2 transition whitespace-nowrap"
                style={{
                  borderColor: settingsTab === 'about' ? theme.primary : 'transparent',
                  color: settingsTab === 'about' ? theme.primary : theme.text + 'AA'
                }}
              >
                About
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {settingsTab === 'colors' && (
                <div className="h-full overflow-y-auto p-6 space-y-6">
                  {/* Color Themes */}
                  <div className="pb-6 border-b" style={{ borderColor: theme.primary + '30' }}>
                    <h3 className="font-medium mb-4" style={{ color: theme.text }}>Color Theme</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(presetThemes).map(([name, colors]) => (
                        <button
                          key={name}
                          onClick={() => setTheme(colors)}
                          className="p-3 rounded-lg border-2 text-left hover:opacity-80 transition capitalize"
                          style={{
                            backgroundColor: colors.background,
                            borderColor: theme.primary === colors.primary ? colors.primary : 'transparent'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                            <span className="text-sm" style={{ color: colors.text }}>{name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div>
                    <h3 className="font-medium mb-4" style={{ color: theme.text }}>Custom Colors</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm block mb-1" style={{ color: theme.text }}>Primary Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={theme.primary}
                            onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.primary}
                            onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
                            className="flex-1 px-3 py-2 border rounded text-sm"
                            style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.primary + '50' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm block mb-1" style={{ color: theme.text }}>Background Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={theme.background}
                            onChange={(e) => setTheme({ ...theme, background: e.target.value })}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.background}
                            onChange={(e) => setTheme({ ...theme, background: e.target.value })}
                            className="flex-1 px-3 py-2 border rounded text-sm"
                            style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.primary + '50' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm block mb-1" style={{ color: theme.text }}>Text Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={theme.text}
                            onChange={(e) => setTheme({ ...theme, text: e.target.value })}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={theme.text}
                            onChange={(e) => setTheme({ ...theme, text: e.target.value })}
                            className="flex-1 px-3 py-2 border rounded text-sm"
                            style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.primary + '50' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'api' && (
                <div className="h-full overflow-y-auto p-6 space-y-6">
                  <div>
                    <h3 className="font-medium mb-4" style={{ color: theme.text }}>AI Provider</h3>
                    <p className="text-sm mb-4" style={{ color: theme.text + 'AA' }}>Choose your preferred AI agent provider</p>
                    <select
                      value={apiProvider}
                      onChange={(e) => setApiProvider(e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                      style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.primary + '50' }}
                    >
                      <option value="openai">OpenAI (GPT-4, DALL-E)</option>
                      <option value="anthropic">Anthropic (Claude)</option>
                      <option value="huggingface">Hugging Face (Open Models)</option>
                      <option value="google">Google (Gemini)</option>
                    </select>
                  </div>

                  <div className="pb-6 border-b" style={{ borderColor: theme.primary + '30' }}>
                    <h3 className="font-medium mb-4" style={{ color: theme.text }}>API Keys</h3>
                    
                    {apiProvider === 'openai' && (
                      <div className="space-y-3">
                        <p className="text-xs" style={{ color: theme.text + 'AA' }}>Get your API key from platform.openai.com</p>
                        <input
                          type="password"
                          value={apiKeys.openai}
                          onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                          placeholder="sk-..."
                          className="w-full px-3 py-2 border rounded text-sm"
                          style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.primary + '50' }}
                        />
                        <button
                          onClick={() => { alert('OpenAI API key saved! Agent is now ready.'); }}
                          className="w-full px-4 py-2 rounded hover:opacity-90 transition"
                          style={{ 
                            backgroundColor: theme.primary,
                            color: theme.background 
                          }}
                        >
                          Save & Activate Agent
                        </button>
                      </div>
                    )}

                    {apiProvider === 'anthropic' && (
                      <div className="space-y-3">
                        <p className="text-xs" style={{ color: theme.text + 'AA' }}>Get your API key from console.anthropic.com</p>
                        <input
                          type="password"
                          value={apiKeys.anthropic}
                          onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                          placeholder="sk-ant-..."
                          className="w-full px-3 py-2 border rounded text-sm"
                          style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.primary + '50' }}
                        />
                        <button
                          onClick={() => { alert('Anthropic API key saved! Agent is now ready.'); }}
                          className="w-full px-4 py-2 rounded hover:opacity-90 transition"
                          style={{ 
                            backgroundColor: theme.primary,
                            color: theme.background 
                          }}
                        >
                          Save & Activate Agent
                        </button>
                      </div>
                    )}

                    {apiProvider === 'huggingface' && (
                      <div className="space-y-3">
                        <p className="text-xs" style={{ color: theme.text + 'AA' }}>Get your API key from huggingface.co/settings/tokens</p>
                        <input
                          type="password"
                          value={apiKeys.huggingface}
                          onChange={(e) => setApiKeys({ ...apiKeys, huggingface: e.target.value })}
                          placeholder="hf_..."
                          className="w-full px-3 py-2 border rounded text-sm"
                          style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.primary + '50' }}
                        />
                        <button
                          onClick={() => { alert('Hugging Face API key saved! Agent is now ready.'); }}
                          className="w-full px-4 py-2 rounded hover:opacity-90 transition"
                          style={{ 
                            backgroundColor: theme.primary,
                            color: theme.background 
                          }}
                        >
                          Save & Activate Agent
                        </button>
                      </div>
                    )}

                    {apiProvider === 'google' && (
                      <div className="space-y-3">
                        <p className="text-xs" style={{ color: theme.text + 'AA' }}>Get your API key from makersuite.google.com/app/apikey</p>
                        <input
                          type="password"
                          value={apiKeys.google}
                          onChange={(e) => setApiKeys({ ...apiKeys, google: e.target.value })}
                          placeholder="AI..."
                          className="w-full px-3 py-2 border rounded text-sm"
                          style={{ backgroundColor: theme.background, color: theme.text, borderColor: theme.primary + '50' }}
                        />
                        <button
                          onClick={() => { alert('Google API key saved! Agent is now ready.'); }}
                          className="w-full px-4 py-2 rounded hover:opacity-90 transition"
                          style={{ 
                            backgroundColor: theme.primary,
                            color: theme.background 
                          }}
                        >
                          Save & Activate Agent
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg" style={{ backgroundColor: theme.secondary }}>
                    <h4 className="font-medium mb-2" style={{ color: theme.text }}>What can the agent do?</h4>
                    <div className="text-sm space-y-1" style={{ color: theme.text + 'CC' }}>
                      <div>✓ Build websites, games, and apps for you</div>
                      <div>✓ Generate code from your descriptions</div>
                      <div>✓ Create AI assistants and agents</div>
                      <div>✓ Generate images and visual content</div>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'developer' && (
                <DevTools theme={theme} onClose={() => setShowSettings(false)} />
              )}

              {settingsTab === 'about' && (
                <div className="h-full overflow-y-auto p-6">
                  <h3 className="font-medium mb-2" style={{ color: theme.text }}>About</h3>
                  <p className="text-sm" style={{ color: theme.text }}>Guagan Browser Pro v1.0</p>
                  <p className="text-sm mt-1" style={{ color: theme.text + 'AA' }}>Modular AI browser with LLM + GAN integration</p>
                  <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: theme.secondary }}>
                    <h4 className="font-medium mb-2" style={{ color: theme.text }}>Core Modules</h4>
                    <div className="text-sm space-y-1" style={{ color: theme.text + 'CC' }}>
                      <div>✓ Field Parser - LLM semantic analysis</div>
                      <div>✓ Visual Engine - GAN-based generation</div>
                      <div>✓ Semantic Bridge - LLM↔GAN alignment</div>
                      <div>✓ Onboarding Engine - User profiling</div>
                      <div>✓ Extensions Framework - Modular system</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dev Menu Panel */}
        {showDevMenu && (
          <div className="absolute top-0 right-0 w-full md:w-[800px] h-full border-l shadow-xl flex flex-col" style={{ backgroundColor: theme.secondary, borderColor: theme.primary + '30' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.primary + '30' }}>
              <h2 className="text-xl font-semibold" style={{ color: theme.text }}>Dev Menu</h2>
              <button onClick={() => setShowDevMenu(false)}>
                <X size={20} style={{ color: theme.text }} />
              </button>
            </div>

            {/* Dev Menu Tabs */}
            <div className="flex border-b overflow-x-auto" style={{ borderColor: theme.primary + '30' }}>
              <button
                onClick={() => setDevMenuTab('templates')}
                className="px-4 py-3 border-b-2 transition whitespace-nowrap"
                style={{
                  borderColor: devMenuTab === 'templates' ? theme.primary : 'transparent',
                  color: devMenuTab === 'templates' ? theme.primary : theme.text + 'AA'
                }}
              >
                Templates
              </button>
              <button
                onClick={() => setDevMenuTab('modules')}
                className="px-4 py-3 border-b-2 transition whitespace-nowrap"
                style={{
                  borderColor: devMenuTab === 'modules' ? theme.primary : 'transparent',
                  color: devMenuTab === 'modules' ? theme.primary : theme.text + 'AA'
                }}
              >
                Modules
              </button>
              <button
                onClick={() => setDevMenuTab('ide')}
                className="px-4 py-3 border-b-2 transition whitespace-nowrap"
                style={{
                  borderColor: devMenuTab === 'ide' ? theme.primary : 'transparent',
                  color: devMenuTab === 'ide' ? theme.primary : theme.text + 'AA'
                }}
              >
                IDE
              </button>
            </div>

            {/* Dev Menu Content */}
            <div className="flex-1 overflow-hidden">
              {devMenuTab === 'templates' && (
                <DevTools theme={theme} onClose={() => setShowDevMenu(false)} />
              )}
              {devMenuTab === 'modules' && (
                <DevTools theme={theme} onClose={() => setShowDevMenu(false)} />
              )}
              {devMenuTab === 'ide' && (
                <DevTools theme={theme} onClose={() => setShowDevMenu(false)} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

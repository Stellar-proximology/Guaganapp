import { useState } from 'react';
import { Brain, Sparkles, Key } from 'lucide-react';
import { DIMENSIONS } from '../utils/consciousnessParser';

export default function SemanticOverlay({ parsedField, onApiKeySet }) {
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  return (
    <div className="w-80 bg-gray-900 border-r border-purple-800 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold">Consciousness Field</span>
          <Sparkles size={14} className="text-purple-400" />
        </div>
        
        {/* API Key Input */}
        {!showKeyInput ? (
          <button
            onClick={() => setShowKeyInput(true)}
            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-xs flex items-center justify-center gap-2"
          >
            <Key size={12} /> Set Hugging Face API Key
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="hf_..."
              className="w-full px-3 py-2 bg-gray-800 rounded text-xs outline-none"
            />
            <button
              onClick={() => {
                onApiKeySet(apiKey);
                setShowKeyInput(false);
              }}
              className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-xs"
            >
              Activate
            </button>
          </div>
        )}
      </div>

      {/* Dimensional Fields */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {Object.entries(DIMENSIONS).map(([key, dim]) => (
            <div
              key={key}
              className="bg-gray-950 rounded-lg p-3 border border-gray-800 hover:border-purple-600 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain size={14} className="text-purple-400" />
                <span className="text-xs font-bold text-purple-300">{key}</span>
              </div>
              <div className="text-xs text-gray-400 mb-1">{dim.keynote}</div>
              <div className="text-xs text-gray-500">{dim.nature}</div>
            </div>
          ))}
        </div>

        {/* Parsed Field Display */}
        {parsedField && (
          <div className="mt-6 bg-purple-900/20 border border-purple-600 rounded-lg p-3">
            <div className="text-xs font-bold text-purple-300 mb-2">Active Field</div>
            <div className="text-xs space-y-1">
              {parsedField.gate && <div>Gate: {parsedField.gate}</div>}
              {parsedField.line && <div>Line: {parsedField.line}</div>}
              {parsedField.dimension && <div>Dimension: {parsedField.dimension}</div>}
              {parsedField.keynote && (
                <div className="text-purple-400 mt-2">{parsedField.keynote}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

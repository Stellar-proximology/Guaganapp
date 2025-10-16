import { useState, useEffect } from 'react';
import { Network, Zap, Activity, CheckCircle, AlertCircle } from 'lucide-react';

export default function SemanticBridge({ theme, fieldVector, visualOutput }) {
  const [alignment, setAlignment] = useState(0);
  const [status, setStatus] = useState('idle');
  const [metrics, setMetrics] = useState({
    llmEmbedding: null,
    ganLatent: null,
    cosineDistance: null,
    alignmentScore: 0
  });

  useEffect(() => {
    if (fieldVector && visualOutput) {
      alignVectors();
    }
  }, [fieldVector, visualOutput]);

  const alignVectors = async () => {
    setStatus('aligning');
    
    const llmVector = fieldVector.vector || [];
    const ganVector = visualOutput.latent || Array.from({ length: 8 }, () => Math.random());
    
    const cosine = calculateCosineDistance(llmVector, ganVector);
    const score = Math.max(0, 1 - cosine);
    
    setTimeout(() => {
      setMetrics({
        llmEmbedding: llmVector,
        ganLatent: ganVector,
        cosineDistance: cosine,
        alignmentScore: score
      });
      setAlignment(score);
      setStatus(score > 0.7 ? 'aligned' : 'misaligned');
    }, 1200);
  };

  const calculateCosineDistance = (a, b) => {
    if (!a.length || !b.length) return 1;
    
    const dotProduct = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 1;
    
    const similarity = dotProduct / (magnitudeA * magnitudeB);
    return 1 - similarity;
  };

  const getStatusColor = () => {
    if (status === 'aligned') return '#10b981';
    if (status === 'misaligned') return '#ef4444';
    if (status === 'aligning') return theme.primary;
    return theme.text + '40';
  };

  const getStatusIcon = () => {
    if (status === 'aligned') return CheckCircle;
    if (status === 'misaligned') return AlertCircle;
    if (status === 'aligning') return Activity;
    return Network;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="h-full flex flex-col p-6" style={{ backgroundColor: theme.background }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3" style={{ color: theme.text }}>
          <Network className="w-6 h-6" style={{ color: theme.primary }} />
          Semantic Bridge
        </h2>
        <p className="text-sm" style={{ color: theme.text + '80' }}>
          LLM ↔ GAN alignment and latent space synchronization
        </p>
      </div>

      {/* Status Card */}
      <div className="mb-6 border rounded-lg p-6" style={{ 
        backgroundColor: theme.secondary,
        borderColor: getStatusColor() + '50'
      }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: getStatusColor() + '20' }}>
            <StatusIcon className="w-8 h-8" style={{ color: getStatusColor() }} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg capitalize" style={{ color: theme.text }}>
              {status === 'idle' ? 'Awaiting Data' : status}
            </h3>
            <p className="text-sm" style={{ color: theme.text + '80' }}>
              {status === 'aligning' && 'Synchronizing vector spaces...'}
              {status === 'aligned' && 'LLM and GAN are in sync'}
              {status === 'misaligned' && 'Vectors need adjustment'}
              {status === 'idle' && 'Provide field vector and visual output'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold" style={{ color: getStatusColor() }}>
              {(alignment * 100).toFixed(0)}%
            </div>
            <div className="text-xs" style={{ color: theme.text + '60' }}>Alignment</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000"
            style={{ 
              backgroundColor: getStatusColor(),
              width: `${alignment * 100}%`
            }}
          />
        </div>
      </div>

      {/* Metrics */}
      {metrics.cosineDistance !== null && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="border rounded-lg p-4" style={{ 
            backgroundColor: theme.secondary,
            borderColor: theme.primary + '30'
          }}>
            <div className="text-xs mb-2" style={{ color: theme.text + '60' }}>LLM Embedding</div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4" style={{ color: '#8b5cf6' }} />
              <span className="text-sm font-bold" style={{ color: theme.text }}>Vector Space</span>
            </div>
            <div className="font-mono text-xs p-2 rounded" style={{ 
              backgroundColor: theme.background,
              color: '#8b5cf6'
            }}>
              [{metrics.llmEmbedding?.slice(0, 8).map(v => typeof v === 'number' ? v.toFixed(3) : v).join(', ')}]
            </div>
          </div>

          <div className="border rounded-lg p-4" style={{ 
            backgroundColor: theme.secondary,
            borderColor: theme.primary + '30'
          }}>
            <div className="text-xs mb-2" style={{ color: theme.text + '60' }}>GAN Latent Space</div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4" style={{ color: '#ec4899' }} />
              <span className="text-sm font-bold" style={{ color: theme.text }}>Latent Vector</span>
            </div>
            <div className="font-mono text-xs p-2 rounded" style={{ 
              backgroundColor: theme.background,
              color: '#ec4899'
            }}>
              [{metrics.ganLatent?.slice(0, 8).map(v => typeof v === 'number' ? v.toFixed(3) : v).join(', ')}]
            </div>
          </div>

          <div className="border rounded-lg p-4" style={{ 
            backgroundColor: theme.secondary,
            borderColor: theme.primary + '30'
          }}>
            <div className="text-xs mb-3" style={{ color: theme.text + '60' }}>Alignment Metrics</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: theme.text }}>Cosine Distance</span>
                <span className="font-mono font-bold" style={{ color: '#06b6d4' }}>
                  {metrics.cosineDistance.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: theme.text }}>Similarity Score</span>
                <span className="font-mono font-bold" style={{ color: '#10b981' }}>
                  {metrics.alignmentScore.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: theme.text }}>Bridge Status</span>
                <span className="font-bold" style={{ color: getStatusColor() }}>
                  {status === 'aligned' ? 'SYNCED' : status === 'aligning' ? 'SYNCING' : 'IDLE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {metrics.cosineDistance === null && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Network className="w-16 h-16 mx-auto mb-4" style={{ color: theme.text + '20' }} />
            <p className="text-sm" style={{ color: theme.text + '40' }}>
              Send data from Field Parser and Visual Engine to see alignment
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

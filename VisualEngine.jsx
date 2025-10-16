import { useState, useRef, useEffect } from 'react';
import { Eye, Zap, Download, RefreshCw } from 'lucide-react';

export default function VisualEngine({ theme, semanticVector, onGenerate }) {
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (semanticVector) {
      setPrompt(semanticVector.input);
      generateVisual(semanticVector);
    }
  }, [semanticVector]);

  const generateVisual = async (vector) => {
    setGenerating(true);
    
    try {
      const promptText = vector?.input || prompt;
      
      // Call our secure backend API for AI image generation
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const { image: base64Image } = await response.json();
      
      setImage(base64Image);
      setGenerating(false);
      
      if (onGenerate) {
        onGenerate({
          image: base64Image,
          latent: vector?.vector || [],
          aiPowered: true,
          timestamp: Date.now()
        });
      }
      
    } catch (error) {
      console.error('AI image generation error:', error);
      
      // Fallback to canvas-based generation if API fails
      const canvas = canvasRef.current;
      if (!canvas) {
        setGenerating(false);
        return;
      }
      
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, width, height);

      const vectorValues = vector?.vector || Array.from({ length: 8 }, () => Math.random());
      
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `hsl(${vectorValues[0] * 360}, 70%, 50%)`);
      gradient.addColorStop(0.5, `hsl(${vectorValues[1] * 360}, 70%, 40%)`);
      gradient.addColorStop(1, `hsl(${vectorValues[2] * 360}, 70%, 30%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 50; i++) {
        const x = vectorValues[3] * width + Math.random() * width * 0.5;
        const y = vectorValues[4] * height + Math.random() * height * 0.5;
        const radius = vectorValues[5] * 100 + 20;
        const alpha = vectorValues[6] * 0.5 + 0.1;

        ctx.beginPath();
        ctx.arc(x % width, y % height, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      const imageData = canvas.toDataURL();
      setImage(imageData);
      setGenerating(false);
      
      if (onGenerate) {
        onGenerate({
          image: imageData,
          latent: vectorValues,
          aiPowered: false,
          error: error.message,
          timestamp: Date.now()
        });
      }
    }
  };

  const handleGenerate = () => {
    const mockVector = {
      input: prompt,
      vector: Array.from({ length: 8 }, () => Math.random())
    };
    generateVisual(mockVector);
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.download = 'generated-visual.png';
    link.href = image;
    link.click();
  };

  return (
    <div className="h-full flex flex-col p-6" style={{ backgroundColor: theme.background }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3" style={{ color: theme.text }}>
          <Eye className="w-6 h-6" style={{ color: theme.primary }} />
          Visual Engine
        </h2>
        <p className="text-sm" style={{ color: theme.text + '80' }}>
          Generate visuals from semantic field vectors (GAN placeholder)
        </p>
      </div>

      <div className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to visualize..."
          className="w-full h-20 p-4 rounded-lg border resize-none outline-none"
          style={{
            backgroundColor: theme.secondary,
            color: theme.text,
            borderColor: theme.primary + '30'
          }}
        />
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || generating}
          className="flex-1 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition disabled:opacity-30"
          style={{ 
            backgroundColor: theme.primary,
            color: theme.background 
          }}
        >
          {generating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate Visual
            </>
          )}
        </button>
        
        {image && (
          <button
            onClick={downloadImage}
            className="px-6 py-3 rounded-lg border font-bold flex items-center gap-2"
            style={{ 
              borderColor: theme.primary,
              color: theme.primary
            }}
          >
            <Download className="w-5 h-5" />
            Download
          </button>
        )}
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden" style={{ borderColor: theme.primary + '30' }}>
        {image ? (
          <img src={image} alt="Generated" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: theme.secondary }}>
            <div className="text-center">
              <Eye className="w-16 h-16 mx-auto mb-4" style={{ color: theme.text + '20' }} />
              <p className="text-sm" style={{ color: theme.text + '40' }}>
                Generated visuals will appear here
              </p>
            </div>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="hidden"
        />
      </div>
    </div>
  );
}

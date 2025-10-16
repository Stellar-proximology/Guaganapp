import express from 'express';
import cors from 'cors';
import { ResonanceGraph } from './ResonanceGraph.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const resonanceGraph = new ResonanceGraph();

// Hugging Face API endpoints
app.post('/api/text-embedding', async (req, res) => {
  try {
    const { text } = req.body;
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    // Hugging Face returns a 2D array, flatten it to 1D array of floats
    let embedding;
    if (Array.isArray(data) && Array.isArray(data[0])) {
      // It's a 2D array, take the first row
      embedding = data[0];
    } else if (Array.isArray(data)) {
      embedding = data;
    } else {
      embedding = data.embedding || [];
    }
    res.json({ embedding });
  } catch (error) {
    console.error('Text embedding error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
    
    res.json({ image: base64Image });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ResonanceGraph API endpoints
app.post('/api/resonance/add-concept', async (req, res) => {
  try {
    const { label, text } = req.body;
    console.log('Adding concept:', label);

    let vector = null;
    if (text) {
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      if (apiKey) {
        const response = await fetch(
          'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: text }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && Array.isArray(data[0])) {
            vector = data[0];
          }
        }
      }
    }

    const id = resonanceGraph.addConcept(label, vector);
    res.json({ id, label, success: true });
  } catch (error) {
    console.error('Add concept error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/resonance/connect', (req, res) => {
  try {
    const { sourceId, targetId, weight } = req.body;
    console.log('Connecting concepts:', sourceId, '->', targetId);
    
    resonanceGraph.connect(sourceId, targetId, weight || 1.0);
    res.json({ success: true });
  } catch (error) {
    console.error('Connect error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/resonance/feedback', (req, res) => {
  try {
    const { sourceId, targetId, feedback } = req.body;
    console.log('Applying feedback:', sourceId, '->', targetId, '=', feedback);
    
    resonanceGraph.feedback(sourceId, targetId, feedback);
    res.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/resonance/find', async (req, res) => {
  try {
    const { text, topK } = req.body;
    console.log('Finding resonant concepts for:', text);

    let queryVector = null;
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    
    if (apiKey && text) {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          queryVector = data[0];
        }
      }
    }

    const results = queryVector 
      ? resonanceGraph.findResonant(queryVector, topK || 5)
      : [];
    
    res.json({ results });
  } catch (error) {
    console.error('Find resonant error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/resonance/stats', (req, res) => {
  try {
    const stats = resonanceGraph.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/resonance/graph', (req, res) => {
  try {
    const graph = resonanceGraph.toJSON();
    res.json(graph);
  } catch (error) {
    console.error('Get graph error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/resonance/load', (req, res) => {
  try {
    const { graph } = req.body;
    resonanceGraph.fromJSON(graph);
    res.json({ success: true });
  } catch (error) {
    console.error('Load graph error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
  console.log('ResonanceGraph initialized and ready');
});

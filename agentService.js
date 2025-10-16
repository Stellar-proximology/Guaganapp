import { hfService } from './huggingfaceService';

export class AgentService {
  constructor() {
    this.llmAvailable = false;
  }

  initialize(apiKey) {
    hfService.initialize(apiKey);
    this.llmAvailable = true;
  }

  async buildAgent(template, skillLevel, userDescription = '') {
    const templates = {
      'Chat Agent': {
        code: `// AI Chat Agent
class ChatAgent {
  constructor(apiKey) {
    this.messages = [];
    this.apiKey = apiKey;
  }

  async chat(userMessage) {
    this.messages.push({ role: 'user', content: userMessage });
    
    // Call your AI API here
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${this.apiKey}\`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: this.messages
      })
    });
    
    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;
    this.messages.push({ role: 'assistant', content: assistantMessage });
    
    return assistantMessage;
  }
}

// Usage
const agent = new ChatAgent('your-api-key');
const response = await agent.chat('Hello, how are you?');
console.log(response);`,
        description: 'A simple chat agent that uses AI to respond to messages'
      },
      'Task Agent': {
        code: `// Task Automation Agent
class TaskAgent {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push({ ...task, status: 'pending', id: Date.now() });
  }

  async executeTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = 'running';
    
    // Execute task based on type
    try {
      if (task.type === 'web_scrape') {
        await this.scrapePage(task.url);
      } else if (task.type === 'data_process') {
        await this.processData(task.data);
      }
      
      task.status = 'completed';
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
    }
  }

  async scrapePage(url) {
    const response = await fetch(url);
    const html = await response.text();
    return html;
  }

  async processData(data) {
    // Process data here
    return data.map(item => item.value * 2);
  }
}

const agent = new TaskAgent();
agent.addTask({ type: 'web_scrape', url: 'https://example.com' });`,
        description: 'An agent that can automate tasks like web scraping and data processing'
      },
      'Particle Game': {
        code: `// Particle Game
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const particles = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.color = \`hsl(\${Math.random() * 360}, 70%, 60%)\`;
    this.size = Math.random() * 5 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let i = 0; i < 100; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

animate();`,
        description: 'An interactive particle system game'
      },
      'Landing Page': {
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Landing Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .container {
      text-align: center;
      max-width: 800px;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: fadeIn 1s;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    .cta {
      display: inline-block;
      padding: 1rem 2rem;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 50px;
      font-weight: bold;
      transition: transform 0.3s;
    }
    .cta:hover {
      transform: scale(1.05);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Your Landing Page</h1>
    <p>Build amazing things with our platform. Get started today!</p>
    <a href="#" class="cta">Get Started</a>
  </div>
</body>
</html>`,
        description: 'A beautiful landing page with gradient background'
      },
      'Interactive Chart': {
        code: `// Interactive Data Chart
const canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 400;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const data = [30, 50, 70, 40, 90, 60, 80];
const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function drawChart() {
  const barWidth = canvas.width / data.length;
  const maxValue = Math.max(...data);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * (canvas.height - 50);
    const x = index * barWidth;
    const y = canvas.height - barHeight - 30;

    ctx.fillStyle = \`hsl(\${index * 50}, 70%, 60%)\`;
    ctx.fillRect(x + 5, y, barWidth - 10, barHeight);

    ctx.fillStyle = 'black';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[index], x + barWidth / 2, canvas.height - 10);
    ctx.fillText(value, x + barWidth / 2, y - 5);
  });
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const barIndex = Math.floor(x / (canvas.width / data.length));
  data[barIndex] = Math.random() * 100;
  drawChart();
});

drawChart();`,
        description: 'An interactive bar chart you can click to update'
      }
    };

    // If beginner mode and LLM available, enhance with AI
    if (skillLevel === 'beginner' && this.llmAvailable && userDescription) {
      try {
        const prompt = `Generate code for: ${userDescription}. Based on this template: ${template}`;
        const aiCode = await hfService.generateText(prompt);
        return {
          code: aiCode,
          description: `AI-generated ${template} based on: ${userDescription}`,
          template
        };
      } catch (error) {
        console.error('AI generation failed, using template:', error);
      }
    }

    return templates[template] || templates['Chat Agent'];
  }

  async generateFromDescription(description, skillLevel) {
    if (!this.llmAvailable) {
      return {
        error: 'AI not available. Please set up your API key in settings.',
        code: '// Please configure AI API key to generate code'
      };
    }

    const prompt = `You are a code generator. Generate complete, working code for: ${description}
    
Make it beginner-friendly and well-commented. Include HTML/CSS/JS as needed.`;

    try {
      const code = await hfService.generateText(prompt);
      return {
        code,
        description,
        success: true
      };
    } catch (error) {
      return {
        error: error.message,
        code: '// Error generating code: ' + error.message
      };
    }
  }
}

export const agentService = new AgentService();

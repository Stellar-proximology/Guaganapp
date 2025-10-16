import { HfInference } from '@huggingface/inference';

class HuggingFaceService {
  constructor() {
    this.hf = null;
    this.apiKey = null;
  }

  initialize(apiKey) {
    this.apiKey = apiKey;
    this.hf = new HfInference(apiKey);
  }

  async generateText(prompt, model = 'microsoft/Phi-3-mini-4k-instruct') {
    if (!this.hf) {
      throw new Error('HuggingFace not initialized. Please provide API key.');
    }

    try {
      const response = await this.hf.textGeneration({
        model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          top_p: 0.95,
        }
      });

      return response.generated_text;
    } catch (error) {
      console.error('LLM Generation Error:', error);
      throw error;
    }
  }

  async generateImage(prompt, model = 'stabilityai/stable-diffusion-2-1') {
    if (!this.hf) {
      throw new Error('HuggingFace not initialized. Please provide API key.');
    }

    try {
      const blob = await this.hf.textToImage({
        model,
        inputs: prompt,
        parameters: {
          negative_prompt: 'blurry, low quality',
        }
      });

      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('GAN Generation Error:', error);
      throw error;
    }
  }

  async processWithConsciousness(input, dimension) {
    const consciousnessPrompt = `
You are a consciousness field processor operating in the ${dimension} dimension.
Process this input through the lens of "${dimension}":
Input: ${input}

Respond with dimensional interpretation:`;

    return await this.generateText(consciousnessPrompt);
  }
}

export const hfService = new HuggingFaceService();

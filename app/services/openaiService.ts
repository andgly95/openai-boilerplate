// services/openaiService.ts

import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  async generateChatCompletion(
    messages: ChatCompletionMessageParam[]
  ): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("Error generating chat completion:", error);
      throw error;
    }
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      return response.data[0].url || "";
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }

  async createEmbedding(input: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: input,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error("Error creating embedding:", error);
      throw error;
    }
  }

  async transcribeAudio(audioFile: File): Promise<string> {
    try {
      const response = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
      });

      return response.text;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw error;
    }
  }

  // Add more methods for other OpenAI API functionalities as needed
}

export const openAIService = new OpenAIService();

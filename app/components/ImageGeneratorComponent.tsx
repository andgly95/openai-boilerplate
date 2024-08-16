"use client";

import React, { useState } from "react";
import { openAIService } from "../services/openaiService";

export const ImageGeneratorComponent: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const url = await openAIService.generateImage(prompt);
      setImageUrl(url);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter image description"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {isLoading ? "Generating..." : "Generate Image"}
        </button>
      </form>
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Generated" className="w-full rounded" />
        </div>
      )}
    </div>
  );
};

"use client";
import React, { useState, useEffect } from "react";
import { openAIService } from "../services/openaiService";

const GuessAIGame = () => {
  const [gameState, setGameState] = useState("input"); // 'input', 'guessing', 'results'
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [guess, setGuess] = useState("");
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const players = [
    { name: "Kevin", score: 140 },
    { name: "Alex", score: 125 },
    { name: "Michael", score: 85 },
    { name: "Pete", score: 25 },
  ];

  useEffect(() => {
    let interval;
    if (gameState === "guessing" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timer]);

  const handlePromptSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const imageUrl = await openAIService.generateImage(prompt);
      setGeneratedImage(imageUrl);
      setGameState("guessing");
      setTimer(30);
    } catch (error) {
      console.error("Error generating image:", error);
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuessSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const promptEmbedding = await openAIService.createEmbedding(prompt);
      const guessEmbedding = await openAIService.createEmbedding(guess);
      const similarity = calculateCosineSimilarity(
        promptEmbedding,
        guessEmbedding
      );
      const calculatedScore = Math.round(similarity * 100);
      setScore(calculatedScore);
      setGameState("results");
    } catch (error) {
      console.error("Error processing guess:", error);
      setError("Failed to process guess. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCosineSimilarity = (
    vec1: number[],
    vec2: number[]
  ): number => {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitude1 * magnitude2);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">GUESS AI</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>
        )}

        {gameState === "input" && (
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8 flex-shrink-0">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-6xl font-bold">?</span>
              </div>
            </div>
            <div className="flex-grow w-full md:w-auto">
              <p className="text-xl mb-4">Unleash Your Creativity 🎨</p>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your prompt here"
                className="w-full p-3 rounded bg-gray-800 text-white mb-2"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-400 mb-4">
                Describe a scene, object, or concept you'd like to see
                AI-generated art of. Be descriptive!
              </p>
              <button
                onClick={handlePromptSubmit}
                disabled={isLoading || !prompt.trim()}
                className="w-full py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300 disabled:bg-gray-600"
              >
                {isLoading ? "Generating..." : "Bring Your Imagination to Life"}
              </button>
            </div>
          </div>
        )}

        {gameState === "guessing" && (
          <div>
            <div className="flex justify-between mb-6">
              {players.map((player, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gray-700 rounded-full mx-auto mb-2"></div>
                  <div className="text-sm">{player.name}</div>
                  <div className="text-sm font-bold">{player.score}</div>
                </div>
              ))}
            </div>
            <div className="mb-6 flex justify-center">
              <img
                src={generatedImage}
                alt="AI Generated"
                className="rounded-lg max-w-full h-auto"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>
            <p className="text-xl mb-4">Can you guess the prompt?</p>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type your guess here"
              className="w-full p-3 rounded bg-gray-800 text-white mb-4"
              disabled={isLoading}
            />
            <button
              onClick={handleGuessSubmit}
              disabled={isLoading || !guess.trim()}
              className="w-full py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300 disabled:bg-gray-600"
            >
              {isLoading ? "Processing..." : "Make Your Guess!"}
            </button>
          </div>
        )}

        {gameState === "results" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Results</h2>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 md:pr-4 mb-6 md:mb-0">
                <p className="mb-2">Original prompt</p>
                <div className="relative">
                  <img
                    src={generatedImage}
                    alt="AI Generated"
                    className="w-full rounded-lg opacity-50"
                    style={{ maxHeight: "300px", objectFit: "contain" }}
                  />
                  <p className="absolute inset-0 flex items-center justify-center text-center font-bold p-4">
                    {prompt}
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 md:pl-4">
                <p className="mb-2">You guessed</p>
                <div className="bg-gray-800 p-4 rounded mb-4">
                  <p className="mb-2">{guess}</p>
                  <div className="flex items-center">
                    <div className="flex-grow bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-green-500 rounded-full h-4"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 font-bold text-2xl">{score}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setGameState("input");
                    setPrompt("");
                    setGuess("");
                    setScore(0);
                    setGeneratedImage("");
                  }}
                  className="w-full py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300"
                >
                  Start Next Round
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed top-4 right-4">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl font-bold">
          {timer}s
        </div>
      </div>
    </div>
  );
};

export default GuessAIGame;

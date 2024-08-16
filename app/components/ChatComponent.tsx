"use client";

import React, { useState } from "react";
import { openAIService } from "../services/openaiService";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: ChatCompletionMessageParam = {
      role: "user",
      content: input,
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await openAIService.generateChatCompletion(newMessages);
      const assistantMessage: ChatCompletionMessageParam = {
        role: "assistant",
        content: response,
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-gray-100 p-4 h-96 overflow-y-auto mb-4 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded ${
                msg.role === "user" ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {typeof msg.content === "string"
                ? msg.content
                : JSON.stringify(msg.content)}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border border-gray-300 rounded-l"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

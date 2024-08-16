import Image from "next/image";
import { ChatComponent } from "./components/ChatComponent";
import { ImageGeneratorComponent } from "./components/ImageGeneratorComponent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">OpenAI API Demo</h1>
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Chat</h2>
        <ChatComponent />
        <h2 className="text-2xl font-semibold mb-4 mt-8">Image Generation</h2>
        <ImageGeneratorComponent />
      </div>
    </main>
  );
}

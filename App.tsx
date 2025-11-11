
import React from 'react';
import TranscriptionPanel from './components/TranscriptionPanel';
import TtsPanel from './components/TtsPanel';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <LogoIcon className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Gemini Audio Studio
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Transcribe audio & video, and generate speech with the power of AI.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <TranscriptionPanel />
          <TtsPanel />
        </main>
        
        <footer className="text-center mt-16 text-gray-500 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;

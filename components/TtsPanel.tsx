
import React, { useState, useCallback, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { Spinner } from './Spinner';
import { SpeakerIcon } from './icons';

const TtsPanel: React.FC = () => {
  const [text, setText] = useState<string>('Hello! I am a friendly AI assistant powered by Gemini. Have a wonderful day!');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleSpeak = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to speak.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!audioContextRef.current) {
         audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const audioContext = audioContextRef.current;
      
      const base64Audio = await generateSpeech(text);
      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();

    } catch (err) {
      console.error('TTS error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during speech generation.');
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <SpeakerIcon className="w-7 h-7 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Text-to-Speech</h2>
      </div>
      <p className="text-gray-400 mb-6">Type some text and hear it spoken by a Gemini voice.</p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        className="w-full h-40 p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
      />
      
      <div className="mt-6">
        <button
          onClick={handleSpeak}
          disabled={!text.trim() || isLoading}
          className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
        >
          {isLoading ? <><Spinner /> Generating...</> : 'Speak It'}
        </button>
      </div>
      
      {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
    </div>
  );
};

export default TtsPanel;

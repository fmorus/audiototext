
import React, { useState, useCallback } from 'react';
import { transcribeAudio } from '../services/geminiService';
import FileUploader from './FileUploader';
import { Spinner } from './Spinner';
import { CopyIcon, MicrophoneIcon } from './icons';

const TranscriptionPanel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setTranscription('');
    setError(null);
  };

  const handleTranscribe = useCallback(async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranscription('');

    try {
      const result = await transcribeAudio(file);
      setTranscription(result);
    } catch (err) {
      console.error('Transcription error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during transcription.');
    } finally {
      setIsLoading(false);
    }
  }, [file]);
  
  const copyToClipboard = () => {
    if(transcription) {
      navigator.clipboard.writeText(transcription);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <MicrophoneIcon className="w-7 h-7 text-cyan-400" />
        <h2 className="text-2xl font-bold text-white">Transcribe Audio / Video</h2>
      </div>
      <p className="text-gray-400 mb-6">Upload an audio or video file to get a text transcription.</p>
      
      <FileUploader onFileSelect={handleFileSelect} accept="audio/*,video/*" />

      {file && (
        <div className="mt-4 text-center text-gray-300">
          <p>Selected file: <span className="font-semibold text-cyan-400">{file.name}</span></p>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleTranscribe}
          disabled={!file || isLoading}
          className="w-full flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
        >
          {isLoading ? <><Spinner /> Transcribing...</> : 'Transcribe File'}
        </button>
      </div>

      {error && <p className="mt-4 text-red-400 text-center">{error}</p>}

      {transcription && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">Transcription Result:</h3>
            <button onClick={copyToClipboard} className="text-gray-400 hover:text-white transition-colors p-1 rounded-md">
                <CopyIcon className="w-5 h-5"/>
            </button>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 max-h-60 overflow-y-auto">
            <p className="text-gray-300 whitespace-pre-wrap">{transcription}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionPanel;

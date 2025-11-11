
import { GoogleGenAI, Modality } from "@google/genai";
import { fileToBase64 } from "../utils/audioUtils";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const transcribeAudio = async (file: File): Promise<string> => {
  const base64Data = await fileToBase64(file);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { text: 'Please transcribe the following audio file.' },
        { inlineData: { data: base64Data, mimeType: file.type } }
      ]
    },
  });

  return response.text;
};

export const generateSpeech = async (text: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say with a clear and friendly tone: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
        throw new Error("Could not generate audio from the provided text.");
    }
    
    return base64Audio;
};

'use client'

import React, {createContext, useState, useEffect, ReactNode} from 'react';

interface SpeechOptions {
  interrupt?: boolean;
  rate?: number;
  pitch?: number;
  lang?: string;
  onstart?: () => void;
  onend?: () => void;
  onerror?: () => void;
}

interface TTSApi {
  currentVoice: SpeechSynthesisVoice | null;
  currentSpeed: number;
  currentPitch: number;
  setVoice: (voice: SpeechSynthesisVoice | null) => void;
  getVoices: () => SpeechSynthesisVoice[];
  shutUp: () => void;
  speech: (text: string, options?: SpeechOptions) => void;
}

interface SpeechSynthesisProviderProps {
  children: ReactNode;
}

export const SpeechSynthesisContext = createContext<TTSApi | undefined>(undefined);

export const SpeechSynthesisProvider: React.FC<SpeechSynthesisProviderProps> = ({children}) => {
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState(1.0);
  const [currentPitch, setCurrentPitch] = useState(1.0);

  useEffect(() => {
    const synth = window.speechSynthesis;
    setSynth(synth);

    const initSynth = () => {
      const voices = synth.getVoices().sort((a, b) => {
        const a_sort = a.lang.toUpperCase();
        const b_sort = b.lang.toUpperCase();
        if (a_sort < b_sort) {
          return -1;
        } else if (a_sort == b_sort) {
          return 0;
        } else {
          return +1;
        }
      });
      setVoices(voices);
    };
    initSynth();

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = initSynth;
    }
  }, []);

  const shutUp = () => {
    synth?.cancel();
  };

  const speech = (text: string, options?: SpeechOptions) => {
    if (!text) throw new Error('no speech content specified.');
    if (!synth) throw new Error('speechSynthesis is not available now.');
    if (options?.interrupt) shutUp();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || currentSpeed;
    utterance.pitch = options?.pitch || currentPitch;
    utterance.voice = selectedVoice || null;
    if (!selectedVoice) utterance.lang = options?.lang || 'en-US';
    if (options?.onstart) utterance.onstart = options.onstart;
    if (options?.onend) utterance.onend = options.onend;
    if (options?.onerror) utterance.onerror = options.onerror;

    synth.speak(utterance);
  };

  return (
    <SpeechSynthesisContext.Provider
      value={{
        currentVoice: selectedVoice,
        currentSpeed,
        currentPitch,
        setVoice: setSelectedVoice,
        getVoices: () => voices,
        shutUp,
        speech,
      }}
    >
      {children}
    </SpeechSynthesisContext.Provider>
  );
};
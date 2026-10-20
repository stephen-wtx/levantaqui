'use client';

import React, { useState, useEffect, useRef } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [showText, setShowText] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textShownTimeRef = useRef<number>(0);
  const hasTriggeredExitRef = useRef<boolean>(false);

  const startExitTransition = () => {
    if (hasTriggeredExitRef.current) return;
    hasTriggeredExitRef.current = true;
    setIsExiting(true);
    // Tempo da transição de saída suave (700ms)
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  useEffect(() => {
    // Verificar se o utilizador prefere movimento reduzido
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Se preferir movimento reduzido, fazer transição rápida e direta
      const timer = setTimeout(() => {
        startExitTransition();
      }, 1500);
      return () => clearTimeout(timer);
    }

    // Tentar reproduzir o vídeo
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback caso autoplay seja bloqueado pelo browser
      });
    }

    // FASE 2: Apresentar o texto após o momento inicial do vídeo (~1.1s)
    const textTimer = setTimeout(() => {
      setShowText(true);
      textShownTimeRef.current = Date.now();
    }, 1100);

    // Timeout de segurança global para garantir que o dashboard é sempre apresentado (~4.8s)
    const maxSafetyTimer = setTimeout(() => {
      startExitTransition();
    }, 4800);

    // Permitir sair com tecla Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        startExitTransition();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(maxSafetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Quando o vídeo termina naturalmente
  const handleVideoEnded = () => {
    // Assegurar pelo menos 1.6s de leitura do texto após a sua aparição
    const timeSinceText = Date.now() - textShownTimeRef.current;
    const remainingReadingTime = Math.max(0, 1600 - timeSinceText);

    setTimeout(() => {
      startExitTransition();
    }, remainingReadingTime);
  };

  // Se o vídeo falhar ao carregar, não quebrar a experiência
  const handleVideoError = () => {
    setShowText(true);
    setTimeout(() => {
      startExitTransition();
    }, 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Apresentação LEVANTAQUI"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-white text-gray-900 transition-opacity duration-700 ease-out select-none ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Botão discreto para saltar a intro se desejado */}
      <div className="w-full max-w-6xl mx-auto px-6 pt-6 sm:pt-8 flex justify-end">
        <button
          onClick={startExitTransition}
          type="button"
          className="text-xs sm:text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#D1005D]/30 cursor-pointer"
        >
          Saltar
        </button>
      </div>

      {/* Conteúdo central: Vídeo (Elemento Principal) + Texto elegante */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center -mt-8 sm:-mt-10">
        {/* FASE 1: Vídeo da Intro */}
        <div className="w-full flex items-center justify-center max-w-[320px] sm:max-w-[460px] md:max-w-[560px]">
          <video
            ref={videoRef}
            src="/video/intro.webm"
            autoPlay
            muted
            playsInline
            controls={false}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className="w-full h-auto max-h-[46vh] sm:max-h-[50vh] object-contain rounded-2xl"
          />
        </div>

        {/* FASE 2: Apresentação do Texto com animação fluida */}
        <div
          className={`mt-6 sm:mt-8 text-center transition-all duration-700 ease-out transform ${
            showText
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
            Saiba onde levantar<span className="text-[#D1005D]">.</span>
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500 font-normal max-w-md sm:max-w-lg mx-auto leading-relaxed">
            Consulte a disponibilidade dos ATMs e Serviços BIM mais próximos.
          </p>
        </div>
      </div>

      {/* Espaço inferior de respiro para garantir equilíbrio visual com o topo */}
      <div className="w-full pb-6 sm:pb-8" />
    </div>
  );
}

import { GenerationMode } from '../types';
import { File as FileEdit, Sparkles } from 'lucide-react';

interface ModeSelectorProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-4 justify-center mb-8">
      <button
        onClick={() => onModeChange('form')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          mode === 'form'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        <FileEdit className="w-5 h-5" />
        Modo Formulário
      </button>
      <button
        onClick={() => onModeChange('ai')}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          mode === 'ai'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        Modo IA
      </button>
    </div>
  );
}

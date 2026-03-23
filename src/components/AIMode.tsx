import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AIModeProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export function AIMode({ onGenerate, isGenerating }: AIModeProps) {
  const [prompt, setPrompt] = useState('');

  const examples = [
    'API REST de tarefas em Node com autenticação JWT',
    'App de lista de compras com React e LocalStorage',
    'Bot do Discord em Python com comandos customizados',
    'Site de portfólio responsivo com animações',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">
          Descreva seu projeto e deixe a IA fazer o resto
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descrição do Projeto
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-32 resize-none"
            placeholder="Ex: API REST de gerenciamento de tarefas em Node.js com autenticação JWT, banco de dados PostgreSQL e testes automatizados..."
            required
          />
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Exemplos:</p>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(example)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              Gerando com IA...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Gerar README com IA
            </>
          )}
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-400">
          💡 Dica: Seja específico sobre tecnologias, funcionalidades e objetivos do seu projeto para obter melhores resultados.
        </p>
      </div>
    </div>
  );
}

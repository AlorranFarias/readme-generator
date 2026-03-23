import { useState } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { FormMode } from './components/FormMode';
import { AIMode } from './components/AIMode';
import { ReadmePreview } from './components/ReadmePreview';
import { GenerationMode, ProjectInfo } from './types';
import { generateReadme } from './utils/readmeGenerator';
import { generateReadmeWithAI } from './services/aiService';

function App() {
  const [mode, setMode] = useState<GenerationMode>('form');
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFormGenerate = (projectInfo: ProjectInfo) => {
    setIsGenerating(true);
    setError('');

    setTimeout(() => {
      const content = generateReadme(projectInfo);
      setReadmeContent(content);
      setIsGenerating(false);
    }, 500);
  };

  const handleAIGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setError('');

    try {
      const projectInfo = await generateReadmeWithAI(prompt);
      const content = generateReadme(projectInfo);
      setReadmeContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao gerar README:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setReadmeContent('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {!readmeContent ? (
          <>
            <ModeSelector mode={mode} onModeChange={setMode} />

            <div className="max-w-4xl mx-auto">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                  {error}
                </div>
              )}

              {mode === 'form' ? (
                <FormMode onGenerate={handleFormGenerate} isGenerating={isGenerating} />
              ) : (
                <AIMode onGenerate={handleAIGenerate} isGenerating={isGenerating} />
              )}
            </div>
          </>
        ) : (
          <div className="max-w-6xl mx-auto">
            <ReadmePreview content={readmeContent} onReset={handleReset} />
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          README Pro - Gere documentação profissional em segundos
        </div>
      </footer>
    </div>
  );
}

export default App;

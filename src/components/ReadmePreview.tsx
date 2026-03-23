import { useState } from 'react';
import { Copy, Download, RotateCcw, Check } from 'lucide-react';
import { downloadReadme, copyToClipboard } from '../utils/readmeGenerator';

interface ReadmePreviewProps {
  content: string;
  onReset: () => void;
}

export function ReadmePreview({ content, onReset }: ReadmePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadReadme(content);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Preview do README</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
          >
            {showRaw ? 'Preview' : 'Código'}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Baixar
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Nova
          </button>
        </div>
      </div>

      <div className="p-6 overflow-auto max-h-[600px]">
        {showRaw ? (
          <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            {content}
          </pre>
        ) : (
          <div className="prose prose-invert max-w-none readme-preview">
            {content.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-4xl font-bold text-white mb-4">
                    {line.substring(2)}
                  </h1>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
                    {line.substring(3)}
                  </h2>
                );
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-white mt-6 mb-3">
                    {line.substring(4)}
                  </h3>
                );
              }
              if (line.startsWith('- ')) {
                return (
                  <li key={index} className="text-gray-300 ml-4">
                    {line.substring(2)}
                  </li>
                );
              }
              if (line.startsWith('![')) {
                const match = line.match(/!\[([^\]]+)\]\(([^)]+)\)/);
                if (match) {
                  return (
                    <img
                      key={index}
                      src={match[2]}
                      alt={match[1]}
                      className="inline-block mr-2 mb-2"
                    />
                  );
                }
              }
              if (line.startsWith('```')) {
                return null;
              }
              if (line.trim() === '') {
                return <br key={index} />;
              }
              if (line.startsWith('---')) {
                return <hr key={index} className="my-6 border-gray-700" />;
              }
              return (
                <p key={index} className="text-gray-300 mb-2">
                  {line}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

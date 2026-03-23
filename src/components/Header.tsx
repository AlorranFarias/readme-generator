import { FileText } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 justify-center">
          <FileText className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">README Pro</h1>
            <p className="text-gray-400 text-sm">Gere READMEs profissionais em segundos</p>
          </div>
        </div>
      </div>
    </header>
  );
}

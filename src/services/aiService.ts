import { ProjectInfo } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function generateReadmeWithAI(prompt: string): Promise<ProjectInfo> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-readme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Erro ao gerar README');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw new Error('Não foi possível gerar o README. Tente novamente.');
  }
}

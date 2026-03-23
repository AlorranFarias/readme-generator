const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  prompt: string;
}

interface ProjectInfo {
  name: string;
  description: string;
  technologies: string[];
  features: string[];
  installation: string;
  usage: string;
  license: string;
  author: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { prompt }: RequestBody = await req.json();

    if (!prompt || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Prompt é obrigatório" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const projectInfo = await generateProjectInfo(prompt);

    return new Response(
      JSON.stringify(projectInfo),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao gerar README:", error);

    return new Response(
      JSON.stringify({
        error: "Erro ao processar requisição",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

async function generateProjectInfo(prompt: string): Promise<ProjectInfo> {
  const openaiKey = Deno.env.get("OPENAI_API_KEY");

  if (openaiKey) {
    try {
      return await generateWithOpenAI(prompt, openaiKey);
    } catch (error) {
      console.error("Erro ao usar OpenAI, usando fallback:", error);
      return generateFallback(prompt);
    }
  }

  return generateFallback(prompt);
}

async function generateWithOpenAI(prompt: string, apiKey: string): Promise<ProjectInfo> {
  const systemPrompt = `Você é um assistente especializado em criar informações estruturadas para arquivos README.md profissionais.
Baseado na descrição do projeto fornecida, extraia e organize as seguintes informações em formato JSON:
- name: nome do projeto (curto e descritivo)
- description: descrição clara e profissional (1-2 frases)
- technologies: array de tecnologias principais usadas
- features: array de funcionalidades principais (3-6 itens)
- installation: comandos de instalação (formato texto, use \\n para quebras de linha)
- usage: comandos de uso (formato texto, use \\n para quebras de linha)
- license: tipo de licença (MIT por padrão)
- author: "Seu Nome" (placeholder)

Retorne APENAS o JSON, sem texto adicional.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  return JSON.parse(content);
}

function generateFallback(prompt: string): ProjectInfo {
  const lowerPrompt = prompt.toLowerCase();

  const extractTechnologies = (): string[] => {
    const techKeywords = [
      { keywords: ['react', 'reactjs'], name: 'React' },
      { keywords: ['node', 'nodejs', 'node.js'], name: 'Node.js' },
      { keywords: ['typescript', 'ts'], name: 'TypeScript' },
      { keywords: ['javascript', 'js'], name: 'JavaScript' },
      { keywords: ['python', 'py'], name: 'Python' },
      { keywords: ['express'], name: 'Express' },
      { keywords: ['mongodb', 'mongo'], name: 'MongoDB' },
      { keywords: ['postgresql', 'postgres'], name: 'PostgreSQL' },
      { keywords: ['mysql'], name: 'MySQL' },
      { keywords: ['jwt'], name: 'JWT' },
      { keywords: ['api', 'rest'], name: 'REST API' },
      { keywords: ['vue', 'vuejs'], name: 'Vue.js' },
      { keywords: ['angular'], name: 'Angular' },
      { keywords: ['tailwind'], name: 'Tailwind CSS' },
      { keywords: ['docker'], name: 'Docker' },
      { keywords: ['redis'], name: 'Redis' },
    ];

    const detected: string[] = [];
    for (const tech of techKeywords) {
      if (tech.keywords.some(keyword => lowerPrompt.includes(keyword))) {
        detected.push(tech.name);
      }
    }

    return detected.length > 0 ? detected : ['JavaScript', 'Node.js'];
  };

  const extractProjectName = (): string => {
    const words = prompt.split(' ').slice(0, 4);
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const generateFeatures = (): string[] => {
    const features = [];

    if (lowerPrompt.includes('auth') || lowerPrompt.includes('login')) {
      features.push('Sistema de autenticação seguro');
    }
    if (lowerPrompt.includes('api') || lowerPrompt.includes('rest')) {
      features.push('API RESTful completa');
    }
    if (lowerPrompt.includes('crud')) {
      features.push('Operações CRUD completas');
    }
    if (lowerPrompt.includes('banco') || lowerPrompt.includes('database') || lowerPrompt.includes('db')) {
      features.push('Integração com banco de dados');
    }
    if (lowerPrompt.includes('test')) {
      features.push('Testes automatizados');
    }
    if (lowerPrompt.includes('responsiv')) {
      features.push('Design responsivo');
    }

    if (features.length === 0) {
      features.push('Interface intuitiva e moderna');
      features.push('Código limpo e bem documentado');
      features.push('Fácil de configurar e usar');
    }

    return features;
  };

  const generateInstallation = (): string => {
    const techs = extractTechnologies();

    if (techs.some(t => t.includes('Node') || t.includes('React'))) {
      return 'npm install\nnpm run dev';
    }
    if (techs.some(t => t.includes('Python'))) {
      return 'pip install -r requirements.txt\npython main.py';
    }

    return 'npm install\nnpm start';
  };

  return {
    name: extractProjectName(),
    description: prompt,
    technologies: extractTechnologies(),
    features: generateFeatures(),
    installation: generateInstallation(),
    usage: 'npm start',
    license: 'MIT',
    author: 'Seu Nome',
  };
}

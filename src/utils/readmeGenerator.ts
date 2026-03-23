import { ProjectInfo } from '../types';

export function generateReadme(projectInfo: ProjectInfo): string {
  const { name, description, technologies, features, installation, usage, license, author } = projectInfo;

  const badges = technologies
    .map(tech => `![${tech}](https://img.shields.io/badge/${encodeURIComponent(tech)}-blue?style=for-the-badge)`)
    .join(' ');

  const featuresList = features
    .map(feature => `- ✨ ${feature}`)
    .join('\n');

  return `# ${name}

${description}

${badges}

## 📋 Funcionalidades

${featuresList}

## 🚀 Tecnologias

${technologies.map(tech => `- ${tech}`).join('\n')}

## ⚙️ Instalação

\`\`\`bash
${installation}
\`\`\`

## 💻 Como Usar

\`\`\`bash
${usage}
\`\`\`

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ${license}.

## 👤 Autor

**${author}**

---

Feito com ❤️ por ${author}
`;
}

export function downloadReadme(content: string, filename: string = 'README.md') {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export interface ProjectInfo {
  name: string;
  description: string;
  technologies: string[];
  features: string[];
  installation: string;
  usage: string;
  license: string;
  author: string;
}

export type GenerationMode = 'form' | 'ai';

export interface ReadmeStyle {
  id: string;
  name: string;
  description: string;
}

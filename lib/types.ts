// Tipos do sistema de currículos com IA

export type UserProfile = 
  | 'first-job'
  | 'junior'
  | 'mid-level'
  | 'senior'
  | 'executive'
  | 'freelancer'
  | 'career-transition'
  | 'career-return';

export type ResumeGoal = 
  | 'first-job-internship'
  | 'job-change-same-area'
  | 'career-transition'
  | 'internal-promotion'
  | 'freelance-consulting'
  | 'market-return';

export type ExperienceLevel = 
  | 'no-experience'
  | 'less-than-1-year'
  | '1-3-years'
  | '3-7-years'
  | '7-15-years'
  | '15-plus-years'
  | 'c-level';

export interface QuizState {
  currentStep: number;
  totalSteps: number;
  profile: UserProfile | null;
  answers: Record<string, any>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'select' | 'multi-select' | 'text' | 'textarea' | 'rating' | 'multi-input';
  options?: Array<{ value: string; label: string; description?: string }>;
  placeholder?: string;
  required?: boolean;
  condition?: (answers: Record<string, any>) => boolean;
}

export type ResumeTemplate = 'simple' | 'premium';

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn?: string;
    portfolio?: string;
    github?: string;
    photo?: string;
  };
  experiences: Array<{
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
  }>;
  skills: string[];
  languages: Array<{
    language: string;
    level: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  summary: string;
}

export const CAREER_AREAS = [
  'Tecnologia / TI',
  'Marketing / Comunicação',
  'Vendas / Comercial',
  'Recursos Humanos',
  'Finanças / Contabilidade',
  'Administração / Gestão',
  'Engenharia',
  'Saúde / Medicina',
  'Educação',
  'Design / Criativo',
  'Jurídico',
  'Logística / Supply Chain',
  'Atendimento ao Cliente',
  'Produção / Operações',
  'Consultoria',
  'Outras'
] as const;

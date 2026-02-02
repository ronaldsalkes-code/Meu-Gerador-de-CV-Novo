'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import type { UserProfile, ResumeGoal, ExperienceLevel, QuizState, ResumeData } from '@/lib/types';
import { CAREER_AREAS } from '@/lib/types';

interface AdaptiveQuizProps {
  onComplete: (profile: UserProfile) => void;
}

export function AdaptiveQuiz({ onComplete }: AdaptiveQuizProps) {
  const [state, setState] = useState<QuizState>({
    currentStep: 0,
    totalSteps: 3,
    profile: null,
    answers: {},
  });

  const updateAnswer = (key: string, value: any) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [key]: value }
    }));
  };

  const detectProfile = (): UserProfile => {
    const goal = state.answers.goal as ResumeGoal;
    const experience = state.answers.experienceLevel as ExperienceLevel;

    // Lógica de detecção de perfil
    if (goal === 'first-job-internship' || experience === 'no-experience') {
      return 'first-job';
    }
    if (goal === 'career-transition') {
      return 'career-transition';
    }
    if (goal === 'market-return') {
      return 'career-return';
    }
    if (goal === 'freelance-consulting') {
      return 'freelancer';
    }
    if (experience === 'c-level' || experience === '15-plus-years') {
      return 'executive';
    }
    if (experience === '7-15-years') {
      return 'senior';
    }
    if (experience === '3-7-years') {
      return 'mid-level';
    }
    return 'junior';
  };

  const handleNext = () => {
    if (state.currentStep === 2) {
      const detectedProfile = detectProfile();
      onComplete(detectedProfile);
    } else if (state.currentStep < state.totalSteps - 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const handleBack = () => {
    if (state.currentStep > 0) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const canProceed = () => {
    switch (state.currentStep) {
      case 0:
        return !!state.answers.goal;
      case 1:
        return !!state.answers.experienceLevel;
      case 2:
        return !!state.answers.careerArea;
      default:
        return false;
    }
  };

  const getProfileLabel = (profile: UserProfile) => {
    const labels: Record<UserProfile, string> = {
      'first-job': 'Primeiro Emprego',
      'junior': 'Júnior',
      'mid-level': 'Pleno',
      'senior': 'Sênior',
      'executive': 'Executivo/C-Level',
      'freelancer': 'Freelancer',
      'career-transition': 'Transição de Carreira',
      'career-return': 'Retorno ao Mercado'
    };
    return labels[profile];
  };

  const progressPercentage = ((state.currentStep + 1) / state.totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            {'Quiz Inteligente'}
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {'Vamos conhecer você'}
          </h1>
          <p className="text-muted-foreground">
            {'Responda 3 perguntas para personalizarmos seu currículo'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{'Progresso'}</span>
            <span>{`${state.currentStep + 1} de ${state.totalSteps}`}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6">
          {state.currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {'Qual é seu objetivo com este currículo?'}
                </h2>
                <p className="text-muted-foreground">
                  {'Isso nos ajuda a personalizar o conteúdo para você'}
                </p>
              </div>

              <RadioGroup 
                value={state.answers.goal}
                onValueChange={(value) => updateAnswer('goal', value)}
              >
                <div className="space-y-3">
                  {[
                    { value: 'first-job-internship', label: 'Primeiro emprego / Estágio', desc: 'Estou começando minha carreira' },
                    { value: 'job-change-same-area', label: 'Mudança de emprego (mesma área)', desc: 'Quero trocar de empresa' },
                    { value: 'career-transition', label: 'Transição de carreira', desc: 'Mudando de área profissional' },
                    { value: 'internal-promotion', label: 'Promoção interna', desc: 'Buscando crescimento na empresa atual' },
                    { value: 'freelance-consulting', label: 'Freelance / Consultoria', desc: 'Trabalho autônomo ou projetos' },
                    { value: 'market-return', label: 'Retorno ao mercado', desc: 'Voltando após um período afastado' },
                  ].map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className="flex items-start gap-3 p-4 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {state.currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {'Qual seu nível de experiência profissional?'}
                </h2>
                <p className="text-muted-foreground">
                  {'Considere toda sua experiência de trabalho'}
                </p>
              </div>

              <RadioGroup 
                value={state.answers.experienceLevel}
                onValueChange={(value) => updateAnswer('experienceLevel', value)}
              >
                <div className="space-y-3">
                  {[
                    { value: 'no-experience', label: 'Sem experiência', desc: 'Estudante ou buscando primeiro emprego' },
                    { value: 'less-than-1-year', label: 'Menos de 1 ano', desc: 'Recém começando' },
                    { value: '1-3-years', label: '1-3 anos', desc: 'Nível júnior' },
                    { value: '3-7-years', label: '3-7 anos', desc: 'Nível pleno' },
                    { value: '7-15-years', label: '7-15 anos', desc: 'Nível sênior' },
                    { value: '15-plus-years', label: '15+ anos', desc: 'Experiência avançada' },
                    { value: 'c-level', label: 'C-Level / Executivo', desc: 'Posições de liderança executiva' },
                  ].map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className="flex items-start gap-3 p-4 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {state.currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {'Qual sua área de atuação?'}
                </h2>
                <p className="text-muted-foreground">
                  {'Selecione a área principal onde você trabalha ou deseja trabalhar'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="career-area">{'Área profissional'}</Label>
                <Select
                  value={state.answers.careerArea}
                  onValueChange={(value) => updateAnswer('careerArea', value)}
                >
                  <SelectTrigger id="career-area" className="h-12">
                    <SelectValue placeholder="Selecione sua área" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAREER_AREAS.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {state.profile && (
                <div className="mt-8 p-6 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-primary mb-1">
                        {'Perfil detectado!'}
                      </h3>
                      <p className="text-sm">
                        {'Identificamos que você se encaixa no perfil: '}
                        <span className="font-semibold">{getProfileLabel(state.profile)}</span>
                        {'. Vamos personalizar seu currículo de acordo.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={state.currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {'Voltar'}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {state.currentStep === state.totalSteps - 1 ? 'Continuar' : 'Próximo'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

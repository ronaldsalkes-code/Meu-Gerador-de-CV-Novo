'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, FileText, Zap, Target, Users, Briefcase } from 'lucide-react';
import { AdaptiveQuiz } from '@/components/adaptive-quiz';
import { ResumeDataCollection } from '@/components/resume-data-collection';
import { ResumeGenerator } from '@/components/resume-generator';
import type { UserProfile, ResumeData } from '@/lib/types';

type AppStep = 'landing' | 'quiz' | 'data-collection' | 'generator';

export default function Home() {
  const [step, setStep] = useState<AppStep>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  if (step === 'quiz') {
    return (
      <AdaptiveQuiz
        onComplete={(profile) => {
          setUserProfile(profile);
          setStep('data-collection');
        }}
      />
    );
  }

  if (step === 'data-collection' && userProfile) {
    return (
      <ResumeDataCollection
        profile={userProfile}
        onComplete={(data) => {
          setResumeData(data);
          setStep('generator');
        }}
        onBack={() => setStep('quiz')}
      />
    );
  }

  if (step === 'generator' && userProfile && resumeData) {
    return (
      <ResumeGenerator
        profile={userProfile}
        resumeData={resumeData}
        onBack={() => setStep('data-collection')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              {'Powered by Advanced AI'}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance mb-6">
              {'Seu currículo perfeito,'}
              <br />
              <span className="text-primary">{'gerado por IA'}</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground text-balance max-w-2xl mx-auto mb-10 leading-relaxed">
              {'Plataforma enterprise que adapta automaticamente seu currículo ao seu nível profissional — do primeiro emprego até C-Level.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setStep('quiz')}
                className="text-base h-12 px-8"
              >
                {'Criar meu currículo'}
                <Sparkles className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base h-12 px-8 bg-transparent"
              >
                {'Ver exemplos'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {'Inteligência adaptativa para todos os níveis'}
          </h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            {'Nossa IA detecta automaticamente seu perfil e personaliza todo o processo'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{'Detecção Inteligente'}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {'Identifica seu nível profissional nas primeiras 3 perguntas e adapta todo o fluxo'}
            </p>
          </Card>

          <Card className="p-6 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{'8 Perfis Diferentes'}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {'Estudante, Júnior, Pleno, Sênior, Executivo, Freelancer, Transição e Retorno'}
            </p>
          </Card>

          <Card className="p-6 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{'Conteúdo Personalizado'}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {'IA gera descrições otimizadas com vocabulário e tom adequados ao seu nível'}
            </p>
          </Card>

          <Card className="p-6 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{'Quiz Adaptativo'}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {'Perguntas completamente diferentes para cada perfil, focadas no que importa'}
            </p>
          </Card>

          <Card className="p-6 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{'Templates Premium'}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {'Designs específicos para cada nível: do criativo moderno ao executivo luxury'}
            </p>
          </Card>

          <Card className="p-6 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{'Análise ATS'}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {'Score e otimização para passar em sistemas de recrutamento automatizados'}
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {'Pronto para criar seu currículo perfeito?'}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            {'Leva apenas 5 minutos e é completamente gratuito'}
          </p>
          <Button 
            size="lg" 
            onClick={() => setStep('quiz')}
            className="text-base h-12 px-8"
          >
            {'Começar agora'}
            <Sparkles className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

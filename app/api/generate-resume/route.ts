import OpenAI from 'openai'
import type { UserProfile, ResumeData } from '@/lib/types'

export const maxDuration = 60

const profileInstructions: Record<UserProfile, string> = {
  'first-job': `Tom entusiasta e proativo. Verbos: Colaborei, Apoiei, Desenvolvi, Participei, Aprendi. Destaque projetos acadêmicos, voluntariado e soft skills como trabalho em equipe.`,
  
  junior: `Tom técnico e em crescimento. Verbos: Implementei, Desenvolvi, Contribuí, Apoiei, Otimizei. Destaque tecnologias específicas, projetos completos e entregas mensuráveis.`,
  
  'mid-level': `Tom profissional e orientado a resultados. Verbos: Liderei, Implementei, Otimizei, Aumentei, Reduzi. Destaque projetos complexos, métricas de impacto e liderança técnica.`,
  
  senior: `Tom estratégico e autoritativo. Verbos: Arquitetei, Transformei, Mentorizei, Estabeleci, Dirigi. Destaque decisões técnicas estratégicas, arquitetura de sistemas e mentoria de times.`,
  
  executive: `Tom visionário e executivo. Verbos: Transformei, Expandi, Dirigi, Consolidei, Estabeleci. Destaque P&L, crescimento de receita, transformação organizacional e visão estratégica.`,
  
  freelancer: `Tom especialista e versátil. Verbos: Entreguei, Desenvolvi, Consultei, Solucionei, Implementei. Destaque diversidade de projetos, clientes atendidos e especialização técnica.`,
  
  'career-transition': `Tom adaptável e motivado. Verbos: Transicionei, Apliquei, Adaptei, Desenvolvi, Preparei. Destaque habilidades transferíveis, aprendizado recente e ponte entre carreiras.`,
  
  'returning-to-market': `Tom atualizado e preparado. Verbos: Retomei, Atualizei, Desenvolvi, Preparei, Recuperei. Destaque upskilling durante gap, experiência passada relevante e motivação para retorno.`,
}

export async function POST(req: Request) {
  console.log('[API] 🚀 Starting resume generation with OpenAI...')
  
  try {
    const body = await req.json()
    const { profile, resumeData }: { profile: UserProfile; resumeData: ResumeData } = body
    
    console.log('[API] 👤 Profile:', profile)
    console.log('[API] 📝 Name:', resumeData?.personalInfo?.fullName)
    console.log('[API] 💼 Experiences:', resumeData?.experiences?.length || 0)

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error('[API] ❌ OPENAI_API_KEY not configured')
      return Response.json(
        { success: false, error: 'Configure OPENAI_API_KEY nas variáveis de ambiente do projeto' },
        { status: 500 }
      )
    }

    console.log('[API] ✅ API Key found, initializing OpenAI client...')
    const openai = new OpenAI({ apiKey })

    // ============================================
    // PROMPT OTIMIZADO - GERA JSON ESTRUTURADO
    // ============================================

    const systemPrompt = `Você é um especialista em otimização de currículos profissionais em português brasileiro.
Sua tarefa é criar conteúdo profissional, impactante e adequado ao nível do candidato.

IMPORTANTE: Retorne APENAS JSON válido, sem markdown (```json), sem explicações extras.

Estrutura EXATA do JSON que você deve retornar:
{
  "summary": "string com resumo profissional de 3-4 linhas impactantes",
  "experiences": [
    {
      "bullets": [
        "Bullet point 1 com verbo de ação e resultado quantificado",
        "Bullet point 2 destacando responsabilidade chave",
        "Bullet point 3 com métrica ou impacto se possível"
      ]
    }
  ]
}

REGRAS PARA BULLETS:
- Começar SEMPRE com verbo de ação no passado
- Incluir números/métricas quando possível (%, R$, tempo, quantidade)
- Ser específico e concreto, não genérico
- Cada bullet deve ter 1-2 linhas no máximo
- NÃO incluir o símbolo "•" ou "-" no início (será adicionado automaticamente)`

    const userPrompt = `PERFIL DO CANDIDATO: ${profile}

INSTRUÇÕES ESPECÍFICAS PARA ESTE PERFIL:
${profileInstructions[profile]}

DADOS DO CANDIDATO:
Nome: ${resumeData.personalInfo.fullName}
Área: ${resumeData.personalInfo.location || 'Não especificada'}
Resumo atual: ${resumeData.summary || 'Não fornecido - CRIE UM RESUMO IMPACTANTE'}

EXPERIÊNCIAS PROFISSIONAIS:
${resumeData.experiences.map((exp, i) => `
Experiência ${i + 1}:
- Cargo: ${exp.position}
- Empresa: ${exp.company}
- Período: ${exp.startDate} - ${exp.current ? 'Presente' : exp.endDate || 'N/A'}
- Local: ${exp.location || 'Não especificado'}
- Descrição original: ${exp.description || 'Não fornecido - CRIE bullets baseado no cargo e empresa'}
`).join('\n')}

FORMAÇÃO ACADÊMICA:
${resumeData.education.map((edu, i) => `${i + 1}. ${edu.degree} em ${edu.field} - ${edu.institution}`).join('\n')}

HABILIDADES TÉCNICAS: ${resumeData.skills.join(', ')}

${resumeData.languages.length > 0 ? `IDIOMAS: ${resumeData.languages.map(l => `${l.language} (${l.level})`).join(', ')}` : ''}

TAREFA COMPLETA:

1️⃣ RESUMO PROFISSIONAL (campo "summary"):
Crie um resumo profissional de 3-4 linhas que:
- Destaque as principais qualificações e experiência
- Mencione as top 3 habilidades: ${resumeData.skills.slice(0, 3).join(', ')}
- Use números/métricas se aplicável (anos de experiência, projetos, etc)
- Seja específico ao perfil "${profile}"
- Use tom ${profile === 'first-job' ? 'entusiasta e proativo' : profile === 'executive' ? 'executivo e estratégico' : 'profissional e objetivo'}

2️⃣ EXPERIÊNCIAS OTIMIZADAS (campo "experiences"):
Para CADA uma das ${resumeData.experiences.length} experiências listadas acima, gere um objeto com campo "bullets" contendo array de 3-4 bullets que:
- Comecem com verbo de ação apropriado ao nível do perfil
- Incluam resultados quantificáveis quando possível (aumento de %, redução de tempo, economia de R$, número de usuários, etc)
- Sejam específicos e concretos (tecnologias, metodologias, ferramentas usadas)
- Destaquem impacto e responsabilidades principais
-Tenham comprimento adequado (1-2 linhas cada)

EXEMPLOS DE BULLETS EXCELENTES:
✅ "Desenvolvi sistema de autenticação OAuth2 que reduziu tempo de login de 5s para 1.2s, impactando 50mil usuários"
✅ "Liderei equipe de 5 desenvolvedores entregando 12 features críticas em 3 sprints com 98% de cobertura de testes"
✅ "Implementei pipeline CI/CD com GitHub Actions e Docker, reduzindo tempo de deploy de 2h para 15min"
✅ "Otimizei queries SQL que melhoraram performance do dashboard em 60% e reduziram custos de servidor em R$ 5mil/mês"

EXEMPLOS DE BULLETS RUINS (NÃO FAZER):
❌ "Trabalhei em projetos diversos" (muito genérico)
❌ "Ajudei a equipe" (não especifica o que fez)
❌ "Usei React e Node.js" (apenas lista tecnologias sem contexto)

RETORNE APENAS O JSON, SEM NENHUM TEXTO ADICIONAL ANTES OU DEPOIS.`

    console.log('[API] 📤 Sending request to OpenAI (gpt-4o)...')
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: 'json_object' } // Força retorno JSON
    })

    const text = completion.choices[0]?.message?.content || ''
    
    console.log('[API] 📥 Response received!')
    console.log('[API] 📊 Response length:', text.length, 'chars')
    console.log('[API] 🪙 Tokens used:', completion.usage?.total_tokens || 0)

    if (!text || text.length < 50) {
      throw new Error('Resposta da IA muito curta ou vazia')
    }

    // Parse do JSON retornado
    let generatedContent
    try {
      generatedContent = JSON.parse(text)
      console.log('[API] ✅ JSON parsed successfully')
    } catch (parseError) {
      console.error('[API] ❌ Failed to parse JSON:', text.substring(0, 200))
      throw new Error('IA não retornou JSON válido')
    }

    // Validar estrutura
    if (!generatedContent.summary) {
      console.error('[API] ❌ Missing summary field')
      throw new Error('JSON sem campo "summary"')
    }
    
    if (!generatedContent.experiences || !Array.isArray(generatedContent.experiences)) {
      console.error('[API] ❌ Missing or invalid experiences field')
      throw new Error('JSON sem campo "experiences" válido')
    }

    console.log('[API] ✅ Generated summary:', generatedContent.summary.substring(0, 100) + '...')
    console.log('[API] ✅ Generated', generatedContent.experiences.length, 'experience descriptions')

    // ============================================
    // MESCLAR CONTEÚDO GERADO COM DADOS ORIGINAIS
    // ============================================

    const enhancedResumeData: ResumeData = {
      ...resumeData,
      summary: generatedContent.summary, // ← Resumo otimizado pela IA
      experiences: resumeData.experiences.map((exp, index) => {
        const generated = generatedContent.experiences[index]
        
        if (generated && generated.bullets && Array.isArray(generated.bullets)) {
          // Formatar bullets com "• " no início
          const formattedDescription = generated.bullets
            .filter((bullet: string) => bullet && bullet.trim().length > 0)
            .map((bullet: string) => {
              // Remover "• " se já existir no começo
              const cleanBullet = bullet.trim().replace(/^[•\-\*]\s*/, '')
              return `• ${cleanBullet}`
            })
            .join('\n')
          
          return {
            ...exp,
            description: formattedDescription || exp.description // Fallback para original
          }
        }
        
        // Se não gerou bullets para esta experiência, manter original
        return exp
      })
    }

    console.log('[API] ✅ Resume data enhanced successfully!')
    console.log('[API] 📝 New summary length:', enhancedResumeData.summary.length)
    console.log('[API] 💼 Enhanced experiences:', enhancedResumeData.experiences.length)

    return Response.json({
      success: true,
      resumeData: enhancedResumeData, // ← DADOS OTIMIZADOS COMPLETOS
      profile,
      generatedAt: new Date().toISOString(),
      tokensUsed: completion.usage?.total_tokens || 0,
    })

  } catch (error) {
    console.error('[API] ❌ Resume generation error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    
    // Tratamento específico de erros da OpenAI
    if (error instanceof OpenAI.APIError) {
      console.error('[API] 🔴 OpenAI API Error:', {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      })
      
      if (error.status === 401) {
        return Response.json(
          { error: 'Chave de API da OpenAI inválida. Verifique OPENAI_API_KEY.', success: false },
          { status: 401 }
        )
      }
      
      if (error.status === 429) {
        return Response.json(
          { error: 'Limite de requisições da OpenAI excedido. Aguarde alguns segundos e tente novamente.', success: false },
          { status: 429 }
        )
      }
      
      if (error.status === 500) {
        return Response.json(
          { error: 'Erro interno da OpenAI. Tente novamente em alguns instantes.', success: false },
          { status: 500 }
        )
      }
    }
    
    return Response.json(
      { 
        error: `Falha ao gerar currículo: ${errorMessage}`,
        success: false,
        details: errorMessage
      },
      { status: 500 }
    )
  }
}

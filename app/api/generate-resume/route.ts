import OpenAI from 'openai'
import type { UserProfile, ResumeData } from '@/lib/types'

export const maxDuration = 60

const profileInstructions: Record<UserProfile, string> = {
  'first-job': `
    - Tom: Entusiasta, proativo, focado em potencial
    - Verbos: Colaborei, Apoiei, Aprendi, Desenvolvi, Participei
    - Destaque: Projetos acadêmicos, voluntariado, cursos
    - Foco: Soft skills e vontade de aprender
  `,
  junior: `
    - Tom: Técnico, em crescimento, detalhista
    - Verbos: Desenvolvi, Implementei, Contribuí, Apoiei, Aprendi
    - Destaque: Tecnologias específicas, projetos completos
    - Foco: Habilidades técnicas e entregas
  `,
  'mid-level': `
    - Tom: Profissional, orientado a resultados
    - Verbos: Implementei, Otimizei, Liderei, Aumentei, Reduzi
    - Destaque: Projetos complexos, métricas, impacto
    - Foco: Resultados quantificáveis e liderança técnica
  `,
  senior: `
    - Tom: Estratégico, autoritativo, mentor
    - Verbos: Arquitetei, Transformei, Mentorizei, Estabeleci, Dirigi
    - Destaque: Decisões técnicas, arquitetura, mentoria
    - Foco: Impacto de longo prazo e liderança
  `,
  executive: `
    - Tom: Visionário, executivo, transformacional
    - Verbos: Dirigi, Transformei, Expandi, Consolidei, Estabeleci
    - Destaque: P&L, crescimento de receita, transformação
    - Foco: Impacto no negócio e visão estratégica
  `,
  freelancer: `
    - Tom: Especialista, autônomo, versátil
    - Verbos: Entreguei, Desenvolvi, Consultei, Solucionei
    - Destaque: Variedade de projetos e clientes
    - Foco: Resultados para clientes e especialização
  `,
  'career-transition': `
    - Tom: Adaptável, motivado, em evolução
    - Verbos: Transicionei, Apliquei, Adaptei, Desenvolvi
    - Destaque: Habilidades transferíveis
    - Foco: Ponte entre carreira anterior e nova área
  `,
  'returning-to-market': `
    - Tom: Atualizado, preparado, motivado
    - Verbos: Atualizei, Retomei, Desenvolvi, Preparei
    - Destaque: Upskilling durante gap
    - Foco: Experiência passada + preparação atual
  `,
}

export async function POST(req: Request) {
  console.log('[API] Starting resume generation with OpenAI...')
  
  try {
    const body = await req.json()
    const { profile, resumeData }: { profile: UserProfile; resumeData: ResumeData } = body
    
    console.log('[API] Profile:', profile)
    console.log('[API] Name:', resumeData?.personalInfo?.fullName)

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error('[API] OPENAI_API_KEY not configured')
      return Response.json(
        { 
          success: false, 
          error: 'Configure OPENAI_API_KEY nas variáveis de ambiente' 
        },
        { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey })

    // ============================================
    // PROMPT OTIMIZADO - GERA CONTEÚDO ESTRUTURADO
    // ============================================

    const systemPrompt = `Você é um especialista em otimização de currículos profissionais em português brasileiro.

IMPORTANTE: Retorne APENAS JSON válido, sem markdown, sem explicações.

Estrutura EXATA do JSON:
{
  "summary": "string com resumo profissional de 3-4 linhas",
  "experiences": [
    {
      "position": "cargo original",
      "company": "empresa original",
      "period": "período original",
      "bullets": [
        "Bullet point 1 com verbo de ação e resultado",
        "Bullet point 2 com métrica se possível",
        "Bullet point 3 destacando responsabilidade chave"
      ]
    }
  ]
}`

    const userPrompt = `PERFIL DO CANDIDATO: ${profile}

INSTRUÇÕES PARA ESTE PERFIL:
${profileInstructions[profile]}

DADOS:
Nome: ${resumeData.personalInfo.fullName}
Resumo atual: ${resumeData.summary || 'Não fornecido - CRIE UM IMPACTANTE'}

EXPERIÊNCIAS:
${resumeData.experiences.map((exp, i) => `
Experiência ${i + 1}:
- Cargo: ${exp.position}
- Empresa: ${exp.company}
- Período: ${exp.startDate} - ${exp.current ? 'Presente' : exp.endDate || 'N/A'}
- Descrição original: ${exp.description || 'Não fornecido - CRIE baseado no cargo'}
`).join('\n')}

HABILIDADES: ${resumeData.skills.join(', ')}

FORMAÇÃO: ${resumeData.education.map(e => `${e.degree} em ${e.field}`).join(', ')}

TAREFA:
1. Crie um RESUMO PROFISSIONAL de 3-4 linhas que:
   - Destaque principais qualificações
   - Use números/métricas se possível
   - Mencione ${resumeData.skills.slice(0, 3).join(', ')}
   - Seja específico ao perfil ${profile}

2. Para CADA experiência, gere 3-4 bullet points que:
   - Comecem com verbo de ação no passado
   - Incluam resultados/métricas quando possível (%, R$, tempo)
   - Sejam específicos e concretos
   - Destaquem impacto e responsabilidades

EXEMPLOS DE BULLETS BONS:
- "Desenvolvi sistema de autenticação OAuth2 que reduziu tempo de login em 40%"
- "Liderei equipe de 5 desenvolvedores entregando 12 features em 3 sprints"
- "Implementei pipeline CI/CD com GitHub Actions reduzindo deploys de 2h para 15min"

RETORNE APENAS O JSON, SEM TEXTO ADICIONAL.`

    console.log('[API] Calling OpenAI API...')
    
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
    
    console.log('[API] OpenAI response length:', text.length)
    console.log('[API] Tokens used:', completion.usage?.total_tokens)

    if (!text || text.length < 50) {
      throw new Error('Resposta da IA muito curta')
    }

    // Parse do JSON retornado
    let generatedContent
    try {
      generatedContent = JSON.parse(text)
    } catch (parseError) {
      console.error('[API] Failed to parse JSON:', text)
      throw new Error('IA não retornou JSON válido')
    }

    // Validar estrutura
    if (!generatedContent.summary || !generatedContent.experiences) {
      throw new Error('JSON retornado está incompleto')
    }

    console.log('[API] Successfully generated structured content')

    // ============================================
    // MESCLAR CONTEÚDO GERADO COM DADOS ORIGINAIS
    // ============================================

    const enhancedResumeData = {
      ...resumeData,
      summary: generatedContent.summary, // Resumo otimizado
      experiences: resumeData.experiences.map((exp, index) => {
        const generated = generatedContent.experiences[index]
        return {
          ...exp,
          description: generated?.bullets ? 
            generated.bullets.join('\n• ') : // Bullets formatados
            exp.description // Fallback para descrição original
        }
      })
    }

    return Response.json({
      success: true,
      resumeData: enhancedResumeData,
      profile,
      generatedAt: new Date().toISOString(),
      tokensUsed: completion.usage?.total_tokens || 0,
    })

  } catch (error) {
    console.error('[API] Resume generation error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    
    if (error instanceof OpenAI.APIError) {
      console.error('[API] OpenAI Error:', {
        status: error.status,
        message: error.message,
      })
      
      if (error.status === 401) {
        return Response.json(
          { error: 'API Key da OpenAI inválida', success: false },
          { status: 401 }
        )
      }
      
      if (error.status === 429) {
        return Response.json(
          { error: 'Limite de requisições excedido. Aguarde alguns segundos.', success: false },
          { status: 429 }
        )
      }
    }
    
    return Response.json(
      { 
        error: `Erro ao gerar: ${errorMessage}`,
        success: false,
      },
      { status: 500 }
    )
  }
}

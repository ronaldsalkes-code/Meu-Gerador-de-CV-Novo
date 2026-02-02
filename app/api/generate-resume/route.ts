import OpenAI from 'openai'
import type { UserProfile, ResumeData } from '@/lib/types'

export const maxDuration = 60

const profileInstructions: Record<UserProfile, string> = {
  'first-job': `
    - Foque em educação, projetos acadêmicos e habilidades transferíveis
    - Destaque cursos, certificações e atividades extracurriculares
    - Enfatize entusiasmo, vontade de aprender e soft skills
  `,
  junior: `
    - Destaque 1-3 anos de experiência profissional
    - Foque em tecnologias específicas e projetos concretos
    - Mostre crescimento e aprendizado rápido
  `,
  'mid-level': `
    - Enfatize 3-5 anos de experiência sólida
    - Destaque projetos complexos e liderança técnica
    - Quantifique resultados e impacto nos negócios
  `,
  senior: `
    - Foque em 5+ anos de experiência e expertise técnica profunda
    - Destaque arquitetura de sistemas e decisões técnicas estratégicas
    - Enfatize liderança técnica e mentoria
  `,
  executive: `
    - Destaque liderança executiva e gestão estratégica
    - Foque em transformação organizacional e resultados de negócio
    - Enfatize P&L, orçamentos e crescimento de receita
  `,
  freelancer: `
    - Destaque diversidade de projetos e clientes
    - Enfatize autonomia, gestão de projetos e resultados
    - Mostre especializações e nichos de expertise
  `,
  'career-transition': `
    - Conecte experiência anterior com nova área de forma estratégica
    - Destaque habilidades transferíveis e aprendizado recente
    - Enfatize motivação e preparação para a transição
  `,
  'returning-to-market': `
    - Aborde o gap de forma positiva focando em atualizações
    - Destaque experiências relevantes anteriores
    - Enfatize cursos, projetos pessoais ou trabalho voluntário recente
  `,
}

export async function POST(req: Request) {
  console.log('[API] Starting resume generation with OpenAI...')
  
  try {
    const body = await req.json()
    const { profile, resumeData }: { profile: UserProfile; resumeData: ResumeData } = body
    
    console.log('[API] Profile:', profile)
    console.log('[API] Name:', resumeData?.personalInfo?.fullName)

    // Verificar se a API key está configurada
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error('[API] OPENAI_API_KEY not configured')
      return Response.json(
        { 
          success: false, 
          error: 'OpenAI API key não configurada. Por favor, configure a variável de ambiente OPENAI_API_KEY nas configurações do projeto.' 
        },
        { status: 500 }
      )
    }

    console.log('[API] API Key found, initializing OpenAI client...')
    
    console.log('[API] OpenAI API Key found, initializing client...')

    // Inicializar o cliente OpenAI
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    const prompt = `Você é um especialista em recrutamento e redação de currículos profissionais.
Crie um RESUMO PROFISSIONAL completo e impactante para o seguinte candidato.

PERFIL: ${profile}
INSTRUÇÕES ESPECÍFICAS: ${profileInstructions[profile]}

DADOS DO CANDIDATO:
- Nome: ${resumeData.personalInfo.fullName}
- Email: ${resumeData.personalInfo.email}
- Telefone: ${resumeData.personalInfo.phone}
- Localização: ${resumeData.personalInfo.location}
${resumeData.personalInfo.linkedIn ? `- LinkedIn: ${resumeData.personalInfo.linkedIn}` : ''}
${resumeData.personalInfo.portfolio ? `- Portfolio: ${resumeData.personalInfo.portfolio}` : ''}
${resumeData.personalInfo.github ? `- GitHub: ${resumeData.personalInfo.github}` : ''}

RESUMO ATUAL: ${resumeData.summary || 'Não fornecido'}

EXPERIÊNCIAS:
${resumeData.experiences.map((exp, i) => `
${i + 1}. ${exp.position} na ${exp.company}
   Período: ${exp.startDate} - ${exp.current ? 'Presente' : exp.endDate || 'N/A'}
   ${exp.location ? `Local: ${exp.location}` : ''}
   ${exp.description || ''}
`).join('\n')}

FORMAÇÃO:
${resumeData.education.map((edu, i) => `
${i + 1}. ${edu.degree} em ${edu.field} - ${edu.institution}
   Período: ${edu.startDate} - ${edu.current ? 'Cursando' : edu.endDate || 'N/A'}
   ${edu.description || ''}
`).join('\n')}

HABILIDADES: ${resumeData.skills.join(', ')}

${resumeData.languages.length > 0 ? `IDIOMAS: ${resumeData.languages.map(l => `${l.language} (${l.level})`).join(', ')}` : ''}

${resumeData.certifications.length > 0 ? `CERTIFICAÇÕES: ${resumeData.certifications.map(c => `${c.name} - ${c.issuer} (${c.date})`).join(', ')}` : ''}

TAREFA:
Gere um texto profissional completo para o currículo deste candidato. O texto deve incluir:

1. RESUMO PROFISSIONAL (3-4 frases impactantes destacando principais qualificações)
2. DESCRIÇÃO EXPANDIDA das experiências com bullet points usando verbos de ação
3. DESTAQUES de habilidades técnicas e soft skills

Use linguagem profissional, verbos de ação (Desenvolveu, Liderou, Implementou, Otimizou), e quantifique resultados quando possível.

Retorne APENAS o texto, sem formatação markdown, sem títulos de seção, apenas parágrafos fluidos e profissionais.`

    console.log('[API] Calling OpenAI API (gpt-4o)...')
    
    // Chamar a API da OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em recrutamento e redação de currículos profissionais em português brasileiro. Você escreve de forma clara, objetiva e impactante.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    })

    const text = completion.choices[0]?.message?.content || ''
    
    console.log('[API] OpenAI response received, length:', text.length)
    console.log('[API] Content preview:', text.substring(0, 200))
    console.log('[API] Tokens used:', completion.usage?.total_tokens || 0)

    if (!text || text.length < 50) {
      console.error('[API] Generated content too short or empty')
      return Response.json(
        { error: 'Conteúdo gerado está vazio ou muito curto', success: false },
        { status: 500 }
      )
    }

    // Retornar JSON com o conteúdo gerado
    return Response.json({
      success: true,
      content: text,
      profile,
      generatedAt: new Date().toISOString(),
      tokensUsed: completion.usage?.total_tokens || 0,
    })

  } catch (error) {
    console.error('[API] Resume generation error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    
    // Tratamento específico de erros da OpenAI
    if (error instanceof OpenAI.APIError) {
      console.error('[API] OpenAI API Error:', {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      })
      
      if (error.status === 401) {
        return Response.json(
          { 
            error: 'Chave de API da OpenAI inválida. Verifique OPENAI_API_KEY.',
            success: false,
          },
          { status: 401 }
        )
      }
      
      if (error.status === 429) {
        return Response.json(
          { 
            error: 'Limite de taxa da OpenAI excedido. Tente novamente em alguns segundos.',
            success: false,
          },
          { status: 429 }
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

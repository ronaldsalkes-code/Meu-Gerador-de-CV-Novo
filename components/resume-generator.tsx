'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import {
  Loader2,
  Download,
  Sparkles,
  Check,
  FileText,
  Star,
  ChevronRight,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react'
import type { UserProfile, ResumeData, ResumeTemplate } from '@/lib/types'

interface ResumeGeneratorProps {
  profile: UserProfile
  resumeData: ResumeData
  onBack: () => void
}

const PLACEHOLDER_SUMMARY = `Profissional dedicado com experiencia comprovada e habilidades interpessoais excepcionais. Busca contribuir com resultados significativos atraves de comprometimento e proatividade.`

export function ResumeGenerator({
  profile,
  resumeData,
  onBack,
}: ResumeGeneratorProps) {
  const [step, setStep] = useState<'template-selection' | 'generation' | 'final'>('template-selection')
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('premium')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  
  const resumeRef = useRef<HTMLDivElement>(null)

  const displayContent = generatedContent || resumeData.summary || PLACEHOLDER_SUMMARY
  
  // Limitar resumo a 3 linhas aproximadamente
  const shortSummary = displayContent.length > 250 ? displayContent.substring(0, 250) + '...' : displayContent

  const generateResume = async () => {
    console.log('[v0] Starting AI resume generation...')
    console.log('[v0] Profile:', profile)
    console.log('[v0] Resume data:', resumeData.personalInfo.fullName)
    
    setStep('generation')
    setIsGenerating(true)
    setError(null)
    setGeneratedContent('')

    try {
      console.log('[v0] Calling /api/generate-resume...')
      
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, resumeData }),
      })

      console.log('[v0] API response status:', response.status)
      
      const data = await response.json()
      console.log('[v0] API response data:', data)

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao gerar curriculo')
      }

      if (data.content && data.content.length > 50) {
        console.log('[v0] AI content received, length:', data.content.length)
        console.log('[v0] Content preview:', data.content.substring(0, 200))
        setGeneratedContent(data.content)
      } else {
        console.warn('[v0] AI content empty or too short')
      }

      setIsGenerating(false)
      setStep('final')
      
    } catch (err) {
      console.error('[v0] Resume generation error:', err)
      setError(err instanceof Error ? err.message : 'Erro ao gerar curriculo')
      setIsGenerating(false)
      // Ir para final mesmo com erro para mostrar preview com placeholder
      setStep('final')
    }
  }

  const skipGeneration = () => {
    setStep('final')
  }

  const handleDownloadPDF = async () => {
    if (isDownloading || !resumeRef.current) return
    
    setIsDownloading(true)

    try {
      const element = resumeRef.current
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF('portrait', 'mm', 'a4')

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
      } else {
        let heightLeft = imgHeight
        let position = 0

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
        
        while (heightLeft > 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
          heightLeft -= pdfHeight
        }
      }

      const name = resumeData.personalInfo.fullName?.replace(/\s+/g, '_') || 'Curriculo'
      pdf.save(`${name}_${selectedTemplate}.pdf`)
      
    } catch (err) {
      console.error('PDF error:', err)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setIsDownloading(false)
    }
  }

  // Formatar data
  const formatDate = (date: string) => {
    if (!date) return ''
    return date
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-12">
        <AnimatePresence mode="wait">
          {/* Template Selection */}
          {step === 'template-selection' && (
            <motion.div
              key="template-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-8 text-center">
                <h1 className="mb-3 text-2xl sm:text-4xl font-bold">
                  Escolha o Modelo
                </h1>
                <p className="text-muted-foreground">
                  Selecione o estilo do seu curriculo
                </p>
              </div>

              <div className="mx-auto max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Simples */}
                <Card
                  className={`cursor-pointer border-2 p-5 transition-all ${
                    selectedTemplate === 'simple' ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTemplate('simple')}
                >
                  <div className="mb-4 h-48 overflow-hidden rounded border bg-white p-4">
                    <div className="text-center border-b-2 border-black pb-2 mb-3">
                      <div className="h-4 w-32 mx-auto bg-black mb-1" />
                      <div className="h-2 w-24 mx-auto bg-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-20 bg-black" />
                      <div className="h-1.5 w-full bg-gray-200" />
                      <div className="h-1.5 w-4/5 bg-gray-200" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5" />
                    <h3 className="text-lg font-bold">Simples</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Layout limpo, preto e branco, minimalista
                  </p>
                  <Button
                    variant={selectedTemplate === 'simple' ? 'default' : 'outline'}
                    className={`w-full ${selectedTemplate !== 'simple' ? 'bg-transparent' : ''}`}
                  >
                    {selectedTemplate === 'simple' ? 'Selecionado' : 'Selecionar'}
                  </Button>
                </Card>

                {/* Premium */}
                <Card
                  className={`relative cursor-pointer border-2 p-5 transition-all ${
                    selectedTemplate === 'premium' ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTemplate('premium')}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500 px-3 py-1 text-xs font-bold text-white">
                      <Star className="h-3 w-3" />
                      RECOMENDADO
                    </span>
                  </div>
                  <div className="mb-4 h-48 overflow-hidden rounded border bg-white">
                    <div className="h-12 bg-cyan-500 p-2">
                      <div className="h-3 w-24 bg-white/80" />
                      <div className="h-2 w-16 bg-white/50 mt-1" />
                    </div>
                    <div className="flex">
                      <div className="w-1/3 bg-gray-50 p-2">
                        <div className="h-8 w-8 rounded-full bg-gray-300 mx-auto mb-2" />
                        <div className="space-y-1">
                          <div className="h-1 w-full bg-gray-200" />
                          <div className="h-1 w-3/4 bg-gray-200" />
                        </div>
                      </div>
                      <div className="flex-1 p-2">
                        <div className="h-2 w-16 bg-cyan-500 mb-2" />
                        <div className="space-y-1">
                          <div className="h-1 w-full bg-gray-200" />
                          <div className="h-1 w-4/5 bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-cyan-500" />
                    <h3 className="text-lg font-bold">Premium</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Layout moderno com cores e foto
                  </p>
                  <Button
                    variant={selectedTemplate === 'premium' ? 'default' : 'outline'}
                    className={`w-full ${selectedTemplate !== 'premium' ? 'bg-transparent' : ''}`}
                  >
                    {selectedTemplate === 'premium' ? 'Selecionado' : 'Selecionar'}
                  </Button>
                </Card>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                <Button variant="outline" onClick={onBack} className="bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={generateResume}>
                  Gerar com IA
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={skipGeneration} className="bg-transparent">
                  Pular IA
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {step === 'generation' && (
            <motion.div
              key="generation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[500px] items-center justify-center"
            >
              <div className="text-center">
                <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary mb-6" />
                <h2 className="text-2xl font-bold mb-2">Gerando seu curriculo...</h2>
                <p className="text-muted-foreground">
                  A IA esta criando um resumo profissional otimizado
                </p>
              </div>
            </motion.div>
          )}

          {/* Final Preview */}
          {step === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-4 py-2 mb-4">
                  <Check className="h-5 w-5" />
                  <span className="font-semibold">Curriculo pronto!</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {selectedTemplate === 'simple' ? 'Modelo Simples' : 'Modelo Premium'}
                </h1>
              </div>

              <div className="mx-auto max-w-[650px]">
                {/* Download Button */}
                <Button
                  size="lg"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="w-full mb-6 h-14 text-lg"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Baixar Curriculo em PDF
                    </>
                  )}
                </Button>

                {/* Resume Preview */}
                <Card className="overflow-hidden border-2 shadow-xl">
                  <div 
                    ref={resumeRef} 
                    className="bg-white"
                    style={{ width: '100%', minHeight: '842px' }}
                  >
                    {/* ========== MODELO SIMPLES ========== */}
                    {selectedTemplate === 'simple' && (
                      <div className="p-8 text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
                        {/* Header */}
                        <div className="border-b-4 border-black pb-4 mb-6">
                          <h1 className="text-3xl font-black uppercase tracking-tight">
                            {resumeData.personalInfo.fullName || 'SEU NOME'}
                          </h1>
                          <p className="text-lg text-gray-600 mt-1">
                            {profile.area || 'Profissional'}
                          </p>
                        </div>

                        {/* Contato */}
                        <div className="flex flex-wrap gap-4 text-sm mb-6 pb-4 border-b border-gray-300">
                          {resumeData.personalInfo.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{resumeData.personalInfo.phone}</span>
                            </div>
                          )}
                          {resumeData.personalInfo.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{resumeData.personalInfo.email}</span>
                            </div>
                          )}
                          {resumeData.personalInfo.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{resumeData.personalInfo.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Objetivo */}
                        <div className="mb-6">
                          <h2 className="text-sm font-black uppercase tracking-wider mb-2 border-b-2 border-black pb-1">
                            OBJETIVOS
                          </h2>
                          <p className="text-sm leading-relaxed text-gray-700">
                            {shortSummary}
                          </p>
                        </div>

                        {/* Formacao */}
                        {resumeData.education && resumeData.education.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-sm font-black uppercase tracking-wider mb-3 border-b-2 border-black pb-1">
                              FORMACAO
                            </h2>
                            {resumeData.education.map((edu) => (
                              <div key={edu.id} className="mb-3">
                                <p className="text-sm font-bold">
                                  {formatDate(edu.startDate)} - {edu.current ? 'Atual' : formatDate(edu.endDate || '')} | {edu.institution.toUpperCase()}
                                </p>
                                <p className="text-sm text-gray-600">{edu.degree} em {edu.field}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Experiencias */}
                        {resumeData.experiences && resumeData.experiences.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-sm font-black uppercase tracking-wider mb-3 border-b-2 border-black pb-1">
                              EXPERIENCIAS
                            </h2>
                            {resumeData.experiences.map((exp) => (
                              <div key={exp.id} className="mb-4">
                                <p className="text-sm font-bold">
                                  {formatDate(exp.startDate)} - {exp.current ? 'Atual' : formatDate(exp.endDate || '')} | {exp.company.toUpperCase()}
                                </p>
                                <p className="text-sm font-semibold text-gray-700">{exp.position}</p>
                                {exp.description && (
                                  <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Habilidades */}
                        {resumeData.skills && resumeData.skills.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-sm font-black uppercase tracking-wider mb-2 border-b-2 border-black pb-1">
                              HABILIDADES
                            </h2>
                            <p className="text-sm text-gray-700">
                              {resumeData.skills.join(' • ')}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ========== MODELO PREMIUM ========== */}
                    {selectedTemplate === 'premium' && (
                      <div style={{ fontFamily: 'Arial, sans-serif' }}>
                        {/* Header Cyan */}
                        <div className="bg-cyan-500 text-white p-6">
                          <h1 className="text-3xl font-bold">
                            {resumeData.personalInfo.fullName || 'Seu Nome'}
                          </h1>
                          <p className="text-cyan-100 text-lg mt-1">
                            {profile.area || 'Profissional'}
                          </p>
                          <p className="text-sm text-white/90 mt-3 leading-relaxed">
                            {shortSummary}
                          </p>
                        </div>

                        {/* Body - Two Columns */}
                        <div className="flex">
                          {/* Left Sidebar */}
                          <div className="w-1/3 bg-gray-50 p-5">
                            {/* Foto placeholder */}
                            <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-3xl font-bold text-gray-400">
                                {resumeData.personalInfo.fullName?.charAt(0) || '?'}
                              </span>
                            </div>

                            {/* Informacoes Pessoais */}
                            <div className="mb-6">
                              <h3 className="text-cyan-500 font-bold text-sm flex items-center gap-2 mb-3">
                                <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                  <Mail className="h-3 w-3 text-white" />
                                </div>
                                Informacoes pessoais
                              </h3>
                              <div className="space-y-2 text-xs text-gray-600">
                                {resumeData.personalInfo.email && (
                                  <div>
                                    <p className="font-semibold text-gray-800">E-mail</p>
                                    <p className="break-all">{resumeData.personalInfo.email}</p>
                                  </div>
                                )}
                                {resumeData.personalInfo.linkedIn && (
                                  <div>
                                    <p className="font-semibold text-gray-800">LinkedIn</p>
                                    <p>{resumeData.personalInfo.linkedIn}</p>
                                  </div>
                                )}
                                {resumeData.personalInfo.phone && (
                                  <div>
                                    <p className="font-semibold text-gray-800">Telefone</p>
                                    <p>{resumeData.personalInfo.phone}</p>
                                  </div>
                                )}
                                {resumeData.personalInfo.location && (
                                  <div>
                                    <p className="font-semibold text-gray-800">Localizacao</p>
                                    <p>{resumeData.personalInfo.location}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Habilidades */}
                            {resumeData.skills && resumeData.skills.length > 0 && (
                              <div className="mb-6">
                                <h3 className="text-cyan-500 font-bold text-sm flex items-center gap-2 mb-3">
                                  <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                    <Award className="h-3 w-3 text-white" />
                                  </div>
                                  Habilidades
                                </h3>
                                <ul className="space-y-1 text-xs text-gray-600">
                                  {resumeData.skills.slice(0, 8).map((skill, i) => (
                                    <li key={i}>{skill}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Idiomas */}
                            {resumeData.languages && resumeData.languages.length > 0 && (
                              <div>
                                <h3 className="text-cyan-500 font-bold text-sm flex items-center gap-2 mb-3">
                                  <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">A</span>
                                  </div>
                                  Idiomas
                                </h3>
                                <ul className="space-y-1 text-xs text-gray-600">
                                  {resumeData.languages.map((lang, i) => (
                                    <li key={i}>{lang.language} - {lang.level}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Right Content */}
                          <div className="flex-1 p-5">
                            {/* Experiencia */}
                            {resumeData.experiences && resumeData.experiences.length > 0 && (
                              <div className="mb-6">
                                <h3 className="text-cyan-500 font-bold text-sm flex items-center gap-2 mb-4">
                                  <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                    <Briefcase className="h-3 w-3 text-white" />
                                  </div>
                                  Experiencia laboral
                                </h3>
                                {resumeData.experiences.map((exp) => (
                                  <div key={exp.id} className="mb-4 flex gap-3">
                                    <div className="w-20 text-xs text-gray-500 flex-shrink-0">
                                      <p>{formatDate(exp.startDate)}</p>
                                      <p>- {exp.current ? 'atual' : formatDate(exp.endDate || '')}</p>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-bold text-sm text-gray-800">{exp.position}</p>
                                      <p className="text-xs text-gray-500 italic">{exp.company}</p>
                                      {exp.description && (
                                        <p className="text-xs text-gray-600 mt-1">{exp.description}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Formacao Academica */}
                            {resumeData.education && resumeData.education.length > 0 && (
                              <div className="mb-6">
                                <h3 className="text-cyan-500 font-bold text-sm flex items-center gap-2 mb-4">
                                  <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                    <GraduationCap className="h-3 w-3 text-white" />
                                  </div>
                                  Formacao academica
                                </h3>
                                {resumeData.education.map((edu) => (
                                  <div key={edu.id} className="mb-3 flex gap-3">
                                    <div className="w-20 text-xs text-gray-500 flex-shrink-0">
                                      <p>{formatDate(edu.startDate)}</p>
                                      <p>- {edu.current ? 'atual' : formatDate(edu.endDate || '')}</p>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-bold text-sm text-gray-800">{edu.degree}, {edu.field}</p>
                                      <p className="text-xs text-gray-500 italic">{edu.institution}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Certificacoes */}
                            {resumeData.certifications && resumeData.certifications.length > 0 && (
                              <div>
                                <h3 className="text-cyan-500 font-bold text-sm flex items-center gap-2 mb-4">
                                  <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                                    <Award className="h-3 w-3 text-white" />
                                  </div>
                                  Cursos
                                </h3>
                                {resumeData.certifications.map((cert) => (
                                  <div key={cert.id} className="mb-2 flex gap-3">
                                    <div className="w-20 text-xs text-gray-500 flex-shrink-0">
                                      {cert.date}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-bold text-sm text-gray-800">{cert.name}</p>
                                      <p className="text-xs text-gray-500 italic">{cert.issuer}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('template-selection')}
                    className="flex-1 bg-transparent"
                  >
                    Trocar Modelo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 bg-transparent"
                  >
                    Editar Dados
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

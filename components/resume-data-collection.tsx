'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Languages as LanguagesIcon,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Linkedin,
  Globe,
  Github,
  Check,
  FileText,
} from 'lucide-react'
import type { UserProfile, ResumeData } from '@/lib/types'
import { PhotoUpload } from '@/components/photo-upload'

interface ResumeDataCollectionProps {
  profile: UserProfile
  onComplete: (data: ResumeData) => void
  onBack: () => void
}

const STORAGE_KEY = 'resumeAI_draft'

export function ResumeDataCollection({
  profile,
  onComplete,
  onBack,
}: ResumeDataCollectionProps) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          // Ignorar erro
        }
      }
    }
    return {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedIn: '',
        portfolio: '',
        github: '',
        photo: undefined,
      },
      experiences: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      summary: '',
    }
  })

  const totalSteps = 6

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
    }, 500)
    return () => clearTimeout(timer)
  }, [resumeData])

  // Confirm before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasData =
        resumeData.personalInfo.fullName || resumeData.experiences.length > 0
      if (hasData) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [resumeData])

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!resumeData.personalInfo.fullName.trim()) {
        newErrors.fullName = 'Nome completo é obrigatório'
      }
      if (!resumeData.personalInfo.email.trim()) {
        newErrors.email = 'E-mail é obrigatório'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resumeData.personalInfo.email)) {
        newErrors.email = 'E-mail inválido'
      }
      if (!resumeData.personalInfo.phone.trim()) {
        newErrors.phone = 'Telefone é obrigatório'
      }
    }

    if (step === 3) {
      if (resumeData.education.length === 0) {
        newErrors.education = 'Adicione pelo menos uma formação'
      }
    }

    if (step === 4) {
      if (resumeData.skills.length === 0) {
        newErrors.skills = 'Adicione pelo menos uma habilidade'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) {
      return
    }

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      onComplete(resumeData)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      onBack()
    }
  }

  // Experience helpers
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experiences: [
        ...resumeData.experiences,
        {
          id: Date.now().toString(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    })
  }

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.filter((exp) => exp.id !== id),
    })
  }

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData({
      ...resumeData,
      experiences: resumeData.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    })
  }

  // Education helpers
  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: Date.now().toString(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    })
  }

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    })
  }

  const updateEducation = (id: string, field: string, value: any) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    })
  }

  // Skills helpers
  const [newSkill, setNewSkill] = useState('')

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkill.trim()],
      })
      setNewSkill('')
    }
  }

  const removeSkill = (index: number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index),
    })
  }

  // Languages helpers
  const addLanguage = () => {
    setResumeData({
      ...resumeData,
      languages: [...resumeData.languages, { language: '', level: '' }],
    })
  }

  const removeLanguage = (index: number) => {
    setResumeData({
      ...resumeData,
      languages: resumeData.languages.filter((_, i) => i !== index),
    })
  }

  const updateLanguage = (index: number, field: 'language' | 'level', value: string) => {
    setResumeData({
      ...resumeData,
      languages: resumeData.languages.map((lang, i) =>
        i === index ? { ...lang, [field]: value } : lang
      ),
    })
  }

  // Certifications helpers
  const addCertification = () => {
    setResumeData({
      ...resumeData,
      certifications: [
        ...resumeData.certifications,
        {
          id: Date.now().toString(),
          name: '',
          issuer: '',
          date: '',
        },
      ],
    })
  }

  const removeCertification = (id: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter((cert) => cert.id !== id),
    })
  }

  const updateCertification = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-12">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-10">
          <div className="mb-3 flex justify-between">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-sm sm:text-base font-semibold transition-colors ${
                  i + 1 === step
                    ? 'bg-primary text-primary-foreground'
                    : i + 1 < step
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="text-center text-sm sm:text-base text-muted-foreground">
            Etapa {step} de {totalSteps}
          </div>
        </div>

        <div className="mb-20 sm:mb-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="mb-6 text-center">
                    <User className="mx-auto mb-3 h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                    <h2 className="mb-2 text-2xl sm:text-3xl font-bold">
                      Informações Pessoais
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Vamos começar com seus dados de contato
                    </p>
                  </div>

                  <div className="space-y-5 sm:space-y-6">
                    {/* Photo Upload */}
                    <div>
                      <Label className="mb-3 block text-center text-base">
                        Foto Profissional (Opcional)
                      </Label>
                      <PhotoUpload
                        value={resumeData.personalInfo.photo}
                        onChange={(photo) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: {
                              ...resumeData.personalInfo,
                              photo,
                            },
                          })
                        }
                      />
                    </div>

                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName" className="text-base">
                        Nome Completo *
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="João da Silva"
                        className="mt-1.5 text-base h-12 px-4"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: {
                              ...resumeData.personalInfo,
                              fullName: e.target.value,
                            },
                          })
                        }
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-base">
                        E-mail *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="joao@example.com"
                          className="mt-1.5 pl-10 text-base h-12"
                          value={resumeData.personalInfo.email}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: {
                                ...resumeData.personalInfo,
                                email: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-base">
                        Telefone *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(11) 98765-4321"
                          className="mt-1.5 pl-10 text-base h-12"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: {
                                ...resumeData.personalInfo,
                                phone: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <Label htmlFor="location" className="text-base">
                        Localização *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="São Paulo, SP"
                          className="mt-1.5 pl-10 text-base h-12"
                          value={resumeData.personalInfo.location}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: {
                                ...resumeData.personalInfo,
                                location: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <Label htmlFor="linkedIn" className="text-base">
                        LinkedIn (Opcional)
                      </Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="linkedIn"
                          placeholder="linkedin.com/in/seu-perfil"
                          className="mt-1.5 pl-10 text-base h-12"
                          value={resumeData.personalInfo.linkedIn}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: {
                                ...resumeData.personalInfo,
                                linkedIn: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Portfolio */}
                    <div>
                      <Label htmlFor="portfolio" className="text-base">
                        Portfolio (Opcional)
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="portfolio"
                          placeholder="seusite.com"
                          className="mt-1.5 pl-10 text-base h-12"
                          value={resumeData.personalInfo.portfolio}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: {
                                ...resumeData.personalInfo,
                                portfolio: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* GitHub */}
                    <div>
                      <Label htmlFor="github" className="text-base">
                        GitHub (Opcional)
                      </Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="github"
                          placeholder="github.com/seu-usuario"
                          className="mt-1.5 pl-10 text-base h-12"
                          value={resumeData.personalInfo.github}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              personalInfo: {
                                ...resumeData.personalInfo,
                                github: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* STEP 2: Experience */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="mb-6 text-center">
                    <Briefcase className="mx-auto mb-3 h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                    <h2 className="mb-2 text-2xl sm:text-3xl font-bold">
                      Experiência Profissional
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Adicione suas experiências de trabalho
                    </p>
                  </div>

                  <div className="space-y-4">
                    {resumeData.experiences.map((exp, index) => (
                      <Card key={exp.id} className="p-4 sm:p-6 border-2">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            Experiência {index + 1}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-base">Cargo *</Label>
                              <Input
                                placeholder="Desenvolvedor Full Stack"
                                className="mt-1.5 text-base h-12"
                                value={exp.position}
                                onChange={(e) =>
                                  updateExperience(exp.id, 'position', e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-base">Empresa *</Label>
                              <Input
                                placeholder="Tech Company"
                                className="mt-1.5 text-base h-12"
                                value={exp.company}
                                onChange={(e) =>
                                  updateExperience(exp.id, 'company', e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-base">Local</Label>
                            <Input
                              placeholder="São Paulo, SP"
                              className="mt-1.5 text-base h-12"
                              value={exp.location}
                              onChange={(e) =>
                                updateExperience(exp.id, 'location', e.target.value)
                              }
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-base">Data de Início *</Label>
                              <Input
                                type="month"
                                className="mt-1.5 text-base h-12"
                                value={exp.startDate}
                                onChange={(e) =>
                                  updateExperience(exp.id, 'startDate', e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-base">
                                Data de Término {exp.current && '(Atual)'}
                              </Label>
                              <Input
                                type="month"
                                className="mt-1.5 text-base h-12"
                                value={exp.endDate}
                                disabled={exp.current}
                                onChange={(e) =>
                                  updateExperience(exp.id, 'endDate', e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="flex items-center touch-target">
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-border bg-background accent-primary cursor-pointer"
                                checked={exp.current}
                                onChange={(e) =>
                                  updateExperience(exp.id, 'current', e.target.checked)
                                }
                              />
                              <span className="text-sm sm:text-base">Emprego atual</span>
                            </label>
                          </div>

                          <div>
                            <Label className="text-base">Descrição</Label>
                            <Textarea
                              placeholder="Descreva suas responsabilidades e conquistas..."
                              rows={3}
                              className="mt-1.5 text-base min-h-[100px] px-4 py-3"
                              value={exp.description}
                              onChange={(e) =>
                                updateExperience(exp.id, 'description', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full h-12 sm:h-auto bg-transparent touch-target"
                      onClick={addExperience}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Experiência
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* STEP 3: Education */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="mb-6 text-center">
                    <GraduationCap className="mx-auto mb-3 h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                    <h2 className="mb-2 text-2xl sm:text-3xl font-bold">Educação</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Adicione sua formação acadêmica
                    </p>
                  </div>

                  {errors.education && (
                    <p className="mb-4 text-center text-sm text-destructive">
                      {errors.education}
                    </p>
                  )}

                  <div className="space-y-4">
                    {resumeData.education.map((edu, index) => (
                      <Card key={edu.id} className="p-4 sm:p-6 border-2">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Formação {index + 1}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-base">Instituição *</Label>
                            <Input
                              placeholder="Universidade de São Paulo"
                              className="mt-1.5 text-base h-12"
                              value={edu.institution}
                              onChange={(e) =>
                                updateEducation(edu.id, 'institution', e.target.value)
                              }
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-base">Grau *</Label>
                              <Input
                                placeholder="Bacharelado"
                                className="mt-1.5 text-base h-12"
                                value={edu.degree}
                                onChange={(e) =>
                                  updateEducation(edu.id, 'degree', e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-base">Área de Estudo *</Label>
                              <Input
                                placeholder="Ciência da Computação"
                                className="mt-1.5 text-base h-12"
                                value={edu.field}
                                onChange={(e) =>
                                  updateEducation(edu.id, 'field', e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-base">Data de Início *</Label>
                              <Input
                                type="month"
                                className="mt-1.5 text-base h-12"
                                value={edu.startDate}
                                onChange={(e) =>
                                  updateEducation(edu.id, 'startDate', e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-base">
                                Data de Conclusão {edu.current && '(Em andamento)'}
                              </Label>
                              <Input
                                type="month"
                                className="mt-1.5 text-base h-12"
                                value={edu.endDate}
                                disabled={edu.current}
                                onChange={(e) =>
                                  updateEducation(edu.id, 'endDate', e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="flex items-center touch-target">
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-border bg-background accent-primary cursor-pointer"
                                checked={edu.current}
                                onChange={(e) =>
                                  updateEducation(edu.id, 'current', e.target.checked)
                                }
                              />
                              <span className="text-sm sm:text-base">
                                Ainda cursando
                              </span>
                            </label>
                          </div>

                          <div>
                            <Label className="text-base">Descrição (Opcional)</Label>
                            <Textarea
                              placeholder="Atividades extracurriculares, honras, etc..."
                              rows={2}
                              className="mt-1.5 text-base min-h-[80px] px-4 py-3"
                              value={edu.description}
                              onChange={(e) =>
                                updateEducation(edu.id, 'description', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full h-12 sm:h-auto bg-transparent touch-target"
                      onClick={addEducation}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Formação
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* STEP 4: Skills */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="mb-6 text-center">
                    <Award className="mx-auto mb-3 h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                    <h2 className="mb-2 text-2xl sm:text-3xl font-bold">Habilidades</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Liste suas principais competências
                    </p>
                  </div>

                  {errors.skills && (
                    <p className="mb-4 text-center text-sm text-destructive">
                      {errors.skills}
                    </p>
                  )}

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ex: JavaScript, React, Node.js"
                        className="text-base h-12"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addSkill()
                          }
                        }}
                      />
                      <Button
                        onClick={addSkill}
                        className="h-12 px-6 touch-target"
                        disabled={!newSkill.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {resumeData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm sm:text-base"
                          >
                            <span>{skill}</span>
                            <button
                              onClick={() => removeSkill(index)}
                              className="text-primary hover:text-primary/80"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* STEP 5: Languages */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="mb-6 text-center">
                    <LanguagesIcon className="mx-auto mb-3 h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                    <h2 className="mb-2 text-2xl sm:text-3xl font-bold">Idiomas</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Adicione os idiomas que você fala
                    </p>
                  </div>

                  <div className="space-y-4">
                    {resumeData.languages.map((lang, index) => (
                      <Card key={index} className="p-4 border-2">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Input
                              placeholder="Idioma"
                              className="text-base h-12"
                              value={lang.language}
                              onChange={(e) =>
                                updateLanguage(index, 'language', e.target.value)
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <select
                              className="w-full h-12 rounded-md border border-input bg-background px-3 py-2 text-base"
                              value={lang.level}
                              onChange={(e) =>
                                updateLanguage(index, 'level', e.target.value)
                              }
                            >
                              <option value="">Nível</option>
                              <option value="Básico">Básico</option>
                              <option value="Intermediário">Intermediário</option>
                              <option value="Avançado">Avançado</option>
                              <option value="Fluente">Fluente</option>
                              <option value="Nativo">Nativo</option>
                            </select>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLanguage(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full h-12 sm:h-auto bg-transparent touch-target"
                      onClick={addLanguage}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Idioma
                    </Button>
                  </div>

                  {/* Certifications */}
                  <div className="mt-8">
                    <h3 className="mb-4 text-xl font-bold">
                      Certificações (Opcional)
                    </h3>

                    <div className="space-y-4">
                      {resumeData.certifications.map((cert, index) => (
                        <Card key={cert.id} className="p-4 border-2">
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-base font-semibold">
                              Certificação {index + 1}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCertification(cert.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <Input
                              placeholder="Nome da Certificação"
                              className="text-base h-12"
                              value={cert.name}
                              onChange={(e) =>
                                updateCertification(cert.id, 'name', e.target.value)
                              }
                            />
                            <Input
                              placeholder="Emissor"
                              className="text-base h-12"
                              value={cert.issuer}
                              onChange={(e) =>
                                updateCertification(cert.id, 'issuer', e.target.value)
                              }
                            />
                            <Input
                              type="month"
                              placeholder="Data de Emissão"
                              className="text-base h-12"
                              value={cert.date}
                              onChange={(e) =>
                                updateCertification(cert.id, 'date', e.target.value)
                              }
                            />
                          </div>
                        </Card>
                      ))}

                      <Button
                        variant="outline"
                        className="w-full h-12 sm:h-auto bg-transparent touch-target"
                        onClick={addCertification}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Certificação
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* STEP 6: Summary */}
            {step === 6 && (
              <motion.div
                key="step-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="p-6 sm:p-8">
                  <div className="mb-6 text-center">
                    <FileText className="mx-auto mb-3 h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                    <h2 className="mb-2 text-2xl sm:text-3xl font-bold">
                      Resumo Profissional
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Conte um pouco sobre você e seus objetivos
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="summary" className="text-base">
                      Resumo / Objetivo Profissional
                    </Label>
                    <Textarea
                      id="summary"
                      placeholder={`Exemplo para ${profile.type}:\n\n${
                        profile.type === 'first-job'
                          ? 'Estudante de [curso] em busca da primeira oportunidade profissional. Apaixonado por [área] e ansioso para aplicar conhecimentos teóricos em projetos reais.'
                          : profile.type === 'junior'
                            ? 'Profissional júnior com [X] anos de experiência em [área]. Busco oportunidades para desenvolver minhas habilidades e contribuir com projetos desafiadores.'
                            : 'Profissional com [X] anos de experiência em [área], especializado em [tecnologias/habilidades]. Histórico comprovado de [conquistas].'
                      }`}
                      rows={6}
                      className="mt-1.5 text-base min-h-[150px] px-4 py-3"
                      value={resumeData.summary}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          summary: e.target.value,
                        })
                      }
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Este campo será otimizado pela IA na próxima etapa
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-6 sm:mt-8 sticky bottom-0 sm:relative bg-background/95 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none -mx-4 sm:mx-0 px-4 sm:px-0 py-4 sm:py-0 border-t sm:border-0 border-border safe-area-pb">
            <div className="flex gap-3 sm:gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                className="flex-1 sm:flex-none h-12 sm:h-auto bg-transparent touch-target"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button
                size="lg"
                onClick={handleNext}
                className="flex-1 sm:flex-auto h-12 sm:h-auto touch-target"
              >
                <span>{step === totalSteps ? 'Finalizar' : 'Continuar'}</span>
                {step !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
                {step === totalSteps && <Check className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

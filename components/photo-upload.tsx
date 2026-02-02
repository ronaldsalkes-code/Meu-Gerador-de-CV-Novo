'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { User, Upload, X, Loader2 } from 'lucide-react'

interface PhotoUploadProps {
  value?: string
  onChange: (photoUrl: string | undefined) => void
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    setError('')

    // Validação de tipo
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      setError('Por favor, selecione uma imagem JPG, PNG ou WEBP')
      return
    }

    // Validação de tamanho
    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 2MB')
      return
    }

    setIsProcessing(true)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Comprimir para mobile (max 800x800)
          const maxSize = window.innerWidth < 640 ? 600 : 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          const compressed = canvas.toDataURL('image/jpeg', 0.85)
          onChange(compressed)
          setIsProcessing(false)
        }
        img.onerror = () => {
          setError('Erro ao processar imagem')
          setIsProcessing(false)
        }
        img.src = e.target?.result as string
      }
      reader.onerror = () => {
        setError('Erro ao ler arquivo')
        setIsProcessing(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Erro ao processar imagem')
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <div
        className={`relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full border-4 transition-all touch-target ${
          isDragging
            ? 'border-primary bg-primary/5 scale-105'
            : value
              ? 'border-border'
              : 'border-dashed border-border hover:border-primary'
        } ${isProcessing ? 'opacity-50' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <>
            <img
              src={value || '/placeholder.svg'}
              alt="Foto de perfil"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/70 opacity-0 transition-opacity hover:opacity-100 active:opacity-100">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="touch-target"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                Alterar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="touch-target"
                onClick={() => onChange(undefined)}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary/20 hover:bg-secondary/40 active:scale-95 transition-all"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary animate-spin" />
            ) : (
              <>
                <User className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground px-2 text-center">
                  Adicionar foto
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInput}
        disabled={isProcessing}
      />

      {error && (
        <p className="text-center text-sm text-destructive max-w-xs">
          {error}
        </p>
      )}

      <p className="text-center text-xs sm:text-sm text-muted-foreground max-w-xs">
        JPG, PNG ou WEBP • Máx 2MB
        <br className="hidden sm:block" />
        <span className="hidden sm:inline">Arraste e solte ou </span>
        <span className="sm:hidden">Toque para fazer </span>
        <span className="hidden sm:inline">clique para fazer </span>upload
      </p>
    </div>
  )
}

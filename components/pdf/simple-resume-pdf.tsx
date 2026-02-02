import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer'
import type { ResumeData } from '@/lib/types'

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2',
      fontWeight: 700,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
    color: '#000000',
  },
  contactInfo: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 3,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 8,
    color: '#000000',
    borderBottom: '1pt solid #000000',
    paddingBottom: 4,
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 3,
    color: '#000000',
  },
  subsectionSubtitle: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 2,
  },
  text: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#333333',
    marginBottom: 3,
  },
  itemContainer: {
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skill: {
    fontSize: 9,
    color: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  summary: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#333333',
    textAlign: 'justify',
  },
})

interface SimpleResumePDFProps {
  data: ResumeData
  aiContent: string
}

export function SimpleResumePDF({ data, aiContent }: SimpleResumePDFProps) {
  const formatDate = (date: string) => {
    if (!date) return ''
    const [year, month] = date.split('-')
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ]
    return `${months[Number.parseInt(month) - 1]}/${year}`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Photo - Grayscale */}
        {data.personalInfo.photo && (
          <View style={styles.photoContainer}>
            <Image src={data.personalInfo.photo || "/placeholder.svg"} style={styles.photo} />
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          {data.personalInfo.email && (
            <Text style={styles.contactInfo}>{data.personalInfo.email}</Text>
          )}
          {data.personalInfo.phone && (
            <Text style={styles.contactInfo}>{data.personalInfo.phone}</Text>
          )}
          {data.personalInfo.location && (
            <Text style={styles.contactInfo}>
              {data.personalInfo.location}
            </Text>
          )}
          {data.personalInfo.linkedIn && (
            <Text style={styles.contactInfo}>
              {data.personalInfo.linkedIn}
            </Text>
          )}
          {data.personalInfo.portfolio && (
            <Text style={styles.contactInfo}>
              {data.personalInfo.portfolio}
            </Text>
          )}
          {data.personalInfo.github && (
            <Text style={styles.contactInfo}>{data.personalInfo.github}</Text>
          )}
        </View>

        {/* AI Generated Summary - Priority over manual summary */}
        {aiContent && aiContent.length > 50 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESUMO PROFISSIONAL (GERADO POR IA)</Text>
            <Text style={styles.summary}>{aiContent}</Text>
          </View>
        )}

        {/* Manual Summary - Only if no AI content */}
        {(!aiContent || aiContent.length < 50) && data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESUMO PROFISSIONAL</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIÊNCIA PROFISSIONAL</Text>
            {data.experiences.map((exp) => (
              <View key={exp.id} style={styles.itemContainer}>
                <Text style={styles.subsectionTitle}>{exp.position}</Text>
                <Text style={styles.subsectionSubtitle}>
                  {exp.company}
                  {exp.location ? ` • ${exp.location}` : ''}
                </Text>
                <Text style={styles.subsectionSubtitle}>
                  {formatDate(exp.startDate)} -{' '}
                  {exp.current ? 'Presente' : formatDate(exp.endDate || '')}
                </Text>
                {exp.description && (
                  <Text style={styles.text}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCAÇÃO</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.itemContainer}>
                <Text style={styles.subsectionTitle}>
                  {edu.degree} em {edu.field}
                </Text>
                <Text style={styles.subsectionSubtitle}>{edu.institution}</Text>
                <Text style={styles.subsectionSubtitle}>
                  {formatDate(edu.startDate)} -{' '}
                  {edu.current ? 'Em andamento' : formatDate(edu.endDate || '')}
                </Text>
                {edu.description && (
                  <Text style={styles.text}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HABILIDADES</Text>
            <View style={styles.skillsContainer}>
              {data.skills.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>IDIOMAS</Text>
            {data.languages.map((lang, index) => (
              <View key={index} style={styles.languageRow}>
                <Text style={styles.text}>{lang.language}</Text>
                <Text style={styles.text}>{lang.level}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CERTIFICAÇÕES</Text>
            {data.certifications.map((cert) => (
              <View key={cert.id} style={styles.itemContainer}>
                <Text style={styles.subsectionTitle}>{cert.name}</Text>
                <Text style={styles.subsectionSubtitle}>
                  {cert.issuer} • {cert.date}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}

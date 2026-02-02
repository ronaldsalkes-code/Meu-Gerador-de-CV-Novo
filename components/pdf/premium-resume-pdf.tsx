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
  family: 'Poppins',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2',
      fontWeight: 600,
    },
    {
      src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2',
      fontWeight: 700,
    },
  ],
})

Font.register({
  family: 'Merriweather',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5OeyxNV-bnrw.woff2',
      fontWeight: 400,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Poppins',
    fontSize: 10,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  sidebar: {
    width: 180,
    backgroundColor: '#1e3a8a',
    padding: 20,
    color: '#ffffff',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    border: '4pt solid #ffffff',
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 10,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactItem: {
    fontSize: 8,
    marginBottom: 6,
    color: '#e0e7ff',
    lineHeight: 1.3,
  },
  skillBar: {
    marginBottom: 8,
  },
  skillName: {
    fontSize: 8,
    marginBottom: 3,
    color: '#e0e7ff',
  },
  skillBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  skillBarFill: {
    height: 4,
    backgroundColor: '#60a5fa',
    borderRadius: 2,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  languageName: {
    fontSize: 8,
    color: '#e0e7ff',
  },
  languageLevel: {
    fontSize: 8,
    color: '#60a5fa',
    fontWeight: 600,
  },
  mainContent: {
    width: 415,
    padding: 30,
  },
  name: {
    fontFamily: 'Merriweather',
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 6,
    color: '#1e3a8a',
  },
  tagline: {
    fontSize: 11,
    color: '#3b82f6',
    marginBottom: 20,
    fontWeight: 600,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 10,
    color: '#1e3a8a',
    borderBottom: '2pt solid #3b82f6',
    paddingBottom: 4,
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: '#1e3a8a',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 9,
    color: '#3b82f6',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#334155',
    textAlign: 'justify',
  },
  summary: {
    fontSize: 9,
    lineHeight: 1.6,
    color: '#334155',
    textAlign: 'justify',
  },
  certItem: {
    marginBottom: 8,
  },
  certName: {
    fontSize: 10,
    fontWeight: 600,
    color: '#1e3a8a',
  },
  certIssuer: {
    fontSize: 8,
    color: '#64748b',
  },
})

interface PremiumResumePDFProps {
  data: ResumeData
  aiContent: string
}

export function PremiumResumePDF({ data, aiContent }: PremiumResumePDFProps) {
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
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {/* Photo - Colorida */}
          {data.personalInfo.photo && (
            <View style={styles.photoContainer}>
              <Image src={data.personalInfo.photo || "/placeholder.svg"} style={styles.photo} />
            </View>
          )}

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>CONTATO</Text>
            {data.personalInfo.email && (
              <Text style={styles.contactItem}>✉ {data.personalInfo.email}</Text>
            )}
            {data.personalInfo.phone && (
              <Text style={styles.contactItem}>☎ {data.personalInfo.phone}</Text>
            )}
            {data.personalInfo.location && (
              <Text style={styles.contactItem}>
                📍 {data.personalInfo.location}
              </Text>
            )}
            {data.personalInfo.linkedIn && (
              <Text style={styles.contactItem}>
                💼 {data.personalInfo.linkedIn}
              </Text>
            )}
            {data.personalInfo.portfolio && (
              <Text style={styles.contactItem}>
                🌐 {data.personalInfo.portfolio}
              </Text>
            )}
            {data.personalInfo.github && (
              <Text style={styles.contactItem}>
                💻 {data.personalInfo.github}
              </Text>
            )}
          </View>

          {/* Skills com barras visuais */}
          {data.skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>HABILIDADES</Text>
              {data.skills.slice(0, 8).map((skill, index) => (
                <View key={index} style={styles.skillBar}>
                  <Text style={styles.skillName}>{skill}</Text>
                  <View style={styles.skillBarBackground}>
                    <View
                      style={[
                        styles.skillBarFill,
                        { width: `${85 + index * 2}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>IDIOMAS</Text>
              {data.languages.map((lang, index) => (
                <View key={index} style={styles.languageRow}>
                  <Text style={styles.languageName}>{lang.language}</Text>
                  <Text style={styles.languageLevel}>{lang.level}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Header */}
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          <Text style={styles.tagline}>Profissional em Desenvolvimento</Text>

          {/* AI Generated Summary - Priority */}
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
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemSubtitle}>
                    {exp.company}
                    {exp.location ? ` • ${exp.location}` : ''}
                  </Text>
                  <Text style={styles.itemDate}>
                    {formatDate(exp.startDate)} -{' '}
                    {exp.current ? 'Presente' : formatDate(exp.endDate || '')}
                  </Text>
                  {exp.description && (
                    <Text style={styles.itemDescription}>{exp.description}</Text>
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
                  <Text style={styles.itemTitle}>
                    {edu.degree} em {edu.field}
                  </Text>
                  <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                  <Text style={styles.itemDate}>
                    {formatDate(edu.startDate)} -{' '}
                    {edu.current
                      ? 'Em andamento'
                      : formatDate(edu.endDate || '')}
                  </Text>
                  {edu.description && (
                    <Text style={styles.itemDescription}>
                      {edu.description}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CERTIFICAÇÕES</Text>
              {data.certifications.map((cert) => (
                <View key={cert.id} style={styles.certItem}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certIssuer}>
                    {cert.issuer} • {cert.date}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}

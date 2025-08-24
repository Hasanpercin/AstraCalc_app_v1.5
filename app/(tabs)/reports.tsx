import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FileText, Download, Calendar, TrendingUp, Plus } from 'lucide-react-native';

export default function ReportsScreen() {
  const reports = [
    {
      id: 1,
      title: 'Aylık Astroloji Raporu',
      date: '15 Ağustos 2025',
      status: 'Hazır',
      type: 'monthly'
    },
    {
      id: 2,
      title: 'Kişilik Analizi',
      date: '10 Ağustos 2025',
      status: 'Hazır',
      type: 'personality'
    },
    {
      id: 3,
      title: 'Yıllık Öngörüler',
      date: '1 Ağustos 2025',
      status: 'İşleniyor',
      type: 'yearly'
    }
  ];

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Raporlar</Text>
          <Text style={styles.subtitle}>Kişisel astroloji raporlarınız</Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <FileText size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Toplam Rapor</Text>
          </View>
          
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#10B981" />
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Hazır Rapor</Text>
          </View>
        </View>

        {/* Reports List */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Son Raporlar</Text>
          
          {reports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <View style={styles.reportMeta}>
                    <Calendar size={14} color="#94A3B8" />
                    <Text style={styles.reportDate}>{report.date}</Text>
                  </View>
                </View>
                
                <View style={[
                  styles.statusBadge,
                  report.status === 'Hazır' ? styles.statusReady : styles.statusProcessing
                ]}>
                  <Text style={[
                    styles.statusText,
                    report.status === 'Hazır' ? styles.statusReadyText : styles.statusProcessingText
                  ]}>
                    {report.status}
                  </Text>
                </View>
              </View>
              
              {report.status === 'Hazır' && (
                <TouchableOpacity style={styles.downloadButton}>
                  <Download size={16} color="#8B5CF6" />
                  <Text style={styles.downloadText}>İndir</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Generate New Report */}
        <TouchableOpacity style={styles.generateButton}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.generateButtonText}>Yeni Rapor Oluştur</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
  reportsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusReady: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusProcessing: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  statusReadyText: {
    color: '#10B981',
  },
  statusProcessingText: {
    color: '#F59E0B',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  downloadText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  generateButton: {
    backgroundColor: '#8B5CF6',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
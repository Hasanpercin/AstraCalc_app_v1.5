import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, Eye, Database, Users, Mail, ExternalLink } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  const openExternalLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Gizlilik Politikası</Text>
          <Text style={styles.headerSubtitle}>Verileriniz güvende</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Privacy Overview */}
        <View style={styles.overviewCard}>
          <Shield size={32} color="#10B981" />
          <Text style={styles.overviewTitle}>Gizliliğiniz Bizim Önceliğimiz</Text>
          <Text style={styles.overviewText}>
            Astrocalc olarak kişisel verilerinizin güvenliğini ve gizliliğini en üst düzeyde koruyoruz. 
            Bu politika, verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.
          </Text>
        </View>

        {/* Data Collection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={24} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Veri Toplama</Text>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Topladığımız Bilgiler:</Text>
            
            <View style={styles.dataItem}>
              <View style={styles.dataDot} />
              <View style={styles.dataContent}>
                <Text style={styles.dataTitle}>Kişisel Bilgiler</Text>
                <Text style={styles.dataDescription}>
                  İsim, e-posta adresi, doğum tarihi ve yeri gibi astroloji yorumları için gerekli bilgiler
                </Text>
              </View>
            </View>

            <View style={styles.dataItem}>
              <View style={styles.dataDot} />
              <View style={styles.dataContent}>
                <Text style={styles.dataTitle}>Kullanım Verileri</Text>
                <Text style={styles.dataDescription}>
                  Uygulama kullanım istatistikleri, özellik tercihleri ve etkileşim verileri
                </Text>
              </View>
            </View>

            <View style={styles.dataItem}>
              <View style={styles.dataDot} />
              <View style={styles.dataContent}>
                <Text style={styles.dataTitle}>Teknik Bilgiler</Text>
                <Text style={styles.dataDescription}>
                  Cihaz modeli, işletim sistemi, uygulama versiyonu ve hata logları
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data Usage */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Eye size={24} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Veri Kullanımı</Text>
          </View>
          
          <Text style={styles.sectionText}>
            Topladığımız verileri yalnızca aşağıdaki amaçlar için kullanırız:
          </Text>

          <View style={styles.usageList}>
            <Text style={styles.usageItem}>• Kişiselleştirilmiş astroloji yorumları sunmak</Text>
            <Text style={styles.usageItem}>• Uygulama performansını iyileştirmek</Text>
            <Text style={styles.usageItem}>• Kullanıcı deneyimini geliştirmek</Text>
            <Text style={styles.usageItem}>• Teknik destek sağlamak</Text>
            <Text style={styles.usageItem}>• Güvenlik önlemlerini uygulamak</Text>
          </View>
        </View>

        {/* Third Party */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={24} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Üçüncü Taraf Entegrasyonları</Text>
          </View>
          
          <View style={styles.thirdPartyItem}>
            <Text style={styles.thirdPartyTitle}>Supabase (Veritabanı)</Text>
            <Text style={styles.thirdPartyDescription}>
              Kullanıcı verileri ve uygulama içeriği depolaması için güvenli bulut veritabanı hizmeti
            </Text>
          </View>

          <View style={styles.thirdPartyItem}>
            <Text style={styles.thirdPartyTitle}>Google Analytics</Text>
            <Text style={styles.thirdPartyDescription}>
              Anonim kullanım istatistikleri ve uygulama performans analizi
            </Text>
          </View>

          <Text style={styles.guaranteeText}>
            🔒 Hiçbir üçüncü tarafla kişisel verilerinizi satışa sunmayız veya paylaşmayız.
          </Text>
        </View>

        {/* User Rights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={24} color="#10B981" />
            <Text style={styles.sectionTitle}>Kullanıcı Hakları</Text>
          </View>
          
          <Text style={styles.sectionText}>KVKK kapsamında sahip olduğunuz haklar:</Text>

          <View style={styles.rightsList}>
            <View style={styles.rightItem}>
              <Text style={styles.rightTitle}>Erişim Hakkı</Text>
              <Text style={styles.rightDescription}>Hangi verilerinizin saklandığını öğrenme</Text>
            </View>
            
            <View style={styles.rightItem}>
              <Text style={styles.rightTitle}>Düzeltme Hakkı</Text>
              <Text style={styles.rightDescription}>Yanlış verilerin düzeltilmesini talep etme</Text>
            </View>
            
            <View style={styles.rightItem}>
              <Text style={styles.rightTitle}>Silme Hakkı</Text>
              <Text style={styles.rightDescription}>Verilerinizin silinmesini talep etme</Text>
            </View>
            
            <View style={styles.rightItem}>
              <Text style={styles.rightTitle}>İtiraz Hakkı</Text>
              <Text style={styles.rightDescription}>Veri işlenmesine itiraz etme</Text>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Mail size={24} color="#EF4444" />
            <Text style={styles.sectionTitle}>İletişim</Text>
          </View>
          
          <Text style={styles.sectionText}>
            Gizlilik politikası hakkında sorularınız için bizimle iletişime geçin:
          </Text>

          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => openExternalLink('mailto:privacy@astrocalc.com')}
          >
            <Mail size={20} color="#8B5CF6" />
            <Text style={styles.contactButtonText}>privacy@astrocalc.com</Text>
            <ExternalLink size={16} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.addressInfo}>
            <Text style={styles.addressTitle}>Astrocalc</Text>
            <Text style={styles.addressText}>İstanbul, Türkiye</Text>
            <Text style={styles.addressText}>+90 (xxx) xxx xx xx</Text>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>⚖️ Yasal Uyumluluk</Text>
          <Text style={styles.legalText}>
            Bu politika, Kişisel Verilerin Korunması Kanunu (KVKK), 
            Avrupa Birliği Genel Veri Koruma Yönetmeliği (GDPR) ve 
            diğer ilgili mevzuata uygun olarak hazırlanmıştır.
          </Text>
          
          <Text style={styles.updateText}>
            Son güncelleme: 19 Ağustos 2025
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  overviewCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
  },
  overviewTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  overviewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    lineHeight: 22,
    marginBottom: 16,
  },
  subsection: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  subsectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  dataDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
    marginTop: 8,
  },
  dataContent: {
    flex: 1,
  },
  dataTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#E2E8F0',
    marginBottom: 4,
  },
  dataDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 18,
  },
  usageList: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  usageItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    lineHeight: 24,
    marginBottom: 8,
  },
  thirdPartyItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  thirdPartyTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  thirdPartyDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 18,
  },
  guaranteeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    textAlign: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  rightsList: {
    gap: 12,
  },
  rightItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rightTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  rightDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  contactButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    flex: 1,
  },
  addressInfo: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  addressTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  legalSection: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  legalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#93C5FD',
    marginBottom: 12,
  },
  legalText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#BFDBFE',
    lineHeight: 22,
    marginBottom: 16,
  },
  updateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    fontStyle: 'italic',
  },
});
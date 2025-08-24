/**
 * Diagnostic Component for testing in Expo Go
 * Add this component to your app to run diagnostics
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react-native';
import { SupabaseDiagnostics, DiagnosticReport, DiagnosticResult } from './supabase-diagnostics';

export default function DiagnosticsScreen() {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const diagnosticReport = await SupabaseDiagnostics.runFullDiagnostics();
      setReport(diagnosticReport);
      
      // Show summary alert
      Alert.alert(
        'Diagnostics Complete',
        `Status: ${diagnosticReport.overallStatus}\n` +
        `Critical: ${diagnosticReport.summary.critical}\n` +
        `Moderate: ${diagnosticReport.summary.moderate}\n` +
        `Minor: ${diagnosticReport.summary.minor}`
      );
    } catch (error) {
      Alert.alert('Diagnostic Failed', `Error running diagnostics: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS': return <CheckCircle size={20} color="#10B981" />;
      case 'FAIL': return <XCircle size={20} color="#EF4444" />;
      case 'WARNING': return <AlertCircle size={20} color="#F59E0B" />;
      case 'SKIP': return <Clock size={20} color="#64748B" />;
      default: return <Clock size={20} color="#64748B" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS': return '#10B981';
      case 'FAIL': return '#EF4444';
      case 'WARNING': return '#F59E0B';
      case 'SKIP': return '#64748B';
      default: return '#64748B';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return '#EF4444';
      case 'MODERATE': return '#F59E0B';
      case 'MINOR': return '#10B981';
      default: return '#64748B';
    }
  };

  const renderTestResult = (test: DiagnosticResult) => (
    <View key={test.test} style={styles.testCard}>
      <View style={styles.testHeader}>
        <View style={styles.testLeft}>
          {getStatusIcon(test.status)}
          <View style={styles.testInfo}>
            <Text style={styles.testName}>{test.test}</Text>
            <Text style={[styles.testPriority, { color: getPriorityColor(test.priority) }]}>
              {test.priority}
            </Text>
          </View>
        </View>
        <Text style={[styles.testStatus, { color: getStatusColor(test.status) }]}>
          {test.status}
        </Text>
      </View>
      <Text style={styles.testMessage}>{test.message}</Text>
      {test.solution && (
        <View style={styles.solutionContainer}>
          <Text style={styles.solutionLabel}>Solution:</Text>
          <Text style={styles.solutionText}>{test.solution}</Text>
        </View>
      )}
      {test.errorCode && (
        <Text style={styles.errorCode}>Error Code: {test.errorCode}</Text>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Activity size={28} color="#8B5CF6" />
        <Text style={styles.title}>System Diagnostics</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {!report && (
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Supabase & User Page Diagnostics</Text>
            <Text style={styles.introText}>
              Run comprehensive tests to identify connection issues, 
              validate user functionality, and get actionable solutions.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.runButton, loading && styles.runButtonDisabled]}
          onPress={runDiagnostics}
          disabled={loading}
        >
          <Activity size={20} color="#FFFFFF" />
          <Text style={styles.runButtonText}>
            {loading ? 'Running Diagnostics...' : 'Run Full Diagnostics'}
          </Text>
        </TouchableOpacity>

        {report && (
          <>
            {/* Overall Status */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusTitle}>Overall Status</Text>
                <Text style={[
                  styles.statusValue,
                  { color: report.overallStatus === 'HEALTHY' ? '#10B981' : 
                           report.overallStatus === 'DEGRADED' ? '#F59E0B' : '#EF4444' }
                ]}>
                  {report.overallStatus}
                </Text>
              </View>
              <Text style={styles.timestamp}>
                Last Run: {new Date(report.timestamp).toLocaleString()}
              </Text>
            </View>

            {/* Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{report.summary.critical}</Text>
                  <Text style={styles.summaryLabel}>Critical</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{report.summary.moderate}</Text>
                  <Text style={styles.summaryLabel}>Moderate</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{report.summary.minor}</Text>
                  <Text style={styles.summaryLabel}>Minor</Text>
                </View>
              </View>
            </View>

            {/* Connection Tests */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔌 Connection Tests</Text>
              {report.connectionTests.map(renderTestResult)}
            </View>

            {/* User Page Tests */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👤 User Page Tests</Text>
              {report.userPageTests.map(renderTestResult)}
            </View>

            {/* Recommendations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔧 Recommendations</Text>
              <View style={styles.recommendationsCard}>
                {report.recommendations.map((rec, index) => (
                  <Text key={index} style={styles.recommendationText}>
                    {rec}
                  </Text>
                ))}
              </View>
            </View>
          </>
        )}
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
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    lineHeight: 20,
  },
  runButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  runButtonDisabled: {
    backgroundColor: '#64748B',
  },
  runButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  statusCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  statusValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  summaryCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  testCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  testPriority: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  testStatus: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  testMessage: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  solutionContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  solutionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#93C5FD',
    marginBottom: 4,
  },
  solutionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#BFDBFE',
    lineHeight: 16,
  },
  errorCode: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginTop: 4,
  },
  recommendationsCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  recommendationText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    marginBottom: 8,
    lineHeight: 18,
  },
});
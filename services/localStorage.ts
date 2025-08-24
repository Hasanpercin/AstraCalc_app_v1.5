import AsyncStorage from '@react-native-async-storage/async-storage';

interface BirthChartLocalData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  sunSign?: string;
  moonSign?: string;
  risingSign?: string;
  interpretation?: string;
  timestamp: string;
}

export class LocalStorageService {
  private static readonly BIRTH_CHART_KEY = 'birthChartData';

  // Store birth chart data in AsyncStorage
  static async storeBirthChartData(data: BirthChartLocalData): Promise<{ success: boolean; error?: string }> {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(this.BIRTH_CHART_KEY, jsonData);
      console.log('Birth chart data stored in AsyncStorage:', data);
      return { success: true };
    } catch (error) {
      console.error('AsyncStorage storage error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AsyncStorage hatası'
      };
    }
  }

  // Retrieve birth chart data from AsyncStorage
  static async getBirthChartData(): Promise<{ data: BirthChartLocalData | null; error?: string }> {
    try {
      const storedData = await AsyncStorage.getItem(this.BIRTH_CHART_KEY);
      if (!storedData) {
        return { data: null };
      }

      const parsedData: BirthChartLocalData = JSON.parse(storedData);
      console.log('Birth chart data retrieved from AsyncStorage:', parsedData);
      return { data: parsedData };
    } catch (error) {
      console.error('AsyncStorage retrieval error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'AsyncStorage okuma hatası'
      };
    }
  }

  // Clear birth chart data from AsyncStorage
  static async clearBirthChartData(): Promise<{ success: boolean; error?: string }> {
    try {
      await AsyncStorage.removeItem(this.BIRTH_CHART_KEY);
      console.log('Birth chart data cleared from AsyncStorage');
      return { success: true };
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AsyncStorage temizleme hatası'
      };
    }
  }

  // Check if AsyncStorage is available
  static isLocalStorageAvailable(): boolean {
    try {
      return !!AsyncStorage;
    } catch {
      return false;
    }
  }

  // Initialize sample data for testing
  static async initializeSampleData(): Promise<void> {
    const sampleData: BirthChartLocalData = {
      fullName: "Hasan Perçin",
      birthDate: "26/02/1990",
      birthTime: "22:30",
      birthPlace: "İzmir",
      sunSign: "Balık",
      moonSign: "Balık",
      risingSign: "Akrep",
      interpretation: `Sevgili Hasan Perçin, haritana baktığımda derin suyun ve kararlılığın iç içe geçtiği bir enerji görüyorum: sezgilerin sana rehberlik eder, köklerin sana güvenli bir alan verir. Dışa dönük olduğunda bile yüreğin merhametle ve yaratıcı bir akışla parlar; bu denge, karşılaştığın zorluklarda sana sakin ve kararlı adımlar attırır. ✨🪐

Doğum haritanın ana motifi, yükselen Akrep'in gizemli gücüyle birlikte Balık'ın duyarlılığı ve hayal gücü arasında nazik bir köprü kurar. Görünmeyeni hissetme yeteneğin ve derin bağlar kurma arzun, sana içsel aydınlanmayı ve güvenli kökleri aynı anda sunar. Bu üçlü, duygusal zekâ ile sezgiyi bir araya getirerek sana hem içtenlikte hem de zarafette parlayan bir ışık verir.

Dinamikler ve iç denge konusunda, Güneş'in iyimser enerjiyle bir uyum yakalaması sana büyüme için alan açar; Ay ile Venüs arasındaki zarif akış ise ilişkilerde güvenli ve hoş bir duygusal atmosfer kurmanı destekler. İç dünyanda sınırları belirlemek ve sorumluluk duygusunu canlı tutmak, duygusal derinliğini olgunlaştırmana yardımcı olur. Bu kombinasyon, köklerin sağlamlığıyla sezgilerin akışkanlığı arasında sana doğal bir denge sunar.

Yıldızlar sana yol göstersin, Hasan Perçin. ✨🪐🌗`,
      timestamp: new Date().toISOString()
    };

    await this.storeBirthChartData(sampleData);
  }
}
import { ZodiacSign, ZodiacData, DailyZodiacHoroscope, ZodiacCompatibility } from '@/types/zodiac';

export class ZodiacService {
  private static zodiacData: ZodiacData = {
    koç: {
      id: 'aries',
      name: 'Koç',
      symbol: '♈',
      element: 'Ateş',
      dates: '21 Mart - 19 Nisan',
      description: 'Koç burcu, cesaret ve kararlılığın sembolüdür. Doğal liderlik özelliklerine sahip olan Koçlar, hırslı ve enerjik kişilerdir.',
      traits: {
        positive: ['Cesur', 'Kararlı', 'Enerjik', 'Lider ruhlu', 'Girişimci'],
        negative: ['Sabırsız', 'Aceleci', 'İnatçı', 'Agresif', 'Düşüncesiz']
      },
      compatibility: ['Aslan', 'Yay', 'İkizler'],
      luckyNumbers: [1, 8, 17, 25],
      luckyColors: ['Kırmızı', 'Turuncu', 'Sarı'],
      planet: 'Mars',
      gemstone: 'Elmas',
      bodyPart: 'Kafa, Beyin'
    },
    boğa: {
      id: 'taurus',
      name: 'Boğa',
      symbol: '♉',
      element: 'Toprak',
      dates: '20 Nisan - 20 Mayıs',
      description: 'Boğa burcu, kararlılık ve dayanıklılığın temsilcisidir. Güvenilir ve sabırlı olan Boğalar, güzellik ve konforu severler.',
      traits: {
        positive: ['Güvenilir', 'Sabırlı', 'Kararlı', 'Sadık', 'Pratik'],
        negative: ['İnatçı', 'Possesif', 'Materialist', 'Değişime kapalı', 'Tembellik eğilimi']
      },
      compatibility: ['Başak', 'Oğlak', 'Yengeç'],
      luckyNumbers: [2, 6, 9, 12],
      luckyColors: ['Yeşil', 'Pembe', 'Mavi'],
      planet: 'Venüs',
      gemstone: 'Zümrüt',
      bodyPart: 'Boyun, Boğaz'
    },
    ikizler: {
      id: 'gemini',
      name: 'İkizler',
      symbol: '♊',
      element: 'Hava',
      dates: '21 Mayıs - 20 Haziran',
      description: 'İkizler burcu, iletişim ve uyum yeteneğinin simgesidir. Zeki ve sosyal olan İkizler, meraklı ve değişken bir yapıya sahiptir.',
      traits: {
        positive: ['Zeki', 'İletişim yeteneği güçlü', 'Adaptasyonu kolay', 'Yaratıcı', 'Sosyal'],
        negative: ['Kararsız', 'Yüzeysel', 'Sinirli', 'Güvenilmez', 'Dikkatsiz']
      },
      compatibility: ['Terazi', 'Kova', 'Koç'],
      luckyNumbers: [5, 7, 14, 23],
      luckyColors: ['Sarı', 'Gümüş', 'Gri'],
      planet: 'Merkür',
      gemstone: 'Akik',
      bodyPart: 'Eller, Kollar, Akciğerler'
    },
    yengeç: {
      id: 'cancer',
      name: 'Yengeç',
      symbol: '♋',
      element: 'Su',
      dates: '21 Haziran - 22 Temmuz',
      description: 'Yengeç burcu, duygusallık ve koruyuculuğun sembolüdür. Hassas ve empatik olan Yengeçler, aile ve yuva sevgisi güçlüdür.',
      traits: {
        positive: ['Koruyucu', 'Empatik', 'Sadık', 'İçgüdüleri güçlü', 'Aileci'],
        negative: ['Aşırı hassas', 'Karamsar', 'Manipülatif', 'Geçmişe takılı', 'Değişken ruh hali']
      },
      compatibility: ['Akrep', 'Balık', 'Boğa'],
      luckyNumbers: [2, 7, 11, 16],
      luckyColors: ['Beyaz', 'Gümüş', 'Deniz Mavisi'],
      planet: 'Ay',
      gemstone: 'Inci',
      bodyPart: 'Göğüs, Mide'
    },
    aslan: {
      id: 'leo',
      name: 'Aslan',
      symbol: '♌',
      element: 'Ateş',
      dates: '23 Temmuz - 22 Ağustos',
      description: 'Aslan burcu, gurur ve cömertliğin temsilcisidir. Doğal liderlik özelliklerine sahip olan Aslanlar, dramatik ve yaratıcıdır.',
      traits: {
        positive: ['Lider', 'Yaratıcı', 'Cömert', 'Sadık', 'Kendine güvenli'],
        negative: ['Gururlu', 'Bencil', 'Kontrolcü', 'Kibirli', 'Otoriter']
      },
      compatibility: ['Yay', 'Koç', 'İkizler'],
      luckyNumbers: [1, 3, 10, 19],
      luckyColors: ['Altın', 'Turuncu', 'Kırmızı'],
      planet: 'Güneş',
      gemstone: 'Sardoniks',
      bodyPart: 'Kalp, Sırt'
    },
    başak: {
      id: 'virgo',
      name: 'Başak',
      symbol: '♍',
      element: 'Toprak',
      dates: '23 Ağustos - 22 Eylül',
      description: 'Başak burcu, mükemmeliyetçilik ve analitik düşüncenin simgesidir. Detaycı ve çalışkan olan Başaklar, hizmet etmeyi severler.',
      traits: {
        positive: ['Analitik', 'Detaycı', 'Güvenilir', 'Alçakgönüllü', 'Çalışkan'],
        negative: ['Mükemmeliyetçi', 'Eleştirci', 'Endişeli', 'Çekingen', 'Aşırı titiz']
      },
      compatibility: ['Boğa', 'Oğlak', 'Yengeç'],
      luckyNumbers: [6, 15, 20, 27],
      luckyColors: ['Lacivert', 'Gri', 'Yeşil'],
      planet: 'Merkür',
      gemstone: 'Safir',
      bodyPart: 'Karın, Bağırsaklar'
    },
    terazi: {
      id: 'libra',
      name: 'Terazi',
      symbol: '♎',
      element: 'Hava',
      dates: '23 Eylül - 22 Ekim',
      description: 'Terazi burcu, denge ve adaletin sembolüdür. Diplomatik ve estetik zevki yüksek olan Teraziler, uyum arar.',
      traits: {
        positive: ['Diplomatik', 'Adil', 'Sosyal', 'Romantik', 'Zarif'],
        negative: ['Kararsız', 'Yüzeysel', 'Çelişkili', 'Tembellik eğilimi', 'Manipülatif']
      },
      compatibility: ['İkizler', 'Kova', 'Aslan'],
      luckyNumbers: [6, 15, 24, 33],
      luckyColors: ['Pembe', 'Mavi', 'Açık yeşil'],
      planet: 'Venüs',
      gemstone: 'Opal',
      bodyPart: 'Böbrekler, Bel'
    },
    akrep: {
      id: 'scorpio',
      name: 'Akrep',
      symbol: '♏',
      element: 'Su',
      dates: '23 Ekim - 21 Kasım',
      description: 'Akrep burcu, tutku ve dönüşümün temsilcisidir. Derin ve gizemli olan Akrepler, güçlü sezgilere sahiptir.',
      traits: {
        positive: ['Tutkulu', 'Sadık', 'Cesur', 'Kararlı', 'Sezgileri güçlü'],
        negative: ['Kıskanç', 'İntikamcı', 'Gizli saklı', 'Obsesif', 'Kontrol manyağı']
      },
      compatibility: ['Yengeç', 'Balık', 'Başak'],
      luckyNumbers: [8, 13, 18, 27],
      luckyColors: ['Bordo', 'Siyah', 'Kırmızı'],
      planet: 'Mars/Plüton',
      gemstone: 'Topaz',
      bodyPart: 'Cinsel organlar, Mesane'
    },
    yay: {
      id: 'sagittarius',
      name: 'Yay',
      symbol: '♐',
      element: 'Ateş',
      dates: '22 Kasım - 21 Aralık',
      description: 'Yay burcu, özgürlük ve macera sevgisinin simgesidir. İyimser ve felsefi olan Yaylar, keşfetmeyi ve öğrenmeyi severler.',
      traits: {
        positive: ['İyimser', 'Özgür ruhlu', 'Maceracı', 'Dürüst', 'Felsefi'],
        negative: ['Düşüncesiz', 'Sabırsız', 'Taktısız', 'Sorumsuz', 'Küstah']
      },
      compatibility: ['Aslan', 'Koç', 'Terazi'],
      luckyNumbers: [3, 9, 15, 21],
      luckyColors: ['Mor', 'Turkuaz', 'Kırmızı'],
      planet: 'Jüpiter',
      gemstone: 'Firuze',
      bodyPart: 'Kalçalar, Uyluklar'
    },
    oğlak: {
      id: 'capricorn',
      name: 'Oğlak',
      symbol: '♑',
      element: 'Toprak',
      dates: '22 Aralık - 19 Ocak',
      description: 'Oğlak burcu, disiplin ve başarının temsilcisidir. Çalışkan ve kararlı olan Oğlaklar, hedeflerine ulaşmak için sabırla çalışır.',
      traits: {
        positive: ['Disiplinli', 'Çalışkan', 'Sabırlı', 'Güvenilir', 'Başarı odaklı'],
        negative: ['Katı', 'Karamsar', 'Kontrol manyağı', 'Materialist', 'Sosyal olmayan']
      },
      compatibility: ['Boğa', 'Başak', 'Akrep'],
      luckyNumbers: [10, 16, 25, 31],
      luckyColors: ['Kahverengi', 'Siyah', 'Gri'],
      planet: 'Satürn',
      gemstone: 'Garnet',
      bodyPart: 'Dizler, Kemikler'
    },
    kova: {
      id: 'aquarius',
      name: 'Kova',
      symbol: '♒',
      element: 'Hava',
      dates: '20 Ocak - 18 Şubat',
      description: 'Kova burcu, yenilik ve bağımsızlığın simgesidir. Özgün ve insancıl olan Kovalar, geleceğe yönelik vizyonlara sahiptir.',
      traits: {
        positive: ['Özgün', 'İnsancıl', 'Bağımsız', 'Yaratıcı', 'Gelecek odaklı'],
        negative: ['Soğuk', 'İnatçı', 'Değişken', 'Çelişkili', 'Antisosyal']
      },
      compatibility: ['İkizler', 'Terazi', 'Yay'],
      luckyNumbers: [4, 11, 22, 29],
      luckyColors: ['Mavi', 'Gümüş', 'Elektrik mavisi'],
      planet: 'Uranüs/Satürn',
      gemstone: 'Ametist',
      bodyPart: 'Baldır, Ayak bileği'
    },
    balık: {
      id: 'pisces',
      name: 'Balık',
      symbol: '♓',
      element: 'Su',
      dates: '19 Şubat - 20 Mart',
      description: 'Balık burcu, empati ve hayal gücünün temsilcisidir. Duygusal ve sezgisel olan Balıklar, sanatsal yeteneklere sahiptir.',
      traits: {
        positive: ['Empatik', 'Yaratıcı', 'Sezgisel', 'Şefkatli', 'Fedakâr'],
        negative: ['Aşırı duygusal', 'Kararsız', 'Kaçış eğilimi', 'Naif', 'Savunmasız']
      },
      compatibility: ['Yengeç', 'Akrep', 'Oğlak'],
      luckyNumbers: [7, 12, 16, 21],
      luckyColors: ['Deniz yeşili', 'Lavendel', 'Beyaz'],
      planet: 'Neptün/Jüpiter',
      gemstone: 'Akuamarin',
      bodyPart: 'Ayaklar, İmmün sistem'
    }
  };

  /**
   * Tüm burç verilerini getirir
   */
  static getAllZodiacSigns(): ZodiacData {
    return this.zodiacData;
  }

  /**
   * Belirli bir burç hakkında bilgi getirir
   */
  static getZodiacSign(signName: string): ZodiacSign | null {
    const normalizedName = signName.toLowerCase().trim();
    return this.zodiacData[normalizedName] || null;
  }

  /**
   * Doğum tarihine göre burcu hesaplar
   */
  static getZodiacByBirthDate(birthDate: Date): ZodiacSign | null {
    const month = birthDate.getMonth() + 1; // 0-11 to 1-12
    const day = birthDate.getDate();

    // Burç tarih aralıkları
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      return this.zodiacData.koç;
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      return this.zodiacData.boğa;
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      return this.zodiacData.ikizler;
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      return this.zodiacData.yengeç;
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      return this.zodiacData.aslan;
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      return this.zodiacData.başak;
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      return this.zodiacData.terazi;
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      return this.zodiacData.akrep;
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      return this.zodiacData.yay;
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      return this.zodiacData.oğlak;
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      return this.zodiacData.kova;
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      return this.zodiacData.balık;
    }

    return null;
  }

  /**
   * İki burç arasındaki uyumu hesaplar
   */
  static calculateCompatibility(sign1: string, sign2: string): ZodiacCompatibility | null {
    const zodiac1 = this.getZodiacSign(sign1);
    const zodiac2 = this.getZodiacSign(sign2);

    if (!zodiac1 || !zodiac2) {
      return null;
    }

    const isCompatible = zodiac1.compatibility.includes(zodiac2.name);
    const compatibilityScore = isCompatible ? 85 : 45;

    return {
      sign1: zodiac1.name,
      sign2: zodiac2.name,
      compatibilityScore,
      description: isCompatible 
        ? `${zodiac1.name} ve ${zodiac2.name} burçları yüksek uyuma sahiptir.`
        : `${zodiac1.name} ve ${zodiac2.name} burçları orta düzey uyuma sahiptir.`,
      strengths: isCompatible 
        ? ['Ortak değerler', 'Güçlü iletişim', 'Karşılıklı anlayış']
        : ['Karşıt özellikler', 'Öğrenme fırsatı'],
      challenges: isCompatible
        ? ['Aşırı benzerlik', 'Rutin düşme riski']
        : ['Farklı yaklaşımlar', 'İletişim zorlukları', 'Değer farklılıkları']
    };
  }

  /**
   * Element bazında uyumu kontrol eder
   */
  static getElementCompatibility(element1: string, element2: string): boolean {
    const compatibleElements: { [key: string]: string[] } = {
      'Ateş': ['Hava', 'Ateş'],
      'Toprak': ['Su', 'Toprak'],
      'Hava': ['Ateş', 'Hava'],
      'Su': ['Toprak', 'Su']
    };

    return compatibleElements[element1]?.includes(element2) || false;
  }

  /**
   * Günlük burç yorumu oluşturur (mock data)
   */
  static generateDailyHoroscope(signName: string, date: Date): DailyZodiacHoroscope | null {
    const zodiac = this.getZodiacSign(signName);
    if (!zodiac) return null;

    const horoscopes = [
      "Bugün enerjiniz yüksek. Yeni projelere başlamak için ideal bir gün.",
      "Sabırlı olun ve planlarınızı dikkatlice gözden geçirin.",
      "İletişiminize özen gösterin. Yanlış anlaşılmalar olabilir.",
      "Yaratıcılığınızı ön plana çıkaracak fırsatlar sizi bekliyor.",
      "Finansal konularda dikkatli olun. Gereksiz harcamalardan kaçının."
    ];

    const randomIndex = Math.floor(Math.random() * horoscopes.length);

    return {
      id: `${zodiac.id}-${date.getTime()}`,
      zodiacSign: zodiac.name,
      date: date.toISOString(),
      generalFortune: horoscopes[randomIndex],
      loveFortune: "Aşk hayatınızda pozitif gelişmeler olabilir.",
      careerFortune: "Kariyerinizde yeni fırsatlar doğabilir.",
      healthFortune: "Sağlığınıza dikkat edin ve düzenli beslenin.",
      luckyColor: zodiac.luckyColors[0],
      luckyNumber: zodiac.luckyNumbers[0],
      compatibility: zodiac.compatibility[0],
      advice: "Kendinize güvenin ve pozitif düşünün.",
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Burç listesini alfabetik sıraya göre getirir
   */
  static getZodiacSignsList(): ZodiacSign[] {
    return Object.values(this.zodiacData).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Element bazında burçları gruplar
   */
  static getSignsByElement(): { [key: string]: ZodiacSign[] } {
    const result: { [key: string]: ZodiacSign[] } = {
      'Ateş': [],
      'Toprak': [],
      'Hava': [],
      'Su': []
    };

    Object.values(this.zodiacData).forEach(sign => {
      result[sign.element].push(sign);
    });

    return result;
  }
}
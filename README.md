# Astrocalc - Astroloji Mobil Uygulaması

Modern ve kullanıcı dostu bir astroloji uygulaması. React Native Expo framework'ü kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### ✨ Temel Özellikler
- **Ana Sayfa**: Günlük yorumlar ve hızlı erişim
- **Doğum Haritası**: Kişisel astroloji haritası oluşturma
- **Raporlar**: Detaylı astroloji raporları
- **Astrocalc AI**: Yapay zeka destekli astroloji danışmanı
- **Ayarlar**: Kullanıcı profili ve uygulama ayarları

### 🎨 Tasarım Özellikleri
- Karanlık tema ile premium görünüm
- Gradient mor-mavi renk paleti
- Smooth animasyonlar ve micro-interactions
- Apple-seviye tasarım estetiği
- Responsive tasarım (iOS/Android uyumlu)

### 🔧 Teknik Özellikler
- **Framework**: React Native Expo
- **Veritabanı**: Supabase
- **Navigasyon**: Expo Router (Tab-based)
- **Yazı Tipi**: Inter Google Font
- **Animasyonlar**: React Native Reanimated
- **Gesture Handling**: React Native Gesture Handler

## 📁 Proje Yapısı

```
/
├── app/                          # Ana uygulama dosyaları
│   ├── (tabs)/                   # Tab navigasyonu
│   │   ├── _layout.tsx          # Tab layout konfigürasyonu
│   │   ├── index.tsx            # Ana sayfa
│   │   ├── birth-chart.tsx      # Doğum haritası
│   │   ├── reports.tsx          # Raporlar
│   │   ├── ai.tsx               # AI Chat
│   │   └── settings.tsx         # Ayarlar
│   ├── _layout.tsx              # Root layout
│   ├── welcome.tsx              # Hoş geldin ekranı
│   └── register.tsx             # Kayıt formu
├── components/                   # Yeniden kullanılabilir bileşenler
│   ├── DateTimePicker.tsx       # Tarih/saat seçici
│   └── FormInput.tsx            # Form input bileşeni
├── lib/                         # Harici kütüphane yapılandırmaları
│   └── supabase.ts              # Supabase istemci
├── services/                    # Servis katmanı
│   └── webhook.ts               # Webhook entegrasyonu
├── hooks/                       # Custom React hook'ları
│   ├── useAuth.ts               # Authentication hook
│   └── useFrameworkReady.ts     # Framework hazırlık hook'u
├── utils/                       # Yardımcı fonksiyonlar
│   └── validation.ts            # Form validasyon
├── types/                       # TypeScript tip tanımları
│   └── index.ts                 # Ana tip tanımları
└── constants/                   # Sabitler
    └── Colors.ts                # Renk paleti
```

## 🛠 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+ 
- Expo CLI
- iOS Simulator (Mac) veya Android Emulator

### Kurulum Adımları

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Supabase konfigürasyonu:**
   - Supabase hesabı oluşturun
   - Yeni proje oluşturun
   - `.env` dosyasına API bilgilerini ekleyin:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   EXPO_PUBLIC_WEBHOOK_URL=your-webhook-url
   EXPO_PUBLIC_WEBHOOK_TOKEN=your-webhook-token
   ```

3. **Veritabanı şemasını oluşturun:**
   ```sql
   -- User profiles table
   CREATE TABLE user_profiles (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     first_name TEXT,
     last_name TEXT,
     full_name TEXT NOT NULL,
     email TEXT,
     phone TEXT,
     status TEXT DEFAULT 'active',
     profile_completed BOOLEAN DEFAULT false,
     email_verified BOOLEAN DEFAULT false,
     metadata JSONB DEFAULT '{}',
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
   );

   -- Birth data table
   CREATE TABLE birth_data (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     full_name TEXT NOT NULL,
     birth_date DATE NOT NULL,
     birth_time TIME NOT NULL,
     birth_place TEXT NOT NULL,
     latitude DECIMAL(10, 8),
     longitude DECIMAL(11, 8),
     timezone TEXT,
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
   );

   -- Enable RLS
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE birth_data ENABLE ROW LEVEL SECURITY;

   -- RLS Policies
   CREATE POLICY "Users can read own profile"
     ON user_profiles FOR SELECT
     TO authenticated
     USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    TO anon, authenticated
    WITH CHECK (auth.uid() = user_id);

   -- Create user registration trigger (REQUIRED)
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   DECLARE
     _full_name TEXT;
     _first_name TEXT;
     _last_name TEXT;
     _email TEXT;
   BEGIN
     -- Get full_name from metadata, fallback to empty string
     _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
     
     -- Get email from the auth.users record
     _email := COALESCE(NEW.email, '');

     -- Split full_name into first_name and last_name
     IF _full_name IS NOT NULL AND _full_name != '' THEN
       -- Split by first space
       _first_name := COALESCE(split_part(_full_name, ' ', 1), '');
       _last_name := COALESCE(trim(substring(_full_name from length(_first_name) + 2)), '');
       
       -- If no last name, use first name as last name
       IF _last_name = '' THEN
         _last_name := _first_name;
       END IF;
     ELSE
       -- Fallback values if no full_name provided
       _first_name := 'Kullanıcı';
       _last_name := 'Yeni';
       _full_name := _first_name || ' ' || _last_name;
     END IF;

     -- Insert into user_profiles with all required fields
     INSERT INTO public.user_profiles (
       user_id, 
       email, 
       full_name, 
       first_name, 
       last_name,
       status,
       profile_completed,
       email_verified,
       metadata
     )
     VALUES (
       NEW.id, 
       _email, 
       _full_name, 
       _first_name, 
       _last_name,
       'active',
       false,
       false,
       '{}'
     );
     RETURN NEW;
   EXCEPTION
     WHEN OTHERS THEN
       -- Log the error for debugging
       RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
       -- Still return NEW to not block user creation
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE OR REPLACE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

   CREATE POLICY "Allow anon profile creation during registration"
     ON user_profiles FOR INSERT
     TO anon
     WITH CHECK (true);

   CREATE POLICY "Users can update own profile"
     ON user_profiles FOR UPDATE
     TO authenticated
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can read own birth data"
     ON birth_data FOR SELECT
     TO authenticated
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own birth data"
     ON birth_data FOR INSERT
     TO authenticated
     WITH CHECK (auth.uid() = user_id);
   ```

4. **Uygulamayı başlatın:**
   ```bash
   npm run dev
   ```

## 🔗 Webhook Entegrasyonu

### Webhook Endpoint Yapısı

Webhook endpoint'iniz aşağıdaki JSON formatında veri alacak:

```json
{
  "fullName": "Örnek Kullanıcı",
  "birthDate": "1990-01-15",
  "birthTime": "14:30:00",
  "birthPlace": "İstanbul, Türkiye",
  "userId": "user-uuid",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "source": "astrocalc-mobile"
}
```

### Webhook Response Formatı

Webhook'unuz aşağıdaki formatında yanıt döndürmelidir:

```json
{
  "success": true,
  "message": "Birth data processed successfully",
  "data": {
    "birth_chart": { /* chart data */ },
    "planetary_positions": { /* positions */ },
    "houses": { /* house data */ }
  }
}
```

## 🔒 Güvenlik

- **Row Level Security (RLS)**: Tüm tablolarda etkin
- **Authentication**: Supabase Auth kullanımı
- **Data Validation**: Kapsamlı form validasyonu
- **Secure API**: Webhook token doğrulaması

## 📱 Platform Desteği

- **iOS**: Tam destek
- **Android**: Tam destek  
- **Web**: Kısıtlı destek (development preview için)

## 🎯 Geliştirme Aşamaları

### Faz 1: Temel Altyapı (Tamamlandı)
- ✅ Proje kurulumu ve konfigürasyonu
- ✅ Navigasyon yapısı
- ✅ UI bileşenleri ve tasarım sistemi
- ✅ Supabase entegrasyonu
- ✅ Authentication sistemi

### Faz 2: Core Özellikler (Geliştirme)
- 🔄 Doğum haritası hesaplama
- 🔄 Webhook entegrasyonu testing
- 🔄 AI chat functionality
- 🔄 Rapor oluşturma sistemi

### Faz 3: Gelişmiş Özellikler (Planlı)
- 📋 Push bildirimleri
- 📋 Günlük horoscope
- 📋 Uyumluluk analizi
- 📋 Sosyal paylaşım

### Faz 4: Optimizasyon (Planlı)
- 📋 Performance iyileştirmeleri
- 📋 Offline çalışma desteği
- 📋 Advanced caching
- 📋 Analytics entegrasyonu

## 🚀 Deployment

### Build Commands
```bash
# Web build
npm run build:web

# iOS build (requires Mac and Xcode)
expo build:ios

# Android build
expo build:android
```

### Environment Variables (Production)
```env
EXPO_PUBLIC_SUPABASE_URL=your-production-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-anon-key
EXPO_PUBLIC_WEBHOOK_URL=your-production-webhook-url
EXPO_PUBLIC_WEBHOOK_TOKEN=your-production-webhook-token
```

## 📝 API Dokümantasyonu

### Webhook API
```typescript
POST /webhook/birth-data
Content-Type: application/json
Authorization: Bearer your-webhook-token

Body: {
  fullName: string;
  birthDate: string; // ISO date
  birthTime: string; // HH:MM:SS format
  birthPlace: string;
  userId: string;
  timestamp: string; // ISO date
  source: string;
}
```

## 🤝 Katkıda Bulunma

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Create Pull Request

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
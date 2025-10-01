-- =============================================
-- COMPLETE ZODIAC SETUP FOR ASTRO CALC
-- Run this entire script in Supabase SQL Editor
-- =============================================

-- =============================================
-- STEP 1: Create Tables
-- =============================================

-- 1.1 Zodiac Signs Table (12 Burç)
CREATE TABLE IF NOT EXISTS public.zodiac_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  english_name VARCHAR(50) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  element VARCHAR(20) NOT NULL CHECK (element IN ('Ateş', 'Toprak', 'Hava', 'Su')),
  quality VARCHAR(20) CHECK (quality IN ('Öncü', 'Sabit', 'Değişken')),
  date_range VARCHAR(50) NOT NULL,
  start_day INT NOT NULL CHECK (start_day BETWEEN 1 AND 31),
  start_month INT NOT NULL CHECK (start_month BETWEEN 1 AND 12),
  end_day INT NOT NULL CHECK (end_day BETWEEN 1 AND 31),
  end_month INT NOT NULL CHECK (end_month BETWEEN 1 AND 12),
  traits_positive TEXT[],
  traits_negative TEXT[],
  keywords TEXT[],
  ruling_planet VARCHAR(50),
  gemstone VARCHAR(100),
  lucky_numbers INT[],
  lucky_colors TEXT[],
  lucky_day VARCHAR(20),
  compatibility_high TEXT[],
  compatibility_low TEXT[],
  description TEXT,
  detailed_description TEXT,
  love_description TEXT,
  career_description TEXT,
  health_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_zodiac_signs_name ON public.zodiac_signs(name);
CREATE INDEX IF NOT EXISTS idx_zodiac_signs_element ON public.zodiac_signs(element);

-- 1.2 Daily Predictions Table (AI Günlük Yorumlar)
CREATE TABLE IF NOT EXISTS public.zodiac_daily_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zodiac_sign_id UUID NOT NULL REFERENCES public.zodiac_signs(id) ON DELETE CASCADE,
  prediction_date DATE NOT NULL,
  general_fortune TEXT NOT NULL,
  love_fortune TEXT,
  career_fortune TEXT,
  health_fortune TEXT,
  money_fortune TEXT,
  lucky_number INT,
  lucky_color VARCHAR(50),
  lucky_hour VARCHAR(20),
  mood_score INT CHECK (mood_score BETWEEN 1 AND 10),
  is_ai_generated BOOLEAN DEFAULT TRUE,
  ai_model VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(zodiac_sign_id, prediction_date)
);

CREATE INDEX IF NOT EXISTS idx_zodiac_daily_predictions_zodiac ON public.zodiac_daily_predictions(zodiac_sign_id);
CREATE INDEX IF NOT EXISTS idx_zodiac_daily_predictions_date ON public.zodiac_daily_predictions(prediction_date);

-- 1.3 Compatibility Table (Burç Uyumluluğu)
CREATE TABLE IF NOT EXISTS public.zodiac_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zodiac_sign_1_id UUID NOT NULL REFERENCES public.zodiac_signs(id) ON DELETE CASCADE,
  zodiac_sign_2_id UUID NOT NULL REFERENCES public.zodiac_signs(id) ON DELETE CASCADE,
  overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
  love_score INT CHECK (love_score BETWEEN 0 AND 100),
  friendship_score INT CHECK (friendship_score BETWEEN 0 AND 100),
  work_score INT CHECK (work_score BETWEEN 0 AND 100),
  strengths TEXT[],
  challenges TEXT[],
  advice TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(zodiac_sign_1_id, zodiac_sign_2_id),
  CHECK (zodiac_sign_1_id != zodiac_sign_2_id)
);

CREATE INDEX IF NOT EXISTS idx_zodiac_compat_sign1 ON public.zodiac_compatibility(zodiac_sign_1_id);
CREATE INDEX IF NOT EXISTS idx_zodiac_compat_sign2 ON public.zodiac_compatibility(zodiac_sign_2_id);

-- =============================================
-- STEP 2: Triggers & Functions
-- =============================================

CREATE OR REPLACE FUNCTION update_zodiac_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_zodiac_signs_updated_at ON public.zodiac_signs;
CREATE TRIGGER update_zodiac_signs_updated_at
  BEFORE UPDATE ON public.zodiac_signs
  FOR EACH ROW EXECUTE FUNCTION update_zodiac_updated_at_column();

DROP TRIGGER IF EXISTS update_zodiac_daily_predictions_updated_at ON public.zodiac_daily_predictions;
CREATE TRIGGER update_zodiac_daily_predictions_updated_at
  BEFORE UPDATE ON public.zodiac_daily_predictions
  FOR EACH ROW EXECUTE FUNCTION update_zodiac_updated_at_column();

DROP TRIGGER IF EXISTS update_zodiac_compatibility_updated_at ON public.zodiac_compatibility;
CREATE TRIGGER update_zodiac_compatibility_updated_at
  BEFORE UPDATE ON public.zodiac_compatibility
  FOR EACH ROW EXECUTE FUNCTION update_zodiac_updated_at_column();

-- =============================================
-- STEP 3: RLS Policies
-- =============================================

ALTER TABLE public.zodiac_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zodiac_daily_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zodiac_compatibility ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read zodiac_signs" ON public.zodiac_signs;
CREATE POLICY "Public read zodiac_signs" ON public.zodiac_signs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read zodiac_daily_predictions" ON public.zodiac_daily_predictions;
CREATE POLICY "Public read zodiac_daily_predictions" ON public.zodiac_daily_predictions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read zodiac_compatibility" ON public.zodiac_compatibility;
CREATE POLICY "Public read zodiac_compatibility" ON public.zodiac_compatibility FOR SELECT USING (true);

-- =============================================
-- STEP 4: Helper Functions
-- =============================================

CREATE OR REPLACE FUNCTION get_zodiac_sign_by_date(birth_date DATE)
RETURNS TABLE(id UUID, name VARCHAR, symbol VARCHAR, element VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT zs.id, zs.name, zs.symbol, zs.element
  FROM public.zodiac_signs zs
  WHERE 
    (zs.start_month < zs.end_month AND
     ((EXTRACT(MONTH FROM birth_date) = zs.start_month AND EXTRACT(DAY FROM birth_date) >= zs.start_day) OR
      (EXTRACT(MONTH FROM birth_date) = zs.end_month AND EXTRACT(DAY FROM birth_date) <= zs.end_day) OR
      (EXTRACT(MONTH FROM birth_date) > zs.start_month AND EXTRACT(MONTH FROM birth_date) < zs.end_month)))
    OR
    (zs.start_month > zs.end_month AND
     ((EXTRACT(MONTH FROM birth_date) = zs.start_month AND EXTRACT(DAY FROM birth_date) >= zs.start_day) OR
      (EXTRACT(MONTH FROM birth_date) = zs.end_month AND EXTRACT(DAY FROM birth_date) <= zs.end_day) OR
      (EXTRACT(MONTH FROM birth_date) > zs.start_month OR EXTRACT(MONTH FROM birth_date) < zs.end_month)))
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_todays_prediction(zodiac_name VARCHAR)
RETURNS TABLE(general_fortune TEXT, love_fortune TEXT, career_fortune TEXT, health_fortune TEXT, lucky_number INT, lucky_color VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT zdp.general_fortune, zdp.love_fortune, zdp.career_fortune, zdp.health_fortune, zdp.lucky_number, zdp.lucky_color
  FROM public.zodiac_daily_predictions zdp
  JOIN public.zodiac_signs zs ON zdp.zodiac_sign_id = zs.id
  WHERE zs.name = zodiac_name AND zdp.prediction_date = CURRENT_DATE
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================
-- STEP 5: Insert Zodiac Data (12 Burç)
-- =============================================

INSERT INTO public.zodiac_signs (name, english_name, symbol, element, quality, date_range, start_day, start_month, end_day, end_month, traits_positive, traits_negative, keywords, ruling_planet, gemstone, lucky_numbers, lucky_colors, lucky_day, compatibility_high, compatibility_low, description) VALUES
('Koç', 'Aries', '♈', 'Ateş', 'Öncü', '21 Mart - 19 Nisan', 21, 3, 19, 4, ARRAY['Cesur', 'Enerjik', 'Girişken', 'Özgüvenli', 'Tutkulu', 'Bağımsız'], ARRAY['Aceleci', 'Sabırsız', 'Agresif', 'İnatçı', 'Dürtüsel'], ARRAY['Liderlik', 'Öncülük', 'Macera', 'Hız', 'Rekabet'], 'Mars', 'Elmas, Kırmızı Akik', ARRAY[1, 9, 10], ARRAY['Kırmızı', 'Turuncu', 'Beyaz'], 'Salı', ARRAY['Aslan', 'Yay', 'İkizler', 'Kova'], ARRAY['Yengeç', 'Terazi', 'Oğlak'], 'Lider ruhlu, cesur ve enerjik. Her zaman öncü olmak ister.'),
('Boğa', 'Taurus', '♉', 'Toprak', 'Sabit', '20 Nisan - 20 Mayıs', 20, 4, 20, 5, ARRAY['Güvenilir', 'Sadık', 'Pratik', 'Sabırlı', 'Kararlı', 'Sorumlu'], ARRAY['İnatçı', 'Maddiyatçı', 'Değişime Dirençli', 'Possesif'], ARRAY['İstikrar', 'Güvenlik', 'Konfor', 'Estetik', 'Doğa'], 'Venüs', 'Zümrüt, Safir', ARRAY[2, 6, 15], ARRAY['Yeşil', 'Pembe', 'Turkuaz'], 'Cuma', ARRAY['Başak', 'Oğlak', 'Yengeç', 'Balık'], ARRAY['Aslan', 'Kova', 'Akrep'], 'Güvenilir, sabırlı ve pratik. Güzelliğe ve konfora düşkün.'),
('İkizler', 'Gemini', '♊', 'Hava', 'Değişken', '21 Mayıs - 20 Haziran', 21, 5, 20, 6, ARRAY['Zeki', 'İletişim Yeteneği Güçlü', 'Uyumlu', 'Meraklı', 'Esprili', 'Sosyal'], ARRAY['Kararsız', 'Yüzeysel', 'Tutarsız', 'Gergin', 'Dağınık'], ARRAY['İletişim', 'Öğrenme', 'Çeşitlilik', 'Değişim', 'Hız'], 'Merkür', 'Akuamarin, Sitrin', ARRAY[3, 5, 23], ARRAY['Sarı', 'Turuncu', 'Açık Mavi'], 'Çarşamba', ARRAY['Terazi', 'Kova', 'Koç', 'Aslan'], ARRAY['Başak', 'Balık', 'Yay'], 'Zeki, konuşkan ve meraklı. İletişim yeteneği çok güçlü.'),
('Yengeç', 'Cancer', '♋', 'Su', 'Öncü', '21 Haziran - 22 Temmuz', 21, 6, 22, 7, ARRAY['Şefkatli', 'Koruyucu', 'Duygusal', 'Sadık', 'Empatik', 'Aile Odaklı'], ARRAY['Aşırı Hassas', 'Çabuk Kırılan', 'Geçmişe Takılı', 'Savunmacı', 'Karamsar'], ARRAY['Aile', 'Yuva', 'Duygular', 'Güvenlik', 'Geçmiş'], 'Ay', 'İnci, Ay Taşı', ARRAY[2, 7, 11], ARRAY['Beyaz', 'Gümüş', 'Açık Mavi'], 'Pazartesi', ARRAY['Akrep', 'Balık', 'Boğa', 'Başak'], ARRAY['Koç', 'Terazi', 'Oğlak'], 'Duygusal, koruyucu ve şefkatli. Aile ve yuva çok önemli.'),
('Aslan', 'Leo', '♌', 'Ateş', 'Sabit', '23 Temmuz - 22 Ağustos', 23, 7, 22, 8, ARRAY['Özgüvenli', 'Cömert', 'Karizmatik', 'Yaratıcı', 'Cesur', 'Sadık'], ARRAY['Kibirli', 'Egosu Yüksek', 'Dikkat Arayışı', 'İnatçı', 'Baskın'], ARRAY['Liderlik', 'Yaratıcılık', 'Drama', 'Parlaklık', 'Kraliyet'], 'Güneş', 'Yakut, Amber', ARRAY[1, 5, 19], ARRAY['Altın', 'Turuncu', 'Kırmızı'], 'Pazar', ARRAY['Koç', 'Yay', 'İkizler', 'Terazi'], ARRAY['Boğa', 'Akrep', 'Kova'], 'Karizmatik, cömert ve özgüvenli. Her zaman parlak olmak ister.'),
('Başak', 'Virgo', '♍', 'Toprak', 'Değişken', '23 Ağustos - 22 Eylül', 23, 8, 22, 9, ARRAY['Analitik', 'Detaycı', 'Pratik', 'Çalışkan', 'Mütevazı', 'Yardımsever'], ARRAY['Aşırı Eleştirel', 'Mükemmeliyetçi', 'Endişeli', 'Sıkı', 'Güvensiz'], ARRAY['Düzen', 'Analiz', 'Sağlık', 'Hizmet', 'Detay'], 'Merkür', 'Safir, Peridot', ARRAY[5, 14, 23], ARRAY['Yeşil', 'Kahverengi', 'Beyaz'], 'Çarşamba', ARRAY['Boğa', 'Oğlak', 'Yengeç', 'Akrep'], ARRAY['Yay', 'İkizler', 'Balık'], 'Analitik, detaycı ve pratik. Mükemmelliyetçi yapıya sahip.'),
('Terazi', 'Libra', '♎', 'Hava', 'Öncü', '23 Eylül - 22 Ekim', 23, 9, 22, 10, ARRAY['Diplomatik', 'Adil', 'Sosyal', 'Zarif', 'Romantik', 'Uyumlu'], ARRAY['Kararsız', 'Çatışmadan Kaçınan', 'Yüzeysel', 'Bağımlı', 'Kayıtsız'], ARRAY['Denge', 'Adalet', 'İlişkiler', 'Estetik', 'Uyum'], 'Venüs', 'Opal, Lapis Lazuli', ARRAY[6, 15, 24], ARRAY['Pembe', 'Açık Mavi', 'Yeşil'], 'Cuma', ARRAY['İkizler', 'Kova', 'Aslan', 'Yay'], ARRAY['Yengeç', 'Oğlak', 'Koç'], 'Dengeli, adil ve diplomatik. İlişkilere büyük önem verir.'),
('Akrep', 'Scorpio', '♏', 'Su', 'Sabit', '23 Ekim - 21 Kasım', 23, 10, 21, 11, ARRAY['Tutkulu', 'Kararlı', 'Sadık', 'Güçlü', 'Stratejik', 'Derin'], ARRAY['Kıskanç', 'Sahiplenici', 'Gizli', 'İntikamcı', 'Manipülatif'], ARRAY['Dönüşüm', 'Güç', 'Gizem', 'Tutku', 'Derinlik'], 'Plüton, Mars', 'Topaz, Akuamarin', ARRAY[8, 11, 18], ARRAY['Bordo', 'Siyah', 'Kırmızı'], 'Salı', ARRAY['Yengeç', 'Balık', 'Başak', 'Oğlak'], ARRAY['Aslan', 'Kova', 'Boğa'], 'Yoğun, tutkulu ve kararlı. Derin duygusal bir yapıya sahip.'),
('Yay', 'Sagittarius', '♐', 'Ateş', 'Değişken', '22 Kasım - 21 Aralık', 22, 11, 21, 12, ARRAY['İyimser', 'Özgür', 'Maceraperest', 'Dürüst', 'Felsefi', 'Entelektüel'], ARRAY['Sorumsuz', 'Taktik', 'Düşüncesiz', 'Sabırsız', 'Aşırı Dürüst'], ARRAY['Özgürlük', 'Macera', 'Felsefe', 'Seyahat', 'Öğrenme'], 'Jüpiter', 'Turkuaz, Ametist', ARRAY[3, 12, 21], ARRAY['Mor', 'Mavi', 'Kırmızı'], 'Perşembe', ARRAY['Koç', 'Aslan', 'Terazi', 'Kova'], ARRAY['Başak', 'Balık', 'İkizler'], 'İyimser, özgür ve maceraperest. Öğrenmeye ve keşfetmeye aç.'),
('Oğlak', 'Capricorn', '♑', 'Toprak', 'Öncü', '22 Aralık - 19 Ocak', 22, 12, 19, 1, ARRAY['Disiplinli', 'Sorumlu', 'Çalışkan', 'Hırslı', 'Sabırlı', 'Pratik'], ARRAY['Katı', 'Kötümser', 'İnatçı', 'Soğuk', 'Baskıcı'], ARRAY['Başarı', 'Sorumluluk', 'Disiplin', 'Otorite', 'Zaman'], 'Satürn', 'Granat, Oniks', ARRAY[4, 8, 13], ARRAY['Siyah', 'Gri', 'Kahverengi'], 'Cumartesi', ARRAY['Boğa', 'Başak', 'Akrep', 'Balık'], ARRAY['Koç', 'Terazi', 'Yengeç'], 'Disiplinli, sorumlu ve hırslı. Başarıya odaklı bir yapıya sahip.'),
('Kova', 'Aquarius', '♒', 'Hava', 'Sabit', '20 Ocak - 18 Şubat', 20, 1, 18, 2, ARRAY['Özgün', 'İnsancıl', 'Bağımsız', 'Entelektüel', 'Yaratıcı', 'Vizyoner'], ARRAY['Duygusuz', 'İnatçı', 'Uzak', 'Öngörülemez', 'İsyankâr'], ARRAY['Özgürlük', 'İnovasyon', 'İnsanlık', 'Teknoloji', 'Gelecek'], 'Uranüs, Satürn', 'Ametist, Akuamarin', ARRAY[4, 7, 22], ARRAY['Turkuaz', 'Gümüş', 'Mor'], 'Cumartesi', ARRAY['İkizler', 'Terazi', 'Koç', 'Yay'], ARRAY['Boğa', 'Aslan', 'Akrep'], 'Özgün, bağımsız ve vizyoner. İnsanlığa hizmet etmek ister.'),
('Balık', 'Pisces', '♓', 'Su', 'Değişken', '19 Şubat - 20 Mart', 19, 2, 20, 3, ARRAY['Empatik', 'Şefkatli', 'Sanatçı', 'Sezgisel', 'Duygusal', 'Hayalperest'], ARRAY['Aşırı Hassas', 'Kaçışçı', 'Kararsız', 'Kurban', 'Melankolik'], ARRAY['Hayal', 'Mistisizm', 'Sanat', 'Şefkat', 'Sezgi'], 'Neptün, Jüpiter', 'Akuamarin, Ametist', ARRAY[3, 7, 12], ARRAY['Deniz Yeşili', 'Mor', 'Gümüş'], 'Perşembe', ARRAY['Yengeç', 'Akrep', 'Boğa', 'Oğlak'], ARRAY['İkizler', 'Yay', 'Başak'], 'Empatik, şefkatli ve sanatçı ruhlu. Derin bir hayal dünyası var.')
ON CONFLICT (name) DO NOTHING;

-- Verify
SELECT COUNT(*) as total_zodiac_signs FROM public.zodiac_signs;

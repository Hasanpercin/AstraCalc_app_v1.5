-- Seed Data: Zodiac Signs (12 Burç)
-- Description: Türkçe burç verileri
-- Created: 2025-09-30

-- =============================================
-- Insert 12 Zodiac Signs
-- =============================================

INSERT INTO public.zodiac_signs (
  name, english_name, symbol, element, quality, 
  date_range, start_day, start_month, end_day, end_month,
  traits_positive, traits_negative, keywords,
  ruling_planet, gemstone, lucky_numbers, lucky_colors, lucky_day,
  compatibility_high, compatibility_low,
  description
) VALUES

-- 1. Koç (Aries) ♈
(
  'Koç', 'Aries', '♈', 'Ateş', 'Öncü',
  '21 Mart - 19 Nisan', 21, 3, 19, 4,
  ARRAY['Cesur', 'Enerjik', 'Girişken', 'Özgüvenli', 'Tutkulu', 'Bağımsız'],
  ARRAY['Aceleci', 'Sabırsız', 'Agresif', 'İnatçı', 'Dürtüsel'],
  ARRAY['Liderlik', 'Öncülük', 'Macera', 'Hız', 'Rekabet'],
  'Mars', 'Elmas, Kırmızı Akik', ARRAY[1, 9, 10], ARRAY['Kırmızı', 'Turuncu', 'Beyaz'], 'Salı',
  ARRAY['Aslan', 'Yay', 'İkizler', 'Kova'],
  ARRAY['Yengeç', 'Terazi', 'Oğlak'],
  'Lider ruhlu, cesur ve enerjik. Her zaman öncü olmak ister.'
),

-- 2. Boğa (Taurus) ♉
(
  'Boğa', 'Taurus', '♉', 'Toprak', 'Sabit',
  '20 Nisan - 20 Mayıs', 20, 4, 20, 5,
  ARRAY['Güvenilir', 'Sadık', 'Pratik', 'Sabırlı', 'Kararlı', 'Sorumlu'],
  ARRAY['İnatçı', 'Maddiyatçı', 'Değişime Dirençli', 'Possesif'],
  ARRAY['İstikrar', 'Güvenlik', 'Konfor', 'Estetik', 'Doğa'],
  'Venüs', 'Zümrüt, Safir', ARRAY[2, 6, 15], ARRAY['Yeşil', 'Pembe', 'Turkuaz'], 'Cuma',
  ARRAY['Başak', 'Oğlak', 'Yengeç', 'Balık'],
  ARRAY['Aslan', 'Kova', 'Akrep'],
  'Güvenilir, sabırlı ve pratik. Güzelliğe ve konfora düşkün.'
),

-- 3. İkizler (Gemini) ♊
(
  'İkizler', 'Gemini', '♊', 'Hava', 'Değişken',
  '21 Mayıs - 20 Haziran', 21, 5, 20, 6,
  ARRAY['Zeki', 'İletişim Yeteneği Güçlü', 'Uyumlu', 'Meraklı', 'Esprili', 'Sosyal'],
  ARRAY['Kararsız', 'Yüzeysel', 'Tutarsız', 'Gergin', 'Dağınık'],
  ARRAY['İletişim', 'Öğrenme', 'Çeşitlilik', 'Değişim', 'Hız'],
  'Merkür', 'Akuamarin, Sitrin', ARRAY[3, 5, 23], ARRAY['Sarı', 'Turuncu', 'Açık Mavi'], 'Çarşamba',
  ARRAY['Terazi', 'Kova', 'Koç', 'Aslan'],
  ARRAY['Başak', 'Balık', 'Yay'],
  'Zeki, konuşkan ve meraklı. İletişim yeteneği çok güçlü.'
),

-- 4. Yengeç (Cancer) ♋
(
  'Yengeç', 'Cancer', '♋', 'Su', 'Öncü',
  '21 Haziran - 22 Temmuz', 21, 6, 22, 7,
  ARRAY['Şefkatli', 'Koruyucu', 'Duygusal', 'Sadık', 'Empatik', 'Aile Odaklı'],
  ARRAY['Aşırı Hassas', 'Çabuk Kırılan', 'Geçmişe Takılı', 'Savunmacı', 'Karamsar'],
  ARRAY['Aile', 'Yuva', 'Duygular', 'Güvenlik', 'Geçmiş'],
  'Ay', 'İnci, Ay Taşı', ARRAY[2, 7, 11], ARRAY['Beyaz', 'Gümüş', 'Açık Mavi'], 'Pazartesi',
  ARRAY['Akrep', 'Balık', 'Boğa', 'Başak'],
  ARRAY['Koç', 'Terazi', 'Oğlak'],
  'Duygusal, koruyucu ve şefkatli. Aile ve yuva çok önemli.'
),

-- 5. Aslan (Leo) ♌
(
  'Aslan', 'Leo', '♌', 'Ateş', 'Sabit',
  '23 Temmuz - 22 Ağustos', 23, 7, 22, 8,
  ARRAY['Özgüvenli', 'Cömert', 'Karizmatik', 'Yaratıcı', 'Cesur', 'Sadık'],
  ARRAY['Kibirli', 'Egosu Yüksek', 'Dikkat Arayışı', 'İnatçı', 'Baskın'],
  ARRAY['Liderlik', 'Yaratıcılık', 'Drama', 'Parlaklık', 'Kraliyet'],
  'Güneş', 'Yakut, Amber', ARRAY[1, 5, 19], ARRAY['Altın', 'Turuncu', 'Kırmızı'], 'Pazar',
  ARRAY['Koç', 'Yay', 'İkizler', 'Terazi'],
  ARRAY['Boğa', 'Akrep', 'Kova'],
  'Karizmatik, cömert ve özgüvenli. Her zaman parlak olmak ister.'
),

-- 6. Başak (Virgo) ♍
(
  'Başak', 'Virgo', '♍', 'Toprak', 'Değişken',
  '23 Ağustos - 22 Eylül', 23, 8, 22, 9,
  ARRAY['Analitik', 'Detaycı', 'Pratik', 'Çalışkan', 'Mütevazı', 'Yardımsever'],
  ARRAY['Aşırı Eleştirel', 'Mükemmeliyetçi', 'Endişeli', 'Sıkı', 'Güvensiz'],
  ARRAY['Düzen', 'Analiz', 'Sağlık', 'Hizmet', 'Detay'],
  'Merkür', 'Safir, Peridot', ARRAY[5, 14, 23], ARRAY['Yeşil', 'Kahverengi', 'Beyaz'], 'Çarşamba',
  ARRAY['Boğa', 'Oğlak', 'Yengeç', 'Akrep'],
  ARRAY['Yay', 'İkizler', 'Balık'],
  'Analitik, detaycı ve pratik. Mükemmelliyetçi yapıya sahip.'
),

-- 7. Terazi (Libra) ♎
(
  'Terazi', 'Libra', '♎', 'Hava', 'Öncü',
  '23 Eylül - 22 Ekim', 23, 9, 22, 10,
  ARRAY['Diplomatik', 'Adil', 'Sosyal', 'Zarif', 'Romantik', 'Uyumlu'],
  ARRAY['Kararsız', 'Çatışmadan Kaçınan', 'Yüzeysel', 'Bağımlı', 'Kayıtsız'],
  ARRAY['Denge', 'Adalet', 'İlişkiler', 'Estetik', 'Uyum'],
  'Venüs', 'Opal, Lapis Lazuli', ARRAY[6, 15, 24], ARRAY['Pembe', 'Açık Mavi', 'Yeşil'], 'Cuma',
  ARRAY['İkizler', 'Kova', 'Aslan', 'Yay'],
  ARRAY['Yengeç', 'Oğlak', 'Koç'],
  'Dengeli, adil ve diplomatik. İlişkilere büyük önem verir.'
),

-- 8. Akrep (Scorpio) ♏
(
  'Akrep', 'Scorpio', '♏', 'Su', 'Sabit',
  '23 Ekim - 21 Kasım', 23, 10, 21, 11,
  ARRAY['Tutkulu', 'Kararlı', 'Sadık', 'Güçlü', 'Stratejik', 'Derin'],
  ARRAY['Kıskanç', 'Sahiplenici', 'Gizli', 'İntikamcı', 'Manipülatif'],
  ARRAY['Dönüşüm', 'Güç', 'Gizem', 'Tutku', 'Derinlik'],
  'Plüton, Mars', 'Topaz, Akuamarin', ARRAY[8, 11, 18], ARRAY['Bordo', 'Siyah', 'Kırmızı'], 'Salı',
  ARRAY['Yengeç', 'Balık', 'Başak', 'Oğlak'],
  ARRAY['Aslan', 'Kova', 'Boğa'],
  'Yoğun, tutkulu ve kararlı. Derin duygusal bir yapıya sahip.'
),

-- 9. Yay (Sagittarius) ♐
(
  'Yay', 'Sagittarius', '♐', 'Ateş', 'Değişken',
  '22 Kasım - 21 Aralık', 22, 11, 21, 12,
  ARRAY['İyimser', 'Özgür', 'Maceraperest', 'Dürüst', 'Felsefi', 'Entelektüel'],
  ARRAY['Sorumsuz', 'Taktik', 'Düşüncesiz', 'Sabırsız', 'Aşırı Dürüst'],
  ARRAY['Özgürlük', 'Macera', 'Felsefe', 'Seyahat', 'Öğrenme'],
  'Jüpiter', 'Turkuaz, Ametist', ARRAY[3, 12, 21], ARRAY['Mor', 'Mavi', 'Kırmızı'], 'Perşembe',
  ARRAY['Koç', 'Aslan', 'Terazi', 'Kova'],
  ARRAY['Başak', 'Balık', 'İkizler'],
  'İyimser, özgür ve maceraperest. Öğrenmeye ve keşfetmeye aç.'
),

-- 10. Oğlak (Capricorn) ♑
(
  'Oğlak', 'Capricorn', '♑', 'Toprak', 'Öncü',
  '22 Aralık - 19 Ocak', 22, 12, 19, 1,
  ARRAY['Disiplinli', 'Sorumlu', 'Çalışkan', 'Hırslı', 'Sabırlı', 'Pratik'],
  ARRAY['Katı', 'Kötümser', 'İnatçı', 'Soğuk', 'Baskıcı'],
  ARRAY['Başarı', 'Sorumluluk', 'Disiplin', 'Otorite', 'Zaman'],
  'Satürn', 'Granat, Oniks', ARRAY[4, 8, 13], ARRAY['Siyah', 'Gri', 'Kahverengi'], 'Cumartesi',
  ARRAY['Boğa', 'Başak', 'Akrep', 'Balık'],
  ARRAY['Koç', 'Terazi', 'Yengeç'],
  'Disiplinli, sorumlu ve hırslı. Başarıya odaklı bir yapıya sahip.'
),

-- 11. Kova (Aquarius) ♒
(
  'Kova', 'Aquarius', '♒', 'Hava', 'Sabit',
  '20 Ocak - 18 Şubat', 20, 1, 18, 2,
  ARRAY['Özgün', 'İnsancıl', 'Bağımsız', 'Entelektüel', 'Yaratıcı', 'Vizyoner'],
  ARRAY['Duygusuz', 'İnatçı', 'Uzak', 'Öngörülemez', 'İsyankâr'],
  ARRAY['Özgürlük', 'İnovasyon', 'İnsanlık', 'Teknoloji', 'Gelecek'],
  'Uranüs, Satürn', 'Ametist, Akuamarin', ARRAY[4, 7, 22], ARRAY['Turkuaz', 'Gümüş', 'Mor'], 'Cumartesi',
  ARRAY['İkizler', 'Terazi', 'Koç', 'Yay'],
  ARRAY['Boğa', 'Aslan', 'Akrep'],
  'Özgün, bağımsız ve vizyoner. İnsanlığa hizmet etmek ister.'
),

-- 12. Balık (Pisces) ♓
(
  'Balık', 'Pisces', '♓', 'Su', 'Değişken',
  '19 Şubat - 20 Mart', 19, 2, 20, 3,
  ARRAY['Empatik', 'Şefkatli', 'Sanatçı', 'Sezgisel', 'Duygusal', 'Hayalperest'],
  ARRAY['Aşırı Hassas', 'Kaçışçı', 'Kararsız', 'Kurban', 'Melankolik'],
  ARRAY['Hayal', 'Mistisizm', 'Sanat', 'Şefkat', 'Sezgi'],
  'Neptün, Jüpiter', 'Akuamarin, Ametist', ARRAY[3, 7, 12], ARRAY['Deniz Yeşili', 'Mor', 'Gümüş'], 'Perşembe',
  ARRAY['Yengeç', 'Akrep', 'Boğa', 'Oğlak'],
  ARRAY['İkizler', 'Yay', 'Başak'],
  'Empatik, şefkatli ve sanatçı ruhlu. Derin bir hayal dünyası var.'
);

-- Verify the insert
SELECT name, symbol, date_range, start_month, end_month FROM public.zodiac_signs ORDER BY start_month, start_day;

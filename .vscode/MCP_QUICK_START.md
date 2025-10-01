# 🚀 MCP Quick Start Guide

## ✅ Kurulu MCP'ler

### Yüksek Öncelikli (Aktif)
- ✅ **Filesystem MCP** - Dosya operasyonları
- ✅ **GitHub MCP** - Repository işlemleri (Token: `ghp_rUyD...qEI20UQwqw` ✓)
- ✅ **PostgreSQL MCP** - Supabase veritabanı (Password: `-Supa3535-` ✓)

### Orta Öncelikli (Yeni Eklendi)
- ✅ **Time MCP** - Zaman dilimi ve tarih hesaplamaları
- ✅ **Fetch MCP** - Web içerik çekme ve API testleri
- ✅ **Memory MCP** - Knowledge Graph (proje context)
- ⏳ **Brave Search MCP** - Web araması (API key gerekli, opsiyonel)

### Düşük Öncelikli (Yeni Eklendi)
- ✅ **Git MCP** - Git operations (commit, log, diff, branch)
- ✅ **Puppeteer MCP** - Browser automation ve screenshots 🎭
- ⏳ **Slack MCP** - Team collaboration (Bot token gerekli, opsiyonel)
- ⏳ **Google Drive MCP** - File management (OAuth2 gerekli, opsiyonel)

### Ekstra Araçlar (YENİ EKLENEN)
- ✅ **Sentry MCP** - Error monitoring ve crash reports
- ✅ **SQLite MCP** - Local caching ve offline data
- ✅ **Everything MCP** - System-wide search
- 📧 **Email (n8n)** - n8n webhook ile email gönderimi

## 🎯 Aktivasyon Adımları

### 1. VS Code'u Yeniden Başlat
```bash
# Terminalde çalıştır:
killall "Visual Studio Code" && code /Users/gozdesenturk/Desktop/VS\ Code\ projeler/Bolt_App_AstroCalc/AstroCalc_v1.5_yeni
```

VEYA Manuel:
1. **CMD + Q** → VS Code'u tamamen kapat
2. VS Code'u yeniden aç
3. Bu workspace'i aç

### 2. MCP'leri Test Et

GitHub Copilot Chat'i aç (**CMD + Shift + I**) ve dene:

#### Test 1: Filesystem
```
@workspace list all .tsx files in app folder
```

#### Test 2: GitHub
```
@workspace show last 5 commits
```

#### Test 3: PostgreSQL
```
@workspace describe user_profiles table structure
```

#### Test 4: Time (Astroloji için kritik!)
```
@workspace convert 15 March 1990 14:30 Istanbul time to UTC
```

#### Test 5: Fetch
```
@workspace test n8n webhook connection
```

#### Test 6: Memory
```
@workspace remember that lucide-react-native has limited icons, we use emoji fallbacks
```

#### Test 7: Git
```
@workspace show git log for the last 10 commits
```

#### Test 8: Puppeteer (Browser)
```
@workspace capture a screenshot of localhost:8081
```

#### Test 9: Sentry
```
@workspace check Sentry for recent errors
```

#### Test 10: SQLite
```
@workspace create a cache table for birth charts
```

#### Test 11: Email (n8n)
```
@workspace send a test email via n8n webhook
```

## 🔍 Brave Search Ekleme (Opsiyonel)

Eğer web araması yapmak istersen:

1. https://brave.com/search/api/ adresine git
2. Ücretsiz API key al (2000 sorgu/ay)
3. `.env.local` dosyasına ekle:
   ```bash
   BRAVE_API_KEY=BSA_your_key_here
   ```
4. VS Code'u yeniden başlat

## 💬 Slack Entegrasyonu (Opsiyonel)

Team collaboration için:

1. https://api.slack.com/apps adresine git
2. Yeni bir Slack app oluştur
3. Bot Token Scopes ekle: `chat:write`, `channels:read`, `users:read`
4. Workspace'e yükle ve token'ı kopyala
5. `.env.local` dosyasına ekle:
   ```bash
   SLACK_BOT_TOKEN=xoxb-your-token-here
   SLACK_TEAM_ID=T01234567
   ```
6. VS Code'u yeniden başlat

## 💡 Kullanım Örnekleri

### Astroloji Hesaplamaları
```
@workspace Calculate timezone offset for Istanbul on 1985-06-15
@workspace What was the UTC time for 20:00 Istanbul time on 1990-03-15?
```

### Veritabanı Sorgular
```
@workspace Show me all natal chart records for user hasanpercin35@gmail.com
@workspace Write a query to get birth chart data with user profiles
```

### Kod İyileştirme
```
@workspace Refactor profile-info.tsx to use TypeScript strict mode
@workspace Find all places where we use lucide icons and suggest emoji alternatives
```

### Git İşlemleri
```
@workspace Show me the diff of the last commit
@workspace Create a feature branch for forgot-password
@workspace Show me who changed profile.tsx
```

### Browser Testing
```
@workspace Take a screenshot of the login screen
@workspace Test the birth chart form with automation
@workspace Capture the zodiac detail page
```

### Error Monitoring
```
@workspace Show me Sentry errors from the last 24 hours
@workspace Analyze the most frequent crashes
@workspace Create a Sentry issue for this bug
```

### Local Caching
```
@workspace Create a SQLite cache for birth chart data
@workspace Query cached astrology interpretations
@workspace Backup the local cache database
```

### Email Gönderimi (n8n)
```
@workspace Send a password reset email to user@example.com
@workspace Send weekly astrology reports to all active users
@workspace Test email template with sample data
```

### API Test
```
@workspace Test the n8n birth chart webhook with sample data
@workspace Validate Supabase authentication flow
```

## 🐛 Sorun Giderme

### MCP'ler görünmüyor?
1. ✅ `.vscode/settings.json` dosyası var mı?
2. ✅ `.env.local` dosyasında token'lar doğru mu?
3. ✅ VS Code tamamen yeniden başlatıldı mı?
4. 📋 **Output → GitHub Copilot** loglarına bak

### GitHub MCP çalışmıyor?
1. Token scope'ları kontrol et: `repo`, `read:org`, `read:user`
2. Token expired olmamış mı?
3. GitHub'a erişim var mı?

### PostgreSQL MCP çalışmıyor?
1. Supabase password doğru mu?
2. Supabase projesi aktif mi?
3. Internet bağlantısı var mı?

## 📊 MCP Durumu

| MCP | Durum | Auth | Kullanım |
|-----|-------|------|----------|
| Filesystem | ✅ Aktif | - | Her zaman |
| GitHub | ✅ Aktif | Token ✓ | Repository işlemleri |
| PostgreSQL | ✅ Aktif | Password ✓ | DB sorgular |
| Time | ✅ Aktif | - | Tarih hesaplamaları |
| Fetch | ✅ Aktif | - | API testleri |
| Memory | ✅ Aktif | - | Context hafızası |
| Git | ✅ Aktif | - | Git operations |
| Puppeteer | ✅ Aktif | - | Browser automation 🎭 |
| Sentry | ✅ Aktif | DSN ✓ | Error monitoring |
| SQLite | ✅ Aktif | - | Local caching |
| Everything | ✅ Aktif | - | System search |
| Brave Search | ⏳ Beklemede | API Key gerekli | Web araması (opsiyonel) |
| Slack | ⏳ Beklemede | Bot Token gerekli | Team collaboration (opsiyonel) |
| Google Drive | ⏳ Beklemede | OAuth2 gerekli | File management (opsiyonel) |

**⭐ Özel:** Email gönderimi için n8n webhook kullanılıyor (Fetch MCP ile)

## 🎉 Başarılı Kurulum

Tüm testler başarılı olduğunda:
- ✅ 14 MCP server yapılandırıldı
- ✅ 11 MCP aktif (auth gerektirmeyen + auth var)
- ✅ 3 MCP opsiyonel (Brave, Slack, GDrive - auth gerekli)
- ✅ GitHub token çalışıyor
- ✅ Supabase bağlantısı var
- ✅ Astroloji hesaplamaları hazır
- ✅ Git operations hazır
- ✅ Browser automation hazır (🎭 Screenshots, E2E testing)
- ✅ Error monitoring hazır (Sentry)
- ✅ Local caching hazır (SQLite)
- 📧 Email gönderimi hazır (n8n webhook)
- 🚀 **Geliştirmeye tamamen hazırsın!**

---

📝 **Son Güncelleme:** 30 Eylül 2025  
🔐 **Güvenlik:** Token'lar `.env.local` dosyasında (git'e commitlenmez)

# 🌟 MCP Server Genel Bakış - AstroCalc Projesi

## 📋 Kurulu MCP'ler (11 Adet)

### ⭐ Yüksek Öncelikli (High Priority) - 3 MCP

| # | MCP | Auth | Status | Kullanım Alanı |
|---|-----|------|--------|----------------|
| 1 | **Filesystem** | -| Kategori | Toplam | Aktif (Auth Yok) | Aktif (Auth Var) | Opsiyonel |
|----------|--------|------------------|------------------|-----------||
| Yüksek Öncelikli | 3 | 1 | 2 | 0 |
| Orta Öncelikli | 4 | 3 | 0 | 1 |
| Düşük Öncelikli | 4 | 2 | 0 | 2 |
| Ekstra Araçlar | 3 | 2 | 1 | 0 |
| **TOPLAM** | **14** | **8** | **3** | **3** |

**Not:** Email için n8n webhook kullanılıyor (Fetch MCP ile entegre)ktif | Workspace dosya operasyonları |
| 2 | **GitHub** | Token ✓ | ✅ Aktif | Repository işlemleri, commits, PRs |
| 3 | **PostgreSQL** | Password ✓ | ✅ Aktif | Supabase veritabanı sorguları |

### 🔶 Orta Öncelikli (Medium Priority) - 4 MCP

| # | MCP | Auth | Status | Kullanım Alanı |
|---|-----|------|--------|----------------|
| 4 | **Time** | - | ✅ Aktif | Zaman dilimi dönüşümleri (Astroloji!) |
| 5 | **Fetch** | - | ✅ Aktif | API testleri, web içerik çekme |
| 6 | **Memory** | - | ✅ Aktif | Knowledge graph, context learning |
| 7 | **Brave Search** | API Key | ⏳ Opsiyonel | Web araması (2000 sorgu/ay ücretsiz) |

### 🔵 Düşük Öncelikli (Low Priority) - 4 MCP

| # | MCP | Auth | Status | Kullanım Alanı |
|---|-----|------|--------|----------------|
| 8 | **Git** | - | ✅ Aktif | Git operations (log, diff, branch) |
| 9 | **Puppeteer** | - | ✅ Aktif | Browser automation, screenshots |
| 10 | **Slack** | Bot Token | ⏳ Opsiyonel | Team collaboration, notifications |
| 11 | **Google Drive** | OAuth2 | ⏳ Opsiyonel | File management, backups |
| 12 | **Sentry** | DSN | ✅ Aktif | Error monitoring, crash reports |
| 13 | **SQLite** | - | ✅ Aktif | Local caching, offline data |
| 14 | **Everything** | - | ✅ Aktif | System-wide search |

---

## 🎯 MCP Kullanım Örnekleri

### 1️⃣ Filesystem MCP
**Ne işe yarar:** Workspace içindeki dosyaları okuma, yazma, arama

```
@workspace list all .tsx files in app folder
@workspace find all files using lucide-react-native
@workspace create a new component file in app/components
@workspace read the contents of lib/supabase.ts
```

**Kullanım Senaryoları:**
- Dosya yapısını analiz etme
- Toplu dosya işlemleri
- Code pattern arama
- Refactoring

---

### 2️⃣ GitHub MCP
**Ne işe yarar:** GitHub repository operations

```
@workspace show last 10 commits
@workspace create an issue for the login bug
@workspace list open pull requests
@workspace show the diff of the last commit
@workspace who committed to profile.tsx last?
```

**Kullanım Senaryoları:**
- Commit history analizi
- Issue tracking
- PR review
- Contributor analizi

---

### 3️⃣ PostgreSQL MCP
**Ne işe yarar:** Supabase veritabanı sorguları

```
@workspace describe user_profiles table structure
@workspace show me all birth chart records
@workspace write a query to get natal charts with user data
@workspace optimize the database query in this file
@workspace check if there are any duplicate user emails
```

**Kullanım Senaryoları:**
- Schema analizi
- Query optimization
- Data validation
- Migration planning

---

### 4️⃣ Time MCP ⭐ (Astroloji için kritik!)
**Ne işe yarar:** Zaman dilimi dönüşümleri ve tarih hesaplamaları

```
@workspace convert 15 March 1990 14:30 Istanbul time to UTC
@workspace what timezone was Istanbul using in 1985?
@workspace calculate the time difference between Istanbul and New York
@workspace what was the UTC offset for Turkey on 1990-03-15?
```

**Kullanım Senaryoları:**
- Birth chart zaman dönüşümleri
- Tarih validasyonu
- Timezone hesaplamaları
- Historical timezone data

---

### 5️⃣ Fetch MCP
**Ne işe yarar:** Web içerik çekme ve API testleri

```
@workspace test the n8n webhook at https://n8n.hasanpercin.xyz/webhook/...
@workspace fetch the Supabase API health status
@workspace validate the astrology API response format
@workspace check if the webhook is responding
```

**Kullanım Senaryoları:**
- API endpoint testleri
- Webhook validation
- External service monitoring
- Documentation fetching

---

### 6️⃣ Memory MCP
**Ne işe yarar:** Proje context öğrenme ve hatırlama

```
@workspace remember that lucide-react-native has limited icons
@workspace what icon strategy do we use in this project?
@workspace remember that Supabase URL is https://zeabnuknlnaranrpmyne.supabase.co
@workspace what authentication pattern do we follow?
```

**Kullanım Senaryoları:**
- Project patterns öğrenme
- Best practices kaydetme
- Decision history
- Context persistence

---

### 7️⃣ Brave Search MCP (Opsiyonel)
**Ne işe yarar:** Web araması (güncel bilgi, dokumentasyon)

```
@workspace search for React Native best practices for forms
@workspace find Expo Router 6.0 documentation
@workspace look up Supabase RLS policy examples
@workspace search for lucide-react-native available icons
```

**Kullanım Senaryoları:**
- Güncel dokumentasyon bulma
- Best practices araştırma
- Library comparison
- Error message araştırma

**Setup:** https://brave.com/search/api/ → API key al (2000 sorgu/ay ücretsiz)

---

### 8️⃣ Git MCP
**Ne işe yarar:** Git operations (commit, branch, log, diff)

```
@workspace show git log for profile.tsx
@workspace create a new branch called feature/login-redesign
@workspace show uncommitted changes
@workspace who changed this file last?
@workspace show the diff between main and current branch
```

**Kullanım Senaryoları:**
- File history tracking
- Branch management
- Blame analysis
- Change review

---

### 9️⃣ Puppeteer MCP
**Ne işe yarar:** Browser automation ve screenshot capture

```
@workspace take a screenshot of localhost:8081
@workspace capture the login page
@workspace test the registration form with automation
@workspace take a screenshot of the birth chart screen
```

**Kullanım Senaryoları:**
- UI testing
- Visual regression testing
- Screenshot documentation
- Form automation testing

---

### 🔟 Slack MCP (Opsiyonel)
**Ne işe yarar:** Team collaboration ve notifications

```
@workspace send a message to #dev-team about deployment
@workspace post the test results to Slack
@workspace create a Slack channel for this feature
@workspace notify the team about the bug fix
```

**Kullanım Senaryoları:**
- Deployment notifications
- Test result sharing
- Team updates
- Alert routing

**Setup:** https://api.slack.com/apps → Bot token oluştur

---

### 1️⃣1️⃣ Google Drive MCP (Opsiyonel)
**Ne işe yarar:** File management ve backup

```
@workspace upload this export to Google Drive
@workspace list all documentation files in Drive
@workspace share the API documentation with the team
@workspace backup the database schema to Drive
```

**Kullanım Senaryoları:**
- Documentation backup
- Export sharing
- Collaborative editing
- File versioning

**Setup:** https://console.cloud.google.com/ → OAuth2 credentials

---

### 1️⃣2️⃣ Sentry MCP
**Ne işe yarar:** Error monitoring ve crash reporting

```
@workspace check Sentry errors for the last 24 hours
@workspace analyze crash reports
@workspace show most frequent errors
@workspace create a Sentry issue for this exception
```

**Kullanım Senaryoları:**
- Production error tracking
- Crash analysis
- Performance monitoring
- User feedback integration

**Setup:** Zaten yapılandırılmış! `.env` dosyasında `EXPO_PUBLIC_SENTRY_DSN` var.

---

### 1️⃣3️⃣ SQLite MCP
**Ne işe yarar:** Local database for caching and offline data

```
@workspace create a cache table for birth charts
@workspace query cached astrology data
@workspace optimize SQLite indexes
@workspace backup local database
```

**Kullanım Senaryoları:**
- Offline data caching
- Fast local queries
- Development testing
- Data export/import

---

### 1️⃣4️⃣ Everything MCP
**Ne işe yarar:** System-wide file and content search

```
@workspace find all files containing 'birth chart'
@workspace search for TODO comments across all projects
@workspace locate configuration files
```

**Kullanım Senaryoları:**
- Quick file location
- Cross-project search
- Documentation finding
- Code archaeology

---

## 📧 Email Çözümü (n8n Webhook)

**MCP yok ama alternatif var!** Email göndermek için mevcut **n8n webhook'unuzu** kullanabilirsiniz:

### n8n Email Workflow Oluşturma

1. **n8n'de yeni workflow oluştur:**
   ```
   Webhook → Email (SMTP) → Response
   ```

2. **Webhook trigger:**
   - URL: `https://n8n.hasanpercin.xyz/webhook/send-email`
   - Method: POST
   - Body:
     ```json
     {
       "to": "user@example.com",
       "subject": "Weekly Astrology Report",
       "body": "Your horoscope...",
       "template": "weekly-report"
     }
     ```

3. **SMTP Node yapılandırması:**
   - Gmail, SendGrid, Mailgun, vs.
   - Template support ekle

4. **Copilot ile kullanım:**
   ```
   @workspace send a password reset email to user@example.com
   @workspace send weekly astrology report to all users
   @workspace test email sending with sample data
   ```

### Email Template Örnekleri

**Şifre Sıfırlama:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Şifre Sıfırlama - AstroCalc</title>
</head>
<body>
  <h1>Şifrenizi Sıfırlayın</h1>
  <p>Merhaba {{firstName}},</p>
  <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
  <a href="{{resetLink}}">Şifreyi Sıfırla</a>
  <p>Bu link 1 saat geçerlidir.</p>
</body>
</html>
```

**Haftalık Astroloji Raporu:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Haftalık Burç Yorumunuz - AstroCalc</title>
</head>
<body>
  <h1>🌟 Bu Haftanın Burç Yorumu</h1>
  <p>Merhaba {{firstName}},</p>
  <h2>{{zodiacSign}} Burcu</h2>
  <p>{{weeklyForecast}}</p>
  <a href="{{appLink}}">Daha Fazlası İçin Uygulamayı Aç</a>
</body>
</html>
```

**Fetch MCP ile Email Gönderme:**
```
@workspace send POST request to n8n email webhook with password reset data
@workspace test weekly report email with sample user data
```

---

## 📊 MCP Durum Tablosu

| Kategori | Toplam | Aktif (Auth Yok) | Aktif (Auth Var) | Opsiyonel |
|----------|--------|------------------|------------------|-----------|
| Yüksek Öncelikli | 3 | 1 | 2 | 0 |
| Orta Öncelikli | 4 | 3 | 0 | 1 |
| Düşük Öncelikli | 4 | 2 | 0 | 2 |
| **TOPLAM** | **11** | **6** | **2** | **3** |

---

## 🔐 Güvenlik ve Kimlik Doğrulama

### Aktif Credentials (.env.local)
```bash
# Yüksek Öncelikli
GITHUB_TOKEN=ghp_rUyD...qEI20UQwqw ✓
SUPABASE_DB_PASSWORD=-Supa3535- ✓

# Orta Öncelikli
# BRAVE_API_KEY=BSAigl... (Comment'te hazır)

# Düşük Öncelikli
# SLACK_BOT_TOKEN=xoxb-... (Placeholder)
# SLACK_TEAM_ID=T01234567 (Placeholder)
# Google Drive OAuth2 (Kurulum gerekli)
```

### Güvenlik Notları
- ✅ `.env.local` dosyası `.gitignore`'da
- ✅ Token'lar asla commit edilmez
- ✅ GitHub token düzenli olarak yenilenir
- ✅ Supabase password güvenli tutulur
- ⚠️ Opsiyonel servisler için credential eklendiğinde VS Code restart gerekir

---

## 🎓 Öğrenme Kaynakları

1. **MCP Official Documentation**
   - https://modelcontextprotocol.io/

2. **GitHub Copilot with MCP**
   - https://docs.github.com/en/copilot/

3. **Individual MCP Servers**
   - Filesystem: https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
   - GitHub: https://github.com/modelcontextprotocol/servers/tree/main/src/github
   - PostgreSQL: https://github.com/modelcontextprotocol/servers/tree/main/src/postgres
   - Time: https://github.com/modelcontextprotocol/servers/tree/main/src/time
   - Brave Search: https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search
   - Git: https://github.com/modelcontextprotocol/servers/tree/main/src/git
   - Puppeteer: https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer
   - Slack: https://github.com/modelcontextprotocol/servers/tree/main/src/slack

---

## 🚀 Başlangıç Checklist

- [ ] VS Code'u yeniden başlat (CMD + Q)
- [ ] GitHub Copilot Chat'i aç (CMD + Shift + I)
- [ ] Filesystem MCP test: `@workspace list all .tsx files`
- [ ] GitHub MCP test: `@workspace show last 5 commits`
- [ ] PostgreSQL MCP test: `@workspace describe user_profiles table`
- [ ] Time MCP test: `@workspace convert 15 March 1990 Istanbul to UTC`
- [ ] Fetch MCP test: `@workspace test n8n webhook`
- [ ] Memory MCP test: `@workspace remember our icon strategy`
- [ ] Git MCP test: `@workspace show git log`
- [ ] Puppeteer MCP test: `@workspace take screenshot of localhost:8081`
- [ ] (Opsiyonel) Brave Search setup
- [ ] (Opsiyonel) Slack integration setup
- [ ] (Opsiyonel) Google Drive setup

---

## 💡 İpuçları

1. **@workspace prefix'ini kullan:** Tüm MCP komutları `@workspace` ile başlar
2. **Spesifik ol:** Ne istediğini açıkça belirt
3. **Context ver:** Dosya yolu, tablo adı, tarih gibi detaylar ekle
4. **Dene ve öğren:** MCP'ler akıllı, doğal dil ile konuşabilirsin
5. **Memory MCP kullan:** Önemli bilgileri kaydet, sonra hatırla

---

**📅 Son Güncelleme:** 30 Eylül 2025  
**🔧 Konfigürasyon:** `.vscode/settings.json`  
**📚 Detaylı Rehber:** `.vscode/MCP_SETUP.md`  
**🚀 Hızlı Başlangıç:** `.vscode/MCP_QUICK_START.md`

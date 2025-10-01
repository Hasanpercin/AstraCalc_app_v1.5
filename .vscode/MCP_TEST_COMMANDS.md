# 🚀 MCP Test Komutları - Hızlı Referans

## ⚡ Hızlı Testler (5 dakika)

### ✅ Temel Test
```
@workspace list all .tsx files in app folder
```
**Beklenen:** .tsx dosyalarının listesi

---

### 🔗 GitHub MCP
```
@workspace show last 5 commits
```
**Beklenen:** Son 5 commit'in listesi

---

### 🗄️ PostgreSQL MCP
```
@workspace describe user_profiles table structure
```
**Beklenen:** Tablo şeması (columns, types)

---

### ⏰ Time MCP (Astroloji için kritik!)
```
@workspace convert 15 March 1990 14:30 Istanbul time to UTC
```
**Beklenen:** UTC zaman dönüşümü

---

### 🧠 Memory MCP
```
@workspace remember that we use emoji fallbacks for lucide-react-native icons
```
**Beklenen:** "I'll remember that" benzeri yanıt

Sonra test et:
```
@workspace what icon strategy do we use in this project?
```
**Beklenen:** Emoji fallback stratejisini hatırlayıp söylemeli

---

## 🎨 Browser & UI Testleri

### 📸 Screenshot Alma
```
@workspace take a screenshot of localhost:8081
```
**Not:** Önce `npx expo start` ile Expo server'ı çalıştır!

---

### 🧪 E2E Test Örneği
```
@workspace automate testing the login form with these steps:
1. Navigate to localhost:8081
2. Find the email input
3. Type "test@example.com"
4. Find password input
5. Type "password123"
6. Click login button
7. Take screenshot
```

---

## 🐛 Error Monitoring

### Sentry Hataları
```
@workspace check Sentry for errors in the last 24 hours
```

```
@workspace show me the most frequent error in Sentry
```

---

## 💾 Local Caching

### SQLite Cache Oluşturma
```
@workspace create a SQLite cache table for birth chart data with these columns:
- id (primary key)
- user_id (text)
- birth_date (text)
- birth_time (text)
- location (text)
- chart_data (json)
- created_at (timestamp)
```

### Cache Sorgulama
```
@workspace query the birth chart cache for user_id = "abc123"
```

---

## 📧 Email Gönderimi (n8n)

### Şifre Sıfırlama Email
```
@workspace send a password reset email to hasanpercin35@gmail.com using the n8n webhook at https://n8n.hasanpercin.xyz/webhook/send-email with this data:
{
  "type": "password-reset",
  "to": "hasanpercin35@gmail.com",
  "data": {
    "firstName": "Hasan",
    "resetLink": "astrocalc://reset-password?token=test123",
    "expiryTime": "1 saat"
  }
}
```

### Haftalık Rapor Email
```
@workspace prepare and send weekly astrology report email to test@example.com for Aries zodiac sign
```

---

## 🔍 Search & Find

### Everything MCP
```
@workspace find all files containing the word "astrology"
```

```
@workspace search for TODO comments across the project
```

---

## 🌿 Git Operations

### Git History
```
@workspace show git log for profile.tsx
```

### Git Blame
```
@workspace who was the last person to modify lib/supabase.ts?
```

### Branch Management
```
@workspace create a new git branch called feature/email-notifications
```

---

## 🎯 Gerçek Dünya Senaryoları

### Senaryo 1: Kullanıcı Şifre Sıfırlama
```
@workspace I need to implement password reset. Here's what I need:
1. Check the forgot-password.tsx file
2. Verify the resetPassword function in lib/supabase.ts
3. Send a test password reset email via n8n
4. Take a screenshot of the forgot password screen
```

### Senaryo 2: Birth Chart Debugging
```
@workspace Help me debug birth chart calculation:
1. Show me the birth chart calculation code
2. Convert test date "15 March 1990 14:30 Istanbul" to UTC
3. Query the database for existing birth charts
4. Check Sentry for any calculation errors
```

### Senaryo 3: Performance Optimization
```
@workspace Optimize this feature:
1. Create a SQLite cache for frequently accessed birth charts
2. Show me which queries are slowest in PostgreSQL
3. Suggest caching strategy
4. Implement cache read/write functions
```

---

## 🔄 Kombo Komutlar

### Full Stack Debug
```
@workspace Full stack debug for login issue:
1. Show git log for login.tsx
2. Check PostgreSQL user_profiles table
3. Review Sentry errors related to "login"
4. Test login form with Puppeteer
5. Send test notification email
```

### Deploy Checklist
```
@workspace Pre-deployment checklist:
1. Show uncommitted git changes
2. List all TODO comments
3. Check Sentry for critical errors
4. Verify database migrations
5. Test screenshot capture
```

---

## 📊 Analytics & Monitoring

### User Activity
```
@workspace Analyze user activity:
1. Query user_profiles count from PostgreSQL
2. Show birth chart creation trends
3. Check error rates in Sentry
4. List most active users
```

### Performance Metrics
```
@workspace Performance report:
1. Check SQLite cache hit rate
2. Show slowest database queries
3. Review Puppeteer test execution times
4. Analyze API response times
```

---

## 💡 Pro Tips

### 1. Chain Multiple MCP'ler
Tek bir komutta birden fazla MCP kullanabilirsin:
```
@workspace Create a comprehensive report:
- Git: show last 10 commits
- PostgreSQL: count total users
- Sentry: list critical errors
- Memory: what are our current priorities?
```

### 2. Context Building
Memory MCP ile sürekli context oluştur:
```
@workspace remember that:
- We use emoji fallbacks for icons
- Supabase URL is https://zeabnuknlnaranrpmyne.supabase.co
- n8n webhook for email is https://n8n.hasanpercin.xyz/webhook/send-email
- Time MCP is critical for astrology calculations
```

### 3. Debug Mode
Detaylı yanıt almak için "explain" ekle:
```
@workspace explain step by step how the birth chart calculation works and test it with a sample date
```

---

## 🚨 Sorun Giderme

### MCP Çalışmıyor?
```
@workspace diagnose MCP issues:
1. List available MCP servers
2. Test each MCP individually
3. Check environment variables
4. Verify authentication tokens
```

### Output Panel Kontrolü
1. **View** → **Output**
2. Dropdown'dan **"GitHub Copilot"** seç
3. MCP initialization loglarını oku
4. Error mesajlarını ara: `"MCP server error"`

---

## 📚 Daha Fazla Bilgi

- **MCP_OVERVIEW.md** - Detaylı MCP açıklamaları ve örnekler
- **MCP_QUICK_START.md** - Hızlı başlangıç rehberi
- **EMAIL_WORKFLOW.md** - n8n email workflow detayları

---

**🎯 En Çok Kullanacağın Komutlar:**
1. `@workspace list all .tsx files` - Dosya arama
2. `@workspace show last 5 commits` - Git history
3. `@workspace convert [date] Istanbul to UTC` - Zaman dönüşümü (Astroloji!)
4. `@workspace take screenshot of localhost:8081` - UI testing
5. `@workspace send email via n8n webhook` - Email gönderimi

**💾 Son Güncelleme:** 30 Eylül 2025

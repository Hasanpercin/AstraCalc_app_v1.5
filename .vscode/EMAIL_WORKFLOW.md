# 📧 Email Gönderimi - n8n Webhook Rehberi

## 🎯 Genel Bakış

AstroCalc projesinde email gönderimi için **n8n workflow** kullanıyoruz. Bu, MCP olmadan bile GitHub Copilot ile entegre çalışabilen güçlü bir çözüm.

## 🔧 n8n Workflow Kurulumu

### 1. Temel Email Workflow

```
┌─────────┐    ┌─────────┐    ┌──────────┐    ┌──────────┐
│ Webhook │ -> │  Filter │ -> │ Template │ -> │   SMTP   │
│ Trigger │    │  Logic  │    │  Engine  │    │   Send   │
└─────────┘    └─────────┘    └──────────┘    └──────────┘
```

### 2. Webhook Node Yapılandırması

**URL:** `https://n8n.hasanpercin.xyz/webhook/send-email`

**Method:** POST

**Request Body Schema:**
```json
{
  "type": "password-reset" | "weekly-report" | "welcome" | "notification",
  "to": "user@example.com",
  "data": {
    "firstName": "Ahmet",
    "resetLink": "https://app.astrocalc.com/reset?token=...",
    "zodiacSign": "Koç",
    "weeklyForecast": "Bu hafta...",
    // template'e göre değişir
  }
}
```

### 3. SMTP Yapılandırması

**Önerilen Servisler:**
- **SendGrid** (Ücretsiz 100 email/gün)
- **Mailgun** (Ücretsiz 5000 email/ay)
- **Gmail** (Günlük limit var)
- **AWS SES** (Ücretsiz 62,000 email/ay)

**SMTP Settings:**
```javascript
{
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: "YOUR_SENDGRID_API_KEY"
  }
}
```

---

## 📋 Email Tipleri ve Template'ler

### 1️⃣ Şifre Sıfırlama Email

**Trigger:** Kullanıcı "Şifremi Unuttum" butonuna tıkladığında

**Webhook Body:**
```json
{
  "type": "password-reset",
  "to": "user@example.com",
  "data": {
    "firstName": "Ahmet",
    "resetLink": "astrocalc://reset-password?token=abc123",
    "expiryTime": "1 saat"
  }
}
```

**HTML Template:**
```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifre Sıfırlama - AstroCalc</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    h1 {
      color: #667eea;
      margin-top: 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 25px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      color: #666;
      font-size: 12px;
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔐 Şifre Sıfırlama</h1>
    <p>Merhaba {{firstName}},</p>
    <p>AstroCalc hesabınızın şifresini sıfırlamak için bir talepte bulundunuz.</p>
    <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
    <a href="{{resetLink}}" class="button">Şifreyi Sıfırla</a>
    <p><strong>Not:</strong> Bu link {{expiryTime}} süreyle geçerlidir.</p>
    <p>Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
    <div class="footer">
      <p>AstroCalc - Kişisel Astroloji Asistanınız</p>
    </div>
  </div>
</body>
</html>
```

---

### 2️⃣ Haftalık Astroloji Raporu

**Trigger:** Her Pazartesi sabahı 09:00 (cron job)

**Webhook Body:**
```json
{
  "type": "weekly-report",
  "to": "user@example.com",
  "data": {
    "firstName": "Ahmet",
    "zodiacSign": "Koç",
    "weekNumber": 39,
    "year": 2025,
    "weeklyForecast": {
      "general": "Bu hafta enerjiniz yüksek...",
      "love": "Aşk hayatınızda heyecan verici gelişmeler...",
      "career": "İş hayatında yeni fırsatlar...",
      "health": "Sağlığınıza dikkat edin...",
      "lucky": {
        "color": "Kırmızı",
        "number": 7,
        "day": "Çarşamba"
      }
    },
    "appLink": "astrocalc://home"
  }
}
```

**HTML Template:**
```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Haftalık Burç Yorumunuz - AstroCalc</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .content {
      padding: 40px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h3 {
      color: #667eea;
      margin-bottom: 10px;
    }
    .lucky-box {
      background: #f8f9ff;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 25px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌟 Bu Haftanın Burç Yorumu</h1>
      <p>Hafta {{weekNumber}} - {{year}}</p>
    </div>
    <div class="content">
      <p>Merhaba {{firstName}},</p>
      <p>{{zodiacSign}} burcu için bu haftanın yıldız haritası hazır!</p>
      
      <div class="section">
        <h3>✨ Genel Yorum</h3>
        <p>{{weeklyForecast.general}}</p>
      </div>
      
      <div class="section">
        <h3>❤️ Aşk & İlişkiler</h3>
        <p>{{weeklyForecast.love}}</p>
      </div>
      
      <div class="section">
        <h3>💼 Kariyer & İş</h3>
        <p>{{weeklyForecast.career}}</p>
      </div>
      
      <div class="section">
        <h3>🏥 Sağlık</h3>
        <p>{{weeklyForecast.health}}</p>
      </div>
      
      <div class="lucky-box">
        <h3>🍀 Şanslı Detaylar</h3>
        <p><strong>Şanslı Renk:</strong> {{weeklyForecast.lucky.color}}</p>
        <p><strong>Şanslı Sayı:</strong> {{weeklyForecast.lucky.number}}</p>
        <p><strong>Şanslı Gün:</strong> {{weeklyForecast.lucky.day}}</p>
      </div>
      
      <a href="{{appLink}}" class="button">Uygulamayı Aç</a>
    </div>
  </div>
</body>
</html>
```

---

### 3️⃣ Hoşgeldin Email

**Trigger:** Yeni kullanıcı kaydı

**Webhook Body:**
```json
{
  "type": "welcome",
  "to": "newuser@example.com",
  "data": {
    "firstName": "Ayşe",
    "verificationLink": "astrocalc://verify?token=xyz789",
    "appLink": "astrocalc://home"
  }
}
```

**HTML Template:**
```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Hoşgeldiniz - AstroCalc</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      padding: 40px;
    }
    .emoji {
      font-size: 48px;
      text-align: center;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 25px;
      font-weight: bold;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">🌟</div>
    <h1 style="text-align: center; color: #667eea;">Hoşgeldiniz!</h1>
    <p>Merhaba {{firstName}},</p>
    <p>AstroCalc ailesine hoşgeldiniz! 🎉</p>
    <p>Hesabınızı doğrulamak için lütfen aşağıdaki butona tıklayın:</p>
    <a href="{{verificationLink}}" class="button">Hesabı Doğrula</a>
    <p>AstroCalc ile neler yapabilirsiniz:</p>
    <ul>
      <li>🎂 Doğum haritanızı oluşturun</li>
      <li>🌙 Günlük burç yorumlarını okuyun</li>
      <li>💫 Yıldız haritanızı keşfedin</li>
      <li>🤖 AI astroloji asistanıyla konuşun</li>
    </ul>
    <a href="{{appLink}}" class="button">Uygulamayı Keşfet</a>
  </div>
</body>
</html>
```

---

### 4️⃣ Bildirim Email (Generic)

**Trigger:** Sistem bildirimleri, güncellemeler

**Webhook Body:**
```json
{
  "type": "notification",
  "to": "user@example.com",
  "data": {
    "firstName": "Mehmet",
    "title": "Yeni Özellik: AI Astroloji Asistanı",
    "message": "Artık yapay zeka destekli astroloji asistanımızla sohbet edebilirsiniz!",
    "actionText": "Hemen Dene",
    "actionLink": "astrocalc://ai-chat"
  }
}
```

---

## 🎨 n8n Workflow Konfigürasyonu

### Adım 1: Webhook Node
```javascript
{
  "httpMethod": "POST",
  "path": "send-email",
  "responseMode": "onReceived",
  "authentication": "headerAuth",
  "options": {
    "allowedOrigins": "*"
  }
}
```

### Adım 2: Switch Node (Email Type)
```javascript
{
  "mode": "rules",
  "rules": [
    {
      "conditions": [
        ["{{$json.type}}", "equals", "password-reset"]
      ],
      "output": 0
    },
    {
      "conditions": [
        ["{{$json.type}}", "equals", "weekly-report"]
      ],
      "output": 1
    },
    {
      "conditions": [
        ["{{$json.type}}", "equals", "welcome"]
      ],
      "output": 2
    },
    {
      "conditions": [
        ["{{$json.type}}", "equals", "notification"]
      ],
      "output": 3
    }
  ]
}
```

### Adım 3: Template Node (Her tip için)
```javascript
{
  "mode": "html",
  "template": "<!-- HTML template buraya -->",
  "dataPropertyName": "html"
}
```

### Adım 4: SMTP Node
```javascript
{
  "fromEmail": "noreply@astrocalc.com",
  "toEmail": "={{$json.to}}",
  "subject": "={{$json.subject}}",
  "emailFormat": "html",
  "text": "={{$json.html}}",
  "options": {
    "attachments": [],
    "ccEmail": "",
    "bccEmail": ""
  }
}
```

---

## 🚀 GitHub Copilot ile Kullanım

### Fetch MCP ile Email Gönderme

```
@workspace Send a password reset email to hasanpercin35@gmail.com using n8n webhook
```

**Copilot'un yapacağı:**
```typescript
const response = await fetch('https://n8n.hasanpercin.xyz/webhook/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'password-reset',
    to: 'hasanpercin35@gmail.com',
    data: {
      firstName: 'Hasan',
      resetLink: 'astrocalc://reset-password?token=abc123',
      expiryTime: '1 saat'
    }
  })
});
```

### Haftalık Rapor Gönderme

```
@workspace Send weekly astrology report to all active users
```

**Copilot'un yapacağı:**
```typescript
// Supabase'den aktif kullanıcıları çek
const { data: users } = await supabase
  .from('user_profiles')
  .select('email, first_name, birth_data')
  .eq('weekly_email_enabled', true);

// Her kullanıcı için email gönder
for (const user of users) {
  await fetch('https://n8n.hasanpercin.xyz/webhook/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'weekly-report',
      to: user.email,
      data: {
        firstName: user.first_name,
        zodiacSign: calculateZodiacSign(user.birth_data),
        weeklyForecast: await getWeeklyForecast(user.birth_data)
      }
    })
  });
}
```

---

## 📊 Email Tracking (İsteğe Bağlı)

### SendGrid ile Open/Click Tracking

```javascript
// SMTP Node options
{
  "options": {
    "trackingSettings": {
      "clickTracking": { "enable": true },
      "openTracking": { "enable": true }
    }
  }
}
```

### Custom Analytics
```typescript
// Email'e unique tracking pixel ekle
const trackingPixel = `<img src="https://n8n.hasanpercin.xyz/webhook/email-opened?user=${userId}&email=${emailId}" width="1" height="1" />`;
```

---

## 🔒 Güvenlik

1. **Rate Limiting:** n8n webhook'a rate limit ekle
2. **Authentication:** Webhook için API key kullan
3. **Validation:** Email adreslerini validate et
4. **Spam Prevention:** Email template'lerde unsubscribe link ekle

---

## 🧪 Test Senaryoları

### Test 1: Şifre Sıfırlama
```bash
curl -X POST https://n8n.hasanpercin.xyz/webhook/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "password-reset",
    "to": "test@example.com",
    "data": {
      "firstName": "Test",
      "resetLink": "astrocalc://reset?token=test123",
      "expiryTime": "1 saat"
    }
  }'
```

### Test 2: Haftalık Rapor
```bash
curl -X POST https://n8n.hasanpercin.xyz/webhook/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "weekly-report",
    "to": "test@example.com",
    "data": {
      "firstName": "Test",
      "zodiacSign": "Koç",
      "weeklyForecast": {
        "general": "Test forecast"
      }
    }
  }'
```

---

## 📚 İlgili Dosyalar

- **lib/email.ts** - Email helper functions (oluşturulacak)
- **services/notification.ts** - Notification service (oluşturulacak)
- **.env** - `EXPO_PUBLIC_WEBHOOK_URL` (zaten var)

---

**📝 Not:** Bu rehber n8n workflow kurulumunu ve GitHub Copilot entegrasyonunu gösterir. Email MCP olmasa da, Fetch MCP ile kolayca email gönderebilirsiniz!

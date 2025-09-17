// Detailed Figma Analysis Script
const https = require('https');

async function analyzeFigmaDesign() {
  const fileKey = '75ljkFbxhCU0DrEyxFyD5o';
  const token = 'figd_xAk0tLoqggtI8mAjtadX5mzYhAwPxarjt7Fido2n';
  
  try {
    console.log('🎨 Detaylı Figma analizi başlıyor...\n');
    
    const data = await getFigmaFile(fileKey, token);
    
    console.log('📋 === DOSYA BİLGİLERİ ===');
    console.log(`📁 Dosya: ${data.name}`);
    console.log(`🆔 ID: ${fileKey}`);
    console.log(`📄 Sayfa sayısı: ${data.document?.children?.length || 0}\n`);
    
    // Renk paletini çıkar
    console.log('🎨 === RENK PALETİ ===');
    const colors = extractColors(data);
    Object.entries(colors).forEach(([name, color]) => {
      console.log(`🎨 ${name}: ${color}`);
    });
    console.log('');
    
    // Burçlar sayfalarını bul
    console.log('🌟 === BURÇLAR SAYFALARI ===');
    const zodiacScreens = findZodiacScreens(data);
    zodiacScreens.forEach(screen => {
      console.log(`📱 ${screen.name}`);
      console.log(`   📐 Boyut: ${screen.width}x${screen.height}`);
      console.log(`   🎯 Tip: ${screen.type}`);
      console.log(`   📍 Konum: ${screen.x}, ${screen.y}`);
      console.log('');
    });
    
    // Text stilleri
    console.log('✏️  === TEXT STİLLERİ ===');
    const textStyles = extractTextStyles(data);
    textStyles.forEach(style => {
      console.log(`📝 ${style.text}`);
      console.log(`   📏 Font: ${style.fontFamily || 'Default'} ${style.fontSize || 16}px`);
      console.log(`   ⚖️  Weight: ${style.fontWeight || 'normal'}`);
      console.log(`   🎨 Renk: ${style.color || 'default'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

function getFigmaFile(fileKey, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.figma.com',
      path: `/v1/files/${fileKey}`,
      method: 'GET',
      headers: {
        'X-Figma-Token': token,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

function extractColors(data) {
  const colors = {};
  let colorIndex = 0;
  
  function traverseForColors(node) {
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach(fill => {
        if (fill.type === 'SOLID' && fill.color) {
          const { r, g, b } = fill.color;
          const hex = `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
          colors[`color_${colorIndex++}`] = hex;
        }
      });
    }
    
    if (node.children) {
      node.children.forEach(traverseForColors);
    }
  }
  
  if (data.document) {
    traverseForColors(data.document);
  }
  
  return colors;
}

function findZodiacScreens(data) {
  const screens = [];
  const zodiacKeywords = ['burç', 'zodiac', 'horoscope', 'günlük', 'yorum', 'koç', 'boğa', 'ikizler', 'yengeç', 'aslan', 'başak', 'terazi', 'akrep', 'yay', 'oğlak', 'kova', 'balık'];
  
  function searchScreens(node) {
    if (node.type === 'FRAME' && node.name) {
      const name = node.name.toLowerCase();
      const isZodiacScreen = zodiacKeywords.some(keyword => name.includes(keyword));
      
      if (isZodiacScreen) {
        screens.push({
          name: node.name,
          type: node.type,
          width: node.absoluteBoundingBox?.width || 0,
          height: node.absoluteBoundingBox?.height || 0,
          x: node.absoluteBoundingBox?.x || 0,
          y: node.absoluteBoundingBox?.y || 0,
          id: node.id
        });
      }
    }
    
    if (node.children) {
      node.children.forEach(searchScreens);
    }
  }
  
  if (data.document) {
    searchScreens(data.document);
  }
  
  return screens;
}

function extractTextStyles(data) {
  const textStyles = [];
  
  function findTextNodes(node) {
    if (node.type === 'TEXT') {
      const style = {
        text: node.characters || 'No text',
        fontFamily: node.style?.fontFamily,
        fontSize: node.style?.fontSize,
        fontWeight: node.style?.fontWeight,
        color: node.fills?.[0]?.color ? 
          `#${Math.round(node.fills[0].color.r * 255).toString(16).padStart(2, '0')}${Math.round(node.fills[0].color.g * 255).toString(16).padStart(2, '0')}${Math.round(node.fills[0].color.b * 255).toString(16).padStart(2, '0')}` 
          : null
      };
      textStyles.push(style);
    }
    
    if (node.children) {
      node.children.forEach(findTextNodes);
    }
  }
  
  if (data.document) {
    findTextNodes(data.document);
  }
  
  return textStyles.slice(0, 10); // İlk 10 text stili
}

analyzeFigmaDesign();

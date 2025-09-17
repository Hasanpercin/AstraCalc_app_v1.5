// Figma Test Script
const https = require('https');

async function testFigma() {
  const fileKey = '75ljkFbxhCU0DrEyxFyD5o';
  const token = 'figd_xAk0tLoqggtI8mAjtadX5mzYhAwPxarjt7Fido2n';
  
  try {
    console.log('🎨 Figma dosyası kontrol ediliyor...');
    
    const data = await new Promise((resolve, reject) => {
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
    console.log('✅ Figma dosyası başarıyla yüklendi');
    console.log('📁 Dosya adı:', data.name);
    console.log('📝 Açıklama:', data.description || 'Açıklama yok');
    console.log('📄 Sayfa sayısı:', data.document?.children?.length || 0);
    
    // Sayfaları listele
    if (data.document?.children) {
      data.document.children.forEach((page, index) => {
        console.log(`📋 Sayfa ${index + 1}: ${page.name}`);
        
        // Her sayfadaki frame'leri listele
        if (page.children) {
          page.children.forEach((frame, frameIndex) => {
            if (frame.type === 'FRAME') {
              console.log(`  📱 Frame ${frameIndex + 1}: ${frame.name}`);
            }
          });
        }
      });
    }
    
    // Burçlar ile ilgili frame'leri ara
    console.log('\n🔍 Burçlar sayfalarını arıyorum...');
    searchZodiacFrames(data);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

function searchZodiacFrames(data) {
  const zodiacKeywords = ['burç', 'zodiac', 'horoscope', 'günlük', 'yorum'];
  
  function searchInNode(node, path = '') {
    if (node.name) {
      const nodeName = node.name.toLowerCase();
      const isZodiacRelated = zodiacKeywords.some(keyword => 
        nodeName.includes(keyword)
      );
      
      if (isZodiacRelated) {
        console.log(`🌟 Burç sayfası bulundu: ${path}/${node.name}`);
        console.log(`   📐 Boyutlar: ${node.absoluteBoundingBox?.width || 0} x ${node.absoluteBoundingBox?.height || 0}`);
        console.log(`   🏷️  Tip: ${node.type}`);
      }
    }
    
    if (node.children) {
      node.children.forEach(child => {
        searchInNode(child, `${path}/${node.name || 'root'}`);
      });
    }
  }
  
  if (data.document) {
    searchInNode(data.document);
  }
}

testFigma();

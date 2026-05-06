const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function downloadImage(url, filename) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    const filePath = path.join(UPLOADS_DIR, filename);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Ошибка при скачивании ${url}:`, error.message);
    return null;
  }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 Начинаю прогрузку картинок в локальное хранилище...');
  
  const products = await prisma.product.findMany();
  let count = 0;

  for (const product of products) {
    if (product.imageUrl && product.imageUrl.startsWith('http') && !product.imageUrl.includes('localhost')) {
      const extension = '.jpg';
      const filename = `product-${product.id}-${Date.now()}${extension}`;
      
      console.log(`Downloading for product #${product.id}: ${product.imageUrl}`);
      const success = await downloadImage(product.imageUrl, filename);
      
      if (success !== null) {
        const localUrl = `http://localhost:5000/uploads/${filename}`;
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: localUrl }
        });
        count++;
      }
      // Wait 1 second between downloads
      await sleep(1000);
    }
  }

  console.log(`✅ Готово! Прогружено картинок: ${count}`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

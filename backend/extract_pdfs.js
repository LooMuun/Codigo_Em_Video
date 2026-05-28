const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const slidesDir = 'C:/Users/velton/Codigo_Em_Video/curso_cienciaDeDados/slides';

async function extract() {
  const files = fs.readdirSync(slidesDir).filter(f => f.endsWith('.pdf'));
  console.log(`Found ${files.length} PDF files.`);

  for (const file of files) {
    const filePath = path.join(slidesDir, file);
    const dataBuffer = fs.readFileSync(filePath);
    try {
      const data = await pdf(dataBuffer);
      console.log(`--- FILE: ${file} ---`);
      console.log(data.text.substring(0, 1000)); // Print first 1000 chars to identify titles
      console.log('--- END ---\n');
    } catch (e) {
      console.error(`Error reading ${file}: ${e.message}`);
    }
  }
}

extract();

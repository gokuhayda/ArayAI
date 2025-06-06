const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('https://openai.com/pricing', { waitUntil: 'networkidle2' });

  // Aguarda os cards com preços aparecerem
  await page.waitForSelector('main');

  const content = await page.evaluate(() => {
    const data = {};

    const parsePrice = (text) => {
      const match = text.match(/\$([\d.]+)\/1K tokens/);
      return match ? parseFloat(match[1]) : null;
    };

    document.querySelectorAll('main').forEach(main => {
      const html = main.innerText;

      const modelos = [
        { nome: 'gpt-4o', key: 'gpt-4o' },
        { nome: 'gpt-4-turbo', key: 'gpt-4-0125-preview' },
        { nome: 'gpt-3.5-turbo', key: 'gpt-3.5-turbo' },
        { nome: 'whisper', key: 'whisper-1' }
      ];

      modelos.forEach(({ nome, key }) => {
        const section = html.split('\n').filter(line => line.toLowerCase().includes(nome));
        if (section.length > 0) {
          const prompt = section.find(l => l.toLowerCase().includes('prompt'));
          const completion = section.find(l => l.toLowerCase().includes('completion'));
          const audio = section.find(l => l.toLowerCase().includes('audio'));

          data[key] = {};

          if (prompt) data[key].prompt = parsePrice(prompt);
          if (completion) data[key].completion = parsePrice(completion);
          if (audio) {
            const match = audio.match(/\$([\d.]+)\/minute/);
            data[key].audio_minuto = match ? parseFloat(match[1]) : null;
          }

          data[key].moeda = 'USD';
          data[key].fonte = 'https://openai.com/pricing';
        }
      });
    });

    return data;
  });

  console.log('🧾 Preços extraídos:\n', JSON.stringify(content, null, 2));

  // Opcional: salvar em arquivo local
  fs.writeFileSync('precos_openai.json', JSON.stringify(content, null, 2));

  await browser.close();
})();

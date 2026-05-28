require('dotenv').config({ path: 'C:/Users/velton/Codigo_Em_Video/backend/.env' });
const { Client } = require('pg');

const dbUrl = process.env.DATABASE_URL?.replace(/['"]+/g, '');
if (!dbUrl) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

const modulesData = [
  {
    title: 'Fundamentos e Percepção Visual',
    description: 'Fundamentos essenciais da visualização de dados, explorando a teoria da percepção visual e aplicações práticas.',
    img: 'https://placeholder.com/module1.png',
    classrooms: [
      { title: 'A Ciência por Trás do Data Viz', description: 'Princípios da percepção humana e eficácia das visualizações.', url: 'aula1.mp4', img: 'https://placeholder.com/aula1.png' },
      { title: 'Atributos Pré-atentivos', description: 'Como o cérebro enxerga antes de pensar e como usar isso a seu favor.', url: 'aula2.mp4', img: 'https://placeholder.com/aula2.png' },
      { title: 'Tipos de Dados e Escalas', description: 'Classificação de dados e escolha de escalas para representações precisas.', url: 'aula3.mp4', img: 'https://placeholder.com/aula3.png' },
    ]
  },
  {
    title: 'Análise Exploratória com Pandas',
    description: 'Aplicações práticas de visualização de dados utilizando Pandas, Matplotlib e Seaborn.',
    img: 'https://placeholder.com/module2.png',
    classrooms: [
      { title: 'Aula 4: Introdução ao Seaborn', description: 'Primeiros passos com a biblioteca Seaborn.', url: 'aula4.mp4', img: 'https://placeholder.com/aula4.png' },
      { title: 'Aula 5: Gráficos de Barras e Linhas', description: 'Criando visualizações comparativas e temporais.', url: 'aula5.mp4', img: 'https://placeholder.com/aula5.png' },
      { title: 'Aula 6: Customização de Gráficos', description: 'Melhorando a estética e legibilidade das visualizações.', url: 'aula6.mp4', img: 'https://placeholder.com/aula6.png' },
    ]
  },
  {
    title: 'Gráficos Essenciais',
    description: 'Guia sobre a escolha do gráfico certo para responder diferentes perguntas de negócio.',
    img: 'https://placeholder.com/module3.png',
    classrooms: [
      { title: 'Introdução aos Gráficos Essenciais', description: 'Como escolher o gráfico certo para cada pergunta.', url: 'aula7.mp4', img: 'https://placeholder.com/aula7.png' },
      { title: 'Gráfico de Pizza', description: 'Visualizando proporções e divisões de um todo.', url: 'aula8.mp4', img: 'https://placeholder.com/aula8.png' },
      { title: 'Histograma', description: 'Análise de distribuição de valores numéricos contínuos.', url: 'aula9.mp4', img: 'https://placeholder.com/aula9.png' },
      { title: 'Boxplot', description: 'Resumo de distribuição e detecção de outliers.', url: 'aula10.mp4', img: 'https://placeholder.com/aula10.png' },
      { title: 'Gráfico de Violino', description: 'Combinação de boxplot com a forma da distribuição.', url: 'aula11.mp4', img: 'https://placeholder.com/aula11.png' },
    ]
  },
  {
    title: 'Relações e Séries Temporais',
    description: 'Análise de correlações, tendências temporais e segmentação de dados.',
    img: 'https://placeholder.com/module4.png',
    classrooms: [
      { title: 'Scatter Plots', description: 'Visualizando relações entre variáveis em gráficos de dispersão.', url: 'aula12.mp4', img: 'https://placeholder.com/aula12.png' },
      { title: 'Regressão', description: 'Identificando tendências e relações lineares entre variáveis.', url: 'aula13.mp4', img: 'https://placeholder.com/aula1_ la.png' },
      { title: 'Séries Temporais I', description: 'Trabalhando com dados organizados por tempo e sazonalidade.', url: 'aula14.mp4', img: 'https://placeholder.com/aula14.png' },
      { title: 'Séries Temporais II', description: 'Gráficos de área e a importância da base zero.', url: 'aula15.mp4', img: 'https://placeholder.com/aula15.png' },
      { title: 'FacetGrid', description: 'Criando múltiplos gráficos para comparar categorias.', url: 'aula16.mp4', img: 'https://placeholder.com/aula16.png' },
    ]
  },
  {
    title: 'Design e Ética Visual',
    description: 'Princípios de design para tornar gráficos profissionais, claros e honestos.',
    img: 'https://placeholder.com/module5.png',
    classrooms: [
      { title: 'Data-Ink Ratio', description: 'Removendo elementos desnecessários para focar nos dados.', url: 'aula17.mp4', img: 'https://placeholder.com/aula17.png' },
      { title: 'Títulos e Labels', description: 'Criando comunicações claras e insights objetivos.', url: 'aula18.mp4', img: 'https://placeholder.com/aula18.png' },
      { title: 'Paleta Emocional', description: 'Psicologia das cores e sua influência na interpretação.', url: 'aula19.mp4', img: 'https://placeholder.com/aula19.png' },
      { title: 'Ética Visual', description: 'Como evitar a manipulação de dados através de gráficos.', url: 'aula20.mp4', img: 'https://placeholder.com/aula20.png' },
      { title: 'Do Notebook para o Slide', description: 'Adaptando visualizações para apresentações profissionais.', url: 'aula21.mp4', img: 'https://placeholder.com/aula21.png' },
    ]
  },
];

async function seed() {
  try {
    await client.connect();
    console.log('Connected to database.');

    for (const mod of modulesData) {
      const res = await client.query(
        'INSERT INTO "Module" (id, title, description, img, "createdAt") VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
        [require('crypto').randomUUID(), mod.title, mod.description, mod.img]
      );
      const moduleId = res.rows[0].id;
      console.log(`Inserted module: ${mod.title}`);

      for (const cls of mod.classrooms) {
        await client.query(
          'INSERT INTO "Classroom" (id, title, description, url, img, "moduleId") VALUES ($1, $2, $3, $4, $5, $6)',
          [require('crypto').randomUUID(), cls.title, cls.description, cls.url, cls.img, moduleId]
        );
      }
      console.log(`- Added ${mod.classrooms.length} classrooms.`);
    }
    console.log('Database seeded successfully!');
  } catch (e) {
    console.error('Error seeding database:', e);
  } finally {
    await client.end();
  }
}

seed();

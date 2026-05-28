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

const quizData = {
  'A Ciência por Trás do Data Viz': {
    question: 'Qual o principal objetivo da Ciência da Visualização de Dados?',
    options: [
      { text: 'Transformar dados em representações visuais que facilitem a compreensão humana.', isCorrect: true },
      { text: 'Apenas tornar as tabelas de dados mais coloridas e atraentes.', isCorrect: false },
      { text: 'Substituir completamente a análise estatística por imagens.', isCorrect: false },
      { text: 'Aumentar a complexidade dos dados para impressionar a audiência.', isCorrect: false },
    ]
  },
  'Atributos Pré-atentivos': {
    question: 'O que caracteriza um atributo pré-atentivo na percepção visual?',
    options: [
      { text: 'A capacidade do cérebro de detectar padrões visualmente em menos de 250ms.', isCorrect: true },
      { text: 'A necessidade de leitura atenta de rótulos para entender o gráfico.', isCorrect: false },
      { text: 'O processo consciente de analisar cada ponto de dado individualmente.', isCorrect: false },
      { text: 'A dependência exclusiva de legendas para interpretar cores.', isCorrect: false },
    ]
  },
  'Tipos de Dados e Escalas': {
    question: 'Qual escala de dado possui um "zero absoluto", permitindo dizer que um valor é o dobro do outro?',
    options: [
      { text: 'Escala de Razão (Ratio)', isCorrect: true },
      { text: 'Escala de Intervalo', isCorrect: false },
      { text: 'Escala Ordinal', isCorrect: false },
      { text: 'Escala Nominal', isCorrect: false },
    ]
  },
  'Aula 4: Introdução ao Seaborn': {
    question: 'Qual a principal vantagem da biblioteca Seaborn em relação ao Matplotlib?',
    options: [
      { text: 'Oferecer interfaces de alto nível para criar gráficos estatísticos complexos com menos código.', isCorrect: true },
      { text: 'Ser a única biblioteca capaz de gerar gráficos em Python.', isCorrect: false },
      { text: 'Não depender do Matplotlib para renderizar imagens.', isCorrect: false },
      { text: 'Remover a necessidade de limpar os dados antes da visualização.', isCorrect: false },
    ]
  },
  'Aula 5: Gráficos de Barras e Linhas': {
    question: 'Quando é mais indicado utilizar um gráfico de linhas em vez de um de barras?',
    options: [
      { text: 'Para mostrar a evolução de uma variável ao longo do tempo (séries temporais).', isCorrect: true },
      { text: 'Para comparar a proporção de fatias de um todo.', isCorrect: false },
      { text: 'Para identificar a correlação entre duas variáveis numéricas.', isCorrect: false },
      { text: 'Sempre que houver mais de 10 categorias diferentes.', isCorrect: false },
    ]
  },
  'Aula 6: Customização de Gráficos': {
    question: 'Qual a melhor prática para customizar a estética de um gráfico sem prejudicar a análise?',
    options: [
      { text: 'Remover elementos redundantes e usar cores com propósito funcional.', isCorrect: true },
      { text: 'Adicionar o máximo de sombras, gradientes e bordas 3D possíveis.', isCorrect: false },
      { text: 'Usar cores vibrantes em todos os elementos para chamar a atenção.', isCorrect: false },
      { text: 'Remover todos os labels de eixos para deixar o visual mais limpo.', isCorrect: false },
    ]
  },
  'Introdução aos Gráficos Essenciais': {
    question: 'O que deve vir primeiro no processo de criação de uma visualização?',
    options: [
      { text: 'A definição da pergunta que o gráfico deve responder.', isCorrect: true },
      { text: 'A escolha da cor do fundo do gráfico.', isCorrect: false },
      { text: 'A seleção da ferramenta de software.', isCorrect: false },
      { text: 'A exportação do arquivo final.', isCorrect: false },
    ]
  },
  'Gráfico de Pizza': {
    question: 'Qual a principal limitação do gráfico de pizza?',
    options: [
      { text: 'Dificuldade de leitura quando há muitas categorias (mais de 5 ou 6).', isCorrect: true },
      { text: 'Incapacidade de mostrar a relação parte-todo.', isCorrect: false },
      { text: 'Não permitir a alteração de cores nas fatias.', isCorrect: false },
      { text: 'Exigir obrigatoriamente que os dados sejam negativos.', isCorrect: false },
    ]
  },
  'Histograma': {
    question: 'Qual a principal diferença entre um histograma e um gráfico de barras?',
    options: [
      { text: 'O histograma lida com dados numéricos contínuos divididos em intervalos (bins).', isCorrect: true },
      { text: 'O gráfico de barras é usado apenas para dados temporais.', isCorrect: false },
      { text: 'O histograma não permite a visualização de frequência.', isCorrect: false },
      { text: 'As barras do histograma devem ter espaços largos entre elas.', isCorrect: false },
    ]
  },
  'Boxplot': {
    question: 'O que a linha central dentro da caixa de um Boxplot representa?',
    options: [
      { text: 'A mediana do conjunto de dados.', isCorrect: true },
      { text: 'A média aritmética simples.', isCorrect: false },
      { text: 'O valor máximo do dataset.', isCorrect: false },
      { text: 'O primeiro quartil (Q1).', isCorrect: false },
    ]
  },
  'Gráfico de Violino': {
    question: 'Qual a principal vantagem do gráfico de violino sobre o boxplot?',
    options: [
      { text: 'Revelar a forma completa da distribuição, incluindo múltiplos picos (bimodalidade).', isCorrect: true },
      { text: 'Ser muito mais simples de ler para públicos leigos.', isCorrect: false },
      { text: 'Exigir menos dados para ser construído.', isCorrect: false },
      { text: 'Eliminar a necessidade de mostrar a mediana.', isCorrect: false },
    ]
  },
  'Scatter Plots': {
    question: 'Em um Scatter Plot, o que indica uma correlação positiva entre duas variáveis?',
    options: [
      { text: 'Os pontos tendem a formar uma subida da esquerda para a direita.', isCorrect: true },
      { text: 'Os pontos ficam totalmente dispersos sem qualquer padrão.', isCorrect: false },
      { text: 'Os pontos formam uma linha descendente da esquerda para a direita.', isCorrect: false },
      { text: 'Todos os pontos ficam concentrados em um único local do gráfico.', isCorrect: false },
    ]
  },
  'Regressão': {
    question: 'Para que serve a "linha de tendência" (regressão) em um gráfico de dispersão?',
    options: [
      { text: 'Para simplificar a relação entre as variáveis e prever tendências.', isCorrect: true },
      { text: 'Para conectar cada ponto individualmente em ordem cronológica.', isCorrect: false },
      { text: 'Para esconder outliers que prejudicam a estética do gráfico.', isCorrect: false },
      { text: 'Apenas para decorar o gráfico com cores vibrantes.', isCorrect: false },
    ]
  },
  'Séries Temporais I': {
    question: 'O que é a "sazonalidade" em séries temporais?',
    options: [
      { text: 'Padrões que se repetem em intervalos regulares (ex: vendas maiores no Natal).', isCorrect: true },
      { text: 'A tendência de longo prazo de crescimento de uma variável.', isCorrect: false },
      { text: 'O erro aleatório que ocorre na coleta de dados temporais.', isCorrect: false },
      { text: 'A conversão de datas para o formato ISO 8601.', isCorrect: false },
    ]
  },
  'Séries Temporais II': {
    question: 'Por que a "base zero" é fundamental em gráficos de séries temporais com área?',
    options: [
      { text: 'Para evitar distorções visuais que podem enganar a percepção de crescimento.', isCorrect: true },
      { text: 'Porque o Matplotlib não consegue renderizar gráficos sem base zero.', isCorrect: false },
      { text: 'Para que as cores do gráfico fiquem mais saturadas.', isCorrect: false },
      { text: 'Para economizar espaço no eixo vertical do gráfico.', isCorrect: false },
    ]
  },
  'FacetGrid': {
    question: 'Qual a principal utilidade do FacetGrid no Seaborn?',
    options: [
      { text: 'Criar múltiplos subgráficos baseados em categorias para comparar padrões.', isCorrect: true },
      { text: 'Transformar um gráfico 2D em uma visualização 3D complexa.', isCorrect: false },
      { text: 'Soma automática de todos os valores de todas as categorias.', isCorrect: false },
      { text: 'Remover automaticamente todos os outliers do dataset.', isCorrect: false },
    ]
  },
  'Data-Ink Ratio': {
    question: 'Segundo Edward Tufte, o que deve ser feito com a "tinta não-dados" (non-data-ink)?',
    options: [
      { text: 'Deve ser minimizada ou removida para dar foco total à informação útil.', isCorrect: true },
      { text: 'Deve ser aumentada para preencher espaços vazios no slide.', isCorrect: false },
      { text: 'Deve ser usada para criar bordas decorativas e sombras pesadas.', isCorrect: false },
      { text: 'Não deve ser alterada, pois as grades são essenciais para qualquer gráfico.', isCorrect: false },
    ]
  },
  'Títulos e Labels': {
    question: 'Qual a característica de um título de gráfico eficiente?',
    options: [
      { text: 'Deve comunicar o insight principal, em vez de apenas descrever os eixos.', isCorrect: true },
      { text: 'Deve ser o mais longo possível para explicar todos os detalhes.', isCorrect: false },
      { text: 'Deve ser genérico, como "Gráfico 1" ou "Análise de Dados".', isCorrect: false },
      { text: 'Não deve conter palavras, apenas números e símbolos.', isCorrect: false },
    ]
  },
  'Paleta Emocional': {
    question: 'Na psicologia das cores para dashboards, qual cor é geralmente associada a alertas ou perdas?',
    options: [
      { text: 'Vermelho', isCorrect: true },
      { text: 'Verde', isCorrect: false },
      { text: 'Azul', isCorrect: false },
      { text: 'Amarelo', isCorrect: false },
    ]
  },
  'Ética Visual': {
    question: 'Qual prática é considerada antiética na criação de visualizações de dados?',
    options: [
      { text: 'Cortar o eixo Y para exagerar pequenas diferenças entre valores.', isCorrect: true },
      { text: 'Utilizar cores acessíveis para daltônicos.', isCorrect: false },
      { text: 'Sempre citar a fonte dos dados no rodapé do gráfico.', isCorrect: false },
      { text: 'Remover grades excessivas para limpar o visual.', isCorrect: false },
    ]
  },
  'Do Notebook para o Slide': {
    question: 'Ao adaptar um gráfico do Jupyter Notebook para um slide, o que geralmente deve ser feito?',
    options: [
      { text: 'Aumentar o tamanho das fontes e simplificar a quantidade de informação.', isCorrect: true },
      { text: 'Manter exatamente o mesmo tamanho de fonte do notebook.', isCorrect: false },
      { text: 'Adicionar mais linhas de código ao redor do gráfico no slide.', isCorrect: false },
      { text: 'Reduzir a resolução da imagem para carregar mais rápido.', isCorrect: false },
    ]
  },
};

async function seed() {
  try {
    await client.connect();
    console.log('Connected to database.');

    const res = await client.query('SELECT id, title FROM "Classroom"');
    const classrooms = res.rows;

    for (const classroom of classrooms) {
      const quiz = quizData[classroom.title];
      if (!quiz) {
        console.log(`No quiz defined for classroom: ${classroom.title}`);
        continue;
      }

      console.log(`Creating question for: ${classroom.title}`);
      const qRes = await client.query(
        'INSERT INTO "Question" (id, statement, "classroomId") VALUES ($1, $2, $3) RETURNING id',
        [require('crypto').randomUUID(), quiz.question, classroom.id]
      );
      const questionId = qRes.rows[0].id;

      for (const opt of quiz.options) {
        await client.query(
          'INSERT INTO "Option" (id, option, "isCorrect", "questionId") VALUES ($1, $2, $3, $4)',
          [require('crypto').randomUUID(), opt.text, opt.isCorrect, questionId]
        );
      }
      console.log(`- Successfully added question and ${quiz.options.length} options.`);
    }
    console.log('Quiz seeding completed successfully!');
  } catch (e) {
    console.error('Error seeding quizzes:', e);
  } finally {
    await client.end();
  }
}

seed();

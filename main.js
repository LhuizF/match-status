google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  const values = [10, 13, -5, 10, 13, 16, 19, 22, 22, -5, -5, -5, 10, 13, 16, -5, 10, -5, 10, -5, 10];

  const data = new google.visualization.DataTable();
  data.addColumn('number', 'Index');
  data.addColumn('number', 'Valor');

  const initialPoints = 420

  const totalPoints = values.reduce((acc, valor) => acc + valor, 0) + initialPoints;

  const dataArray = values.reduce(
    (acc, valor, index) => {
      const lastValor = acc[acc.length - 1][1];
      return [...acc, [index + 1, lastValor + valor]];
    },
    [[0, initialPoints]]
  );

  data.addRows(dataArray);

  const options = {
    title: `Prontos atuais: ${totalPoints}`,
    titleTextStyle: { color: '#FFFFFF' },
    legend: { position: 'bottom', textStyle: { color: '#FFFFFF' } },
    hAxis: {
      title: 'Jogos',
      titleTextStyle: { color: '#FFFFFF' },
      textStyle: { color: '#FFFFFF' }
    },
    vAxis: {
      title: 'Pontos',
      titleTextStyle: { color: '#FFFFFF' },
      textStyle: { color: '#FFFFFF' }
    },
    backgroundColor: '#1e1e1e',
    colors: ['#00BCD4'],
  };

  const chart = new google.visualization.LineChart(document.getElementById('line_chart'));
  chart.draw(data, options);


  calcularResultados(values);
}


function calcularResultados(games) {
  const wins = games.filter(valor => valor > 0).length;
  const losses = games.filter(valor => valor < 0).length;
  const winPercentage = games.length > 0 ? (wins / games.length) * 100 : 0;

  const statsDiv = document.getElementById('status');

  if (statsDiv) {
    statsDiv.innerHTML = `
      <p>Total de Jogos: ${games.length}</p>
      <p>Vitórias: ${wins}</p>
      <p>Derrotas: ${losses}</p>
      <p>Porcentagem de Vitórias: ${winPercentage.toFixed(1)}%</p>
    `;
  }
}

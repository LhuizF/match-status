google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);


const API_KEY = '';
const BIN_ID = '6825ea698a456b79669e4865';

const getMatch = async () => {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });

    const json = await response.json();
    const currentData = json.record;

    return currentData.match
  }
  catch (error) {
    console.error('Error fetching data:', error);

    return [];
  }
}

async function drawChart() {
  addLoading();
  const match = await getMatch();

  if (!match || match.length === 0) {
    removeLoading();
    return;
  }

  const [initialPoints, ...values] = match.map(item => item.points);

  const data = new google.visualization.DataTable();
  data.addColumn('number', 'Index');
  data.addColumn('number', 'Pontos');

  const totalPoints = values.reduce((acc, value) => acc + value, initialPoints);

  const dataArray = values.reduce(
    (acc, value, index) => {
      const lastValue = acc[acc.length - 1][1];
      return [...acc, [index + 1, lastValue + value]];
    },
    [[0, initialPoints]]
  );

  data.addRows(dataArray);

  const minYView = Math.floor(initialPoints / 50) * 50;
  const maxYView = Math.ceil(totalPoints / 50) * 50;

  const options = {
    title: `Prontos atuais: ${totalPoints}`,
    titleTextStyle: { color: '#FFFFFF' },
    legend: { position: 'bottom', textStyle: { color: '#FFFFFF' } },
    hAxis: {
      title: 'Jogos',
      titleTextStyle: { color: '#FFFFFF' },
      textStyle: { color: '#FFFFFF' },
    },
    vAxis: {
      title: 'Pontos',
      titleTextStyle: { color: '#FFFFFF' },
      textStyle: { color: '#FFFFFF' },
      viewWindow: {
        min: minYView,
        max: maxYView,
      }
    },
    backgroundColor: '#1e1e1e',
    colors: ['#00BCD4'],
  };

  const chart = new google.visualization.LineChart(document.getElementById('line_chart'));
  chart.draw(data, options);

  getResults(values, match[match.length - 1].playerName);
  removeLoading();
}


function getResults(games, lastPlayer = '') {
  const wins = games.filter(valor => valor > 0).length;
  const losses = games.filter(valor => valor < 0).length;
  const winPercentage = games.length > 0 ? (wins / games.length) * 100 : 0;

  const statusDiv = document.getElementById('status');

  if (statusDiv) {
    statusDiv.innerHTML = `
      <p>Total de Jogos: ${games.length}</p>
      <p>Vitórias: ${wins}</p>
      <p>Derrotas: ${losses}</p>
      <p>Porcentagem de Vitórias: ${winPercentage.toFixed(1)}%</p>
      <p>Último Jogador: ${lastPlayer}</p>
    `;
  }
}

async function addMatchValue() {
  addLoading();
  const data = getInputValues();
  if (!data) return;

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });

    const json = await response.json();
    const currentData = json.record;

    const updatedMatches = [...currentData.match, data];

    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify({ match: updatedMatches })
    });
    drawChart();
    clearInput();
    console.log('Value successfully added!');
  } catch (error) {
    console.error('Error updating the bin:', error);
  } finally {
    removeLoading();
  }
}

const button = document.getElementById('save');

if (button) {
  button.addEventListener('click', addMatchValue);
}

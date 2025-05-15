function addLoading() {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-overlay';
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = 0;
  loadingDiv.style.left = 0;
  loadingDiv.style.width = '100vw';
  loadingDiv.style.height = '100vh';
  loadingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  loadingDiv.style.display = 'flex';
  loadingDiv.style.alignItems = 'center';
  loadingDiv.style.justifyContent = 'center';
  loadingDiv.style.zIndex = 9999;
  loadingDiv.innerHTML = `<div class="spinner"></div>`;

  const style = document.createElement('style');
  style.textContent = `
    .spinner {
      border: 6px solid #ccc;
      border-top: 6px solid #00BCD4;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(loadingDiv);
}

function removeLoading() {
  const loadingDiv = document.getElementById('loading-overlay');
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

function clearInput() {
  const inputPlayerName = document.getElementById('playerName');
  const inputPoints = document.getElementById('points');
  inputPlayerName.style.border = 'none';
  inputPoints.style.border = 'none';
  inputPlayerName.value = '';
  inputPoints.value = '';
}

const getInputValues = () => {
  const inputPlayerName = document.getElementById('playerName');
  const inputPoints = document.getElementById('points');

  const playerName = inputPlayerName.value;
  const points = inputPoints.value;

  if (!playerName) {
    inputPlayerName.style.border = '2px solid red';
    return;
  }

  if (!points) {
    inputPoints.style.border = '2px solid red';
    return;
  }

  return { playerName, points: Number(points) };
}

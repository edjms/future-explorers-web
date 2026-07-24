const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Future Explorers",
    autoHideMenuBar: true, // Oculta la barra de menú superior si no la necesitas
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Apunta a tu index.html dentro de la carpeta dist recién creada
  win.loadFile(path.join(__dirname, 'dist/future-explorers-web/browser/index.html'));

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

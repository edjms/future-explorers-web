const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let win;

// 1. Definir la carpeta donde se guardarán las fotos en Windows
// Ruta final: C:\Users\NombreUsuario\Pictures\FutureExplorers_Fotos
const RUTA_FOTOS = path.join(app.getPath('pictures'), 'FutureExplorers_Fotos');

function crearCarpetaFotos() {
  if (!fs.existsSync(RUTA_FOTOS)) {
    fs.mkdirSync(RUTA_FOTOS, { recursive: true });
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Future Explorers",
    autoHideMenuBar: true,
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

// 2. Cuando Electron esté listo, configuramos el protocolo de imágenes y la ventana
app.on('ready', () => {
  // Aseguramos que la carpeta de fotos exista
  crearCarpetaFotos();

  // Permitir que Angular cargue imágenes locales usando "local-file://"
  protocol.registerFileProtocol('local-file', (request, callback) => {
    const url = request.url.replace('local-file://', '');
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      console.error('Error al cargar la imagen local:', error);
    }
  });

  createWindow();
});

// 3. Responder a Angular si nos pregunta por la ruta de fotos
ipcMain.handle('get-photos-path', () => {
  return RUTA_FOTOS;
});

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

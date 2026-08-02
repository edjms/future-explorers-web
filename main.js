const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let win;

// --- 1. CONFIGURACIÓN EXTERNA (config.json) ---
// Busca el config.json junto al ejecutable o en la raíz si es desarrollo
const configPath = app.isPackaged 
  ? path.join(process.resourcesPath, 'config.json')
  : path.join(__dirname, 'config.json');

// Valores por defecto
let appConfig = {
  apiUrl: 'http://localhost:8080/api',
  urlPictures: '/fotos-alumnos/'
};

// Cargar config.json si existe
try {
  if (fs.existsSync(configPath)) {
    const rawData = fs.readFileSync(configPath, 'utf8');
    appConfig = JSON.parse(rawData);
  }
} catch (error) {
  console.error('Error al leer config.json:', error);
}

// Ruta final de guardado de fotos en Windows (Pictures/FutureExplorers_Fotos)
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

// --- 2. EVENTOS DE ELECTRON ---
app.on('ready', () => {
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

// --- 3. RESPUESTAS IPC PARA ANGULAR ---

// Enviar la ruta física de guardado (Pictures/FutureExplorers_Fotos)
ipcMain.handle('get-photos-path', () => {
  return RUTA_FOTOS;
});

// Enviar la URL de la API (desde config.json)
ipcMain.handle('get-api-url', () => {
  return appConfig.apiUrl;
});

// Enviar la ruta/prefijo de las imágenes (desde config.json)
ipcMain.handle('get-url-pictures', () => {
  return appConfig.urlPictures;
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
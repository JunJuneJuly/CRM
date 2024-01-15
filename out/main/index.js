"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "../../resources/icon.png");
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // titleBarStyle:'hidden',
    frame: false,
    //无边框窗口
    // resizable:false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  electron.ipcMain.handle("window-resize", () => {
    mainWindow.setSize(1200, 720);
    mainWindow.setMinimumSize(1e3, 500);
    mainWindow.center();
    mainWindow.setResizable(true);
  });
  electron.ipcMain.handle("custom-adsorption", (event, res) => {
    let x = res.appX;
    let y = res.appY;
    mainWindow.setPosition(x, y);
  });
  electron.ipcMain.handle("closeWindow", () => {
    mainWindow.close();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  electron.ipcMain.handle("out-login", () => {
    mainWindow.setSize(900, 670);
    mainWindow.center();
    mainWindow.setResizable(false);
  });
  electron.ipcMain.handle("win-close", () => {
    electron.app.exit();
  });
  electron.ipcMain.handle("win-min", () => {
    mainWindow.minimize();
  });
  electron.ipcMain.handle("win-max", () => {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    } else {
      mainWindow.setFullScreen(true);
    }
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  mainWindow.webContents.openDevTools();
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.commandLine.appendSwitch("high-dpi-support", 1);
electron.app.commandLine.appendSwitch("force-device-scale-factor", 1);

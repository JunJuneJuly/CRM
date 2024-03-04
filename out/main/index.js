"use strict";
const electron = require("electron");
const utils = require("@electron-toolkit/utils");
const path = require("path");
const icon = path.join(__dirname, "../../resources/icon.png");
class MainFrame {
  #frame = null;
  #width = 900;
  #height = 670;
  create() {
    this.#frame = new electron.BrowserWindow({
      width: this.#width,
      height: this.#height,
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
    this.#frame.on("ready-to-show", () => {
      this.#frame.show();
    });
    this.#frame.webContents.setWindowOpenHandler((details) => {
      electron.shell.openExternal(details.url);
      return { action: "deny" };
    });
    if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      this.#frame.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
      this.#frame.loadFile(path.join(__dirname, "../renderer/index.html"));
    }
    this.#frame.webContents.openDevTools();
  }
  //隐藏窗口
  hide() {
    this.#frame.hide();
  }
  //设置窗口大小
  setSize(w, h) {
    this.#frame.setSize(w, h);
  }
  //设置窗口最小值
  setMinimumSize(w, h) {
    this.#frame.setMinimumSize(w, h);
  }
  //窗口居中
  center() {
    this.#frame.center();
  }
  //窗口是否可以改变
  setResizable(bool) {
    this.#frame.setResizable(bool);
  }
  //接收窗口拖拽事件：
  setPosition(x, y) {
    this.#frame.setPosition(x, y);
  }
  //窗口关闭
  close() {
    this.#frame.close();
  }
  //最小化
  minimize() {
    this.#frame.minimize();
  }
  //判断是否最大化
  isFullScreen() {
    return this.#frame.isFullScreen();
  }
  //放大 & 缩小
  serFullScreen(bool) {
    this.#frame.setFullScreen(bool);
  }
}
class EventRoute {
  constructor(name, callback) {
    this.name = name;
    this.callback = callback;
  }
}
const routers = new Array();
routers.push(new EventRoute("close-login", (api, data) => {
  api.mainWindow.close();
}));
routers.push(new EventRoute("custom-adsorption", (api, { data }) => {
  let x = data.appX;
  let y = data.appY;
  api.mainWindow.setPosition(x, y);
}));
routers.push(new EventRoute("min-win", (api, data) => {
  api.mainWindow.minimize();
}));
routers.push(new EventRoute("max-win", (api, data) => {
  if (api.mainWindow.isFullScreen()) {
    api.mainWindow.setFullScreen(false);
  } else {
    api.mainWindow.setFullScreen(true);
  }
}));
routers.push(new EventRoute("win-close", (api, data) => {
  api.app.exit();
}));
routers.push(new EventRoute("out-login", (api, data) => {
  api.mainWindow.setSize(900, 670);
  api.mainWindow.center();
  api.mainWindow.setResizable(false);
}));
routers.push(new EventRoute("resize-window", (api, data) => {
  api.mainWindow.setSize(1200, 720);
  api.mainWindow.setMinimumSize(1e3, 500);
  api.mainWindow.center();
  api.mainWindow.setResizable(true);
}));
class EventRouter {
  constructor() {
    this.#api = {};
    this.routers = new Array();
  }
  #api;
  //添加api
  addApi(key, api) {
    this.#api[key] = api;
  }
  //添加多个路由
  addRouters(routers2) {
    this.routers = this.routers.concat(routers2);
  }
  //触发指定名称的路由回调
  router(data) {
    for (let i = 0; i < this.routers.length; i++) {
      let r = this.routers[i];
      console.log(this.routers);
      if (r.name == data.name && r.callback) {
        console.log(this.#api, "api");
        r.callback(this.#api, data);
      }
    }
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  let eventRouter = new EventRouter();
  let mainWindow = new MainFrame();
  mainWindow.create();
  eventRouter.addApi("mainWindow", mainWindow);
  eventRouter.addApi("app", electron.app);
  eventRouter.addRouters(routers);
  electron.ipcMain.handle("renderer-to-main", (e, data) => {
    eventRouter.router(data);
  });
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

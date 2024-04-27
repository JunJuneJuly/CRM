import { shell, BrowserWindow } from 'electron'
import { join } from 'path'
import icon from '../../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
export default class MainFrame{
  #frame:any = null;
  #width = 900;
  #height = 670;
  create(){
    this.#frame = new BrowserWindow({
      width: this.#width,
      height: this.#height,
      show: false,
      // titleBarStyle:'hidden',
      frame: false,//无边框窗口
      resizable:false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })
    this.#frame.on('ready-to-show', () => {
      this.#frame.show()
    })
    this.#frame.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.#frame.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.#frame.loadFile(join(__dirname, '../renderer/index.html'))
    }
    this.#frame.webContents.openDevTools() // 打开调试工具
  }
  //隐藏窗口
  hide(){
    this.#frame.hide();
  }
  //设置窗口大小
  setSize(w,h){
    this.#frame.setSize(w,h);//设置窗口大小
  }
  //设置窗口最小值
  setMinimumSize(w,h){
    this.#frame.setMinimumSize(w,h);//设置
  }
  //窗口居中
  center(){
    this.#frame.center();//窗口居中
  }
  //窗口是否可以改变
  setResizable(bool){
    this.#frame.setResizable(bool);//窗口可调节大小
  }
  //接收窗口拖拽事件：
  setPosition(x,y){
    this.#frame.setPosition(x,y)
  }
  //窗口关闭
  close(){
    this.#frame.close();
  }
  //最小化
  minimize(){
    this.#frame.minimize();
  }
  //判断是否最大化
  isFullScreen(){
    return this.#frame.isFullScreen();
  }
  //放大 & 缩小
  setFullScreen(bool){
    this.#frame.setFullScreen(bool);
  }
} 
import EventRoute from "./EventRoute";
const routers = new Array();

//关闭软件
routers.push(new EventRoute("close-login", (api,data) => {
  api.mainWindow.close();
}));
//拖拽窗口
routers.push(new EventRoute("custom-adsorption", (api,{data}) => {
  let x = data.appX;
  let y = data.appY;
  api.mainWindow.setPosition(x,y);
}))
//最小化
routers.push(new EventRoute("min-win", (api,data) => {
  api.mainWindow.minimize();
}))
//最大化
routers.push(new EventRoute("max-win", (api,data) => {
  console.log(api.mainWindow,'api')
  if(api.mainWindow.isFullScreen()){
    api.mainWindow.setFullScreen(false);
  }else{
    api.mainWindow.setFullScreen(true);
  }
}))
//退出软件
routers.push(new EventRoute("win-close", (api,data) => {
  api.app.exit();
}))
//退出登陆
routers.push(new EventRoute("out-login", (api,data) => {
  api.mainWindow.setSize(900,670);
  api.mainWindow.center();
  api.mainWindow.setResizable(false);
}))
//进入后台管理系统首页
routers.push(new EventRoute("resize-window", (api,data) => {
  api.mainWindow.setSize(1200,720);
  api.mainWindow.setMinimumSize(1000,500)
  api.mainWindow.center();
  api.mainWindow.setResizable(true);
}))
export default routers;
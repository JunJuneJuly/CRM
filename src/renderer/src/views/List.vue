<template>
    <div class='list' @mousedown="mousedown" :style="{ '--hover-color': hoverColor }">
        <div class="icon">
            <span @click="close" :class="isKiosk?'off':''">关闭</span>
            <span @click="kiosk">加锁/解锁</span>
        </div>
        这是list页面
    </div>
</template>


<script setup>
import { ref } from 'vue'

let isKiosk = ref(false);
let hoverColor = ref('rgba(0,0,0,.5)');

const kiosk = ()=>{
    isKiosk.value = !isKiosk.value;
    if( isKiosk.value  ){
        hoverColor.value = '';
    }else{
        hoverColor.value = 'rgba(0,0,0,.5)';
    }

    electron.ipcRenderer.invoke('kiosk-list',{
        isKiosk:isKiosk.value 
    })
}

const close = ()=>{
    electron.ipcRenderer.invoke('close-list')
}

let isKeyDown = ref(false);
let dinatesX = ref(0);
let dinatesY = ref(0);

const mousedown = ( e )=>{
  isKeyDown.value = true;
  dinatesX.value = e.x;
  dinatesY.value = e.y;

  document.onmousemove = (ev) => {
      if(isKeyDown.value){
        const x = ev.screenX - dinatesX.value;
        const y = ev.screenY - dinatesY.value;
        //给主进程传入坐标
        let data = {
            appX:x,
            appY:y
        }
        electron.ipcRenderer.invoke('custom-list',data);

      }
  };
  document.onmouseup = (ev) => {
      isKeyDown.value = false
  };
  
}
</script>

<style scoped>
.list{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left:0;
    right: 0;
    bottom:0;
    top:0;
    color:#fff;
    letter-spacing: 2px;
    font-size: 20px;
}
.list:hover { background-color: var(--hover-color); }
.icon{
    position: absolute;
    left:0;
    top:0;
}
.icon span{
    margin-right: 10px;
}
.off{
    visibility: hidden;
}
</style>
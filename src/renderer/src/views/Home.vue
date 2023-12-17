<template>
    <div>
        <header @mousedown="mousedown"></header>
        <div class="home">
            内容
            <button @click="newList">歌词</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
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
        electron.ipcRenderer.invoke('custom-adsorption',data);

      }
  };
  document.onmouseup = (ev) => {
      isKeyDown.value = false
  };
  
}

const newList = ()=>{
    electron.ipcRenderer.invoke('new-list');
}
</script>

<style scoped>
header{
  width: 100%;
  height: 50px;
  overflow: hidden;
  background: orange;
}
.home{
    background: red;
}
</style>
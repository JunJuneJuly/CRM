import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export default function useWindowDrag(): {
  dragging: Ref<boolean>,
  handleMouseDown: (event: MouseEvent) => void,
} {
  const dragging = ref(false);
  const mouseX = ref(0);
  const mouseY = ref(0);

  const handleMouseDown = (event) => {
    dragging.value = true;
    mouseX.value = event.x;
    mouseY.value = event.y;
    const onMouseMove = (event) => {
      if (dragging.value) {
        let x = event.screenX - mouseX.value;
        let y = event.screenY - mouseY.value;
        let data = {
          appX: x,
          appY: y
        }
        window.electron.ipcRenderer.invoke('renderer-to-main', {
          name: 'custom-adsorption',
          data
        })
      }
    }
    const onMouseUp = ():void => {
      dragging.value = true;
      document.removeEventListener('mousemove', onMouseMove as EventListener);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',onMouseUp);
    onUnmounted(()=>{
      document.removeEventListener('mousemove',onMouseMove as EventListener);
      document.removeEventListener('mouseup',onMouseUp as EventListener)
    })
  }
  return {
    dragging,
    handleMouseDown,
  }
}


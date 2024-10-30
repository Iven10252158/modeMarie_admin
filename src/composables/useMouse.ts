// 有狀態邏輯
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCutImage } from '@/store/useCutImageStore'
const { runONNX, maskImg } = useOnnxModel()
const { handleCutImageStatus, handleMask64ToMaskFile } = useCutImage()
const { isMouseDown } = storeToRefs(useCutImage())

const targetElement = ref()
// 計算位移的座標
const mousePosition = ref({ x1: 0, y1: 0, x2: 0, y2: 0 })
// 結束座標
const absolutePosition = ref({ x: 0, y: 0 })
// 計算box的寬/高
const box = ref({ width: 0, height: 0 })

const clicks = ref()
const difference = (a:number, b:number) => Math.abs(a - b)
const uploadImage = ref()
const photoFrame = ref()

export const useMouseEvent = () => {
  const getClick = (x1:number, y1:number, x2:number, y2:number) => {
    if (x1 > x2) {
      const tempX1 = x1
      const tempY1 = y1
      y1 = y2
      x1 = x2
      x2 = tempX1
      y2 = tempY1
    }

    if (x1 < x2 && y1 > y2) {
      const tempY1 = y1
      const tempY2 = y2
      y1 = tempY2
      y2 = tempY1
    }
    return { x1, y1, x2, y2 }
  }

  const target = ref()
  const getImageRef = (image:HTMLCanvasElement, frame:HTMLElement) => {
    photoFrame.value = frame
    uploadImage.value = image
  }
  const handleImage = () => {
    if (targetElement.value) {
      const rect = targetElement.value.getBoundingClientRect() // 取得元素的大小及相對於視窗的位置
      target.value = rect
      let x1 = mousePosition.value.x1 - rect.left
      let y1 = mousePosition.value.y1 - rect.top
      let x2 = mousePosition.value.x2 - rect.left
      let y2 = mousePosition.value.y2 - rect.top

      const imageScale = uploadImage.value ? uploadImage.value.width / targetElement.value.offsetWidth : 1

      x1 *= imageScale
      y1 *= imageScale
      x2 *= imageScale
      y2 *= imageScale
      clicks.value = getClick(x1, y1, x2, y2)
    }
  }

  const handleMouseDown = (event:MouseEvent) => {
    absolutePosition.value.x = 0
    absolutePosition.value.y = 0
    maskImg.value = null
    handleCutImageStatus(true)
    mousePosition.value.x1 = event.clientX
    mousePosition.value.y1 = event.clientY
    targetElement.value = event.target

    handleImage()
  }
  const handleMouseUp = (event:MouseEvent) => {
    if (maskImg.value) {
      handleMask64ToMaskFile(maskImg.value.src)
    }
    handleCutImageStatus(false)
    mousePosition.value.x2 = event.clientX
    mousePosition.value.y2 = event.clientY
    handleImage()
    runONNX(clicks.value)
  }
  const handleMouseMove = (event: MouseEvent) => {
    if (!isMouseDown.value) return

    // 記錄起始點的x,y座標
    const { x1: originX, y1: originY } = mousePosition.value

    // 計算box長寬的絕對值
    box.value.width = difference(event.clientX, originX)
    box.value.height = difference(event.clientY, originY)
    mousePosition.value.x2 = event.clientX
    mousePosition.value.y2 = event.clientY

    handleImage()
    runONNX(clicks.value)

    const updatePosition = (x:number, y:number) => {
      return {
        x: (x - (target.value.left ?? 0)) - difference(event.clientX, originX),
        y: (y - (target.value.top ?? 0)) - difference(event.clientY, originY)
      }
    }

    if (event.clientX > originX && event.clientY > originY) {
      absolutePosition.value = updatePosition(event.clientX, event.clientY)
      return
    }
    if (event.clientX > originX) {
      absolutePosition.value = updatePosition(event.clientX, originY)
      return
    }
    if (event.clientY > originY) {
      absolutePosition.value = updatePosition(originX, event.clientY)
      return
    }
    if (event.clientX < originX && event.clientY < originY) {
      absolutePosition.value = updatePosition(originX, originY)
    }
  }
  return { getImageRef, handleMouseDown, handleMouseUp, handleMouseMove, box, absolutePosition, clicks }
}

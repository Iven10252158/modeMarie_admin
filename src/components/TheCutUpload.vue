<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useCutImage } from '@/store/useCutImageStore'
// import { InferenceSession } from 'onnxruntime-web'
import { useImageFormatter } from '@/composables/imageProcessor/useImageFormatter'
import * as ort from 'onnxruntime-web'

ort.env.wasm.wasmPaths = {
  'ort-wasm.wasm': '/public/wasms/ort-wasm.wasm',
  'ort-wasm-simd.wasm': '/public/wasms/ort-wasm-simd.wasm',
  'ort-wasm-threaded.wasm': '/public/wasms/ort-wasm-threaded.wasm'
  // Add other WASM files as needed
}
interface Props {
  currentImage?: string
}
interface Emits {
  (event:'imageFile', file:File|null):void,
  (event: 'imageSrc', image: string): void,
  (event: 'getNpyModel', isGet: boolean): void,
  (event: 'uploadFail', messgae: string): void,
}

const emits = defineEmits<Emits>()
const props = defineProps<Props>()

const { handleUploadImageFile, cancelImage } = useCutImage()
const { isMouseDown } = storeToRefs(useCutImage())
const input = ref<HTMLInputElement|null>(null)
const imageRef = ref()
const canvasBox = ref<HTMLElement>()
const frameRef = ref()

const isLoading = ref<boolean>(false)
const { getImageRef, handleMouseDown, handleMouseUp, handleMouseMove, box, absolutePosition } = useMouseEvent()

const { model, tensor, modelScale, maskImg } = useOnnxModel()

const IMAGE_EMBEDDING = ref<string>('')
const modelDir = import.meta.env.VITE_APP_MODEL_DIR

const modelStatus = ref<string>('正在解析模型')

const selectFile = () => {
  input.value?.click()
}

const imageSrc = ref<string>()
const fileName = ref<string>()
const isShowCanvas = ref<boolean>(false)
const isCancel = ref<boolean>(false)
const isFileChanged = ref<boolean>(false)
const isShow = ref<boolean>(false)

const fileMaxSize = 1024 * 1024 * 3.5
// 上傳檔案
const handleFileChange = (event:Event) => {
  isCancel.value = false
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    handleUploadImageFile(file)
    if (file.size > fileMaxSize) {
      emits('uploadFail', '圖片大小不可超過 3.5MB !')
      target.value = ''
      return
    }
    fileName.value = file.name
    imageSrc.value = URL.createObjectURL(file)

    isShow.value = true
    emits('imageFile', file)
    emits('imageSrc', imageSrc.value)
    isFileChanged.value = true
    cancelImage()
    const url = new URL(imageSrc.value, location.origin)
    loadImage(url)
  }
}

const cancelFile = () => {
  cancelImage()

  maskImg.value = null
  imageSrc.value = ''
  isShowCanvas.value = false
  isLoading.value = false
  absolutePosition.value.x = 0
  absolutePosition.value.y = 0
  handleUploadImageFile(null)
  emits('imageFile', null)
  emits('imageSrc', imageSrc.value)
  emits('getNpyModel', false)
  isCancel.value = true
  isShow.value = false
}

const { blobToBase64, loadImageFromBase64 } = useImageFormatter()
const { loadNpyId, connectTimeOut, loadNpyFile, cancelConnect } = handleLoadNpyConnect()

const bodyElement = document.body
const runPodID = ref<string>('')

const updateImageProperties = (image: HTMLImageElement): void => {
  nextTick(() => {
    resizeObserver.observe(bodyElement)
    imageRef.value.width = image.width
    imageRef.value.height = image.height
    ctx.value.drawImage(image, 0, 0, image.width, image.height)
    fitToPage()
  })
}

const { notification } = useNotification()
const getNpyModelErrorMessage = ref<string>('')
const loadImage = async (url:URL) => {
  getNpyModelErrorMessage.value = ''
  isShowCanvas.value = true
  isLoading.value = true

  if (props.currentImage) {
    imageSrc.value = props.currentImage
  }

  const response = await fetch(url.href, { cache: 'no-cache' })
  const blob = await response.blob()
  const base64 = await blobToBase64(blob)
  const image = await loadImageFromBase64(base64)
  updateImageProperties(image)
  const data = await loadNpyId(base64)
  const { id } = data
  runPodID.value = id

  try {
    IMAGE_EMBEDDING.value = await loadNpyFile(runPodID)
    isShow.value = true
    isLoading.value = false
  } catch (error) {
    notification.value.error({
      content: error as string
    })
    emits('getNpyModel', false)
    getNpyModelErrorMessage.value = error as string
    return
  }

  emits('getNpyModel', true)
  const { width, height, samScale } = handleImageScale(imageRef.value as HTMLCanvasElement)
  modelScale.value = {
    height,
    width,
    samScale
  }

  getImageRef(imageRef.value, frameRef.value)
}

watch(() => [props.currentImage, isCancel.value], async (newValue) => {
  const [newCurrentImage, newCancelValue] = newValue as [string, boolean]
  if (newCancelValue) cancelConnect(newCancelValue)
  if (newCurrentImage) {
    isCancel.value = false
    const url = handleImageUrl(newCurrentImage)
    if (url) loadImage(url)
    maskImg.value = null
    imageSrc.value = ''
    emits('imageSrc', imageSrc.value)
    handleUploadImageFile(null)
    absolutePosition.value.x = 0
    absolutePosition.value.y = 0
  }
  isFileChanged.value = false
})

watchEffect(() => {
  if (!IMAGE_EMBEDDING.value) return

  Promise.resolve(loadNpyTensor(IMAGE_EMBEDDING.value, 'float32')).then(embedding => {
    tensor.value = embedding
  })
})

const fitToPage = () => {
  if (!imageRef.value) return false
  const imageAspectRatio = imageRef.value.width / imageRef.value.height

  let canvasBoxAspectRatio
  nextTick(() => {
    setTimeout(() => {
      if (canvasBox.value) {
        canvasBoxAspectRatio = canvasBox.value.clientWidth / canvasBox.value.clientHeight
        if (imageAspectRatio > canvasBoxAspectRatio) {
          shouldFitToWidth.value = true
        } else {
          shouldFitToWidth.value = false
        }
      }
    }, 500)
  })
}
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.target === bodyElement) {
      fitToPage()
    }
  }
})
const shouldFitToWidth = ref<boolean>(true)
const imageClasses = ''
const maskImageClasses = 'absolute opacity-40 pointer-events-none left-1/2 -translate-x-1/2'
const ctx = ref()
onMounted(async () => {
  isLoading.value = true
  try {
    if (modelDir === undefined) return
    const modelUrl:string = modelDir
    model.value = await ort.InferenceSession.create(modelUrl)
    isLoading.value = false
    console.log('解析完成')
    modelStatus.value = ''
    if (!model.value) return

    const url = handleImageUrl(props.currentImage || '')
    if (url) loadImage(url)
  } catch (error) {
    console.log(error)
  }
  if (imageRef.value) {
    ctx.value = imageRef.value.getContext('2d')
  }
})
</script>

<template>
  <section
    class="w-full aspect-square relative flex flex-col items-center justify-center select-none mb-3 bg-background rounded-[10px]"
  >
    <button
      v-show="isShow"
      class="w-6 h-6 absolute -top-7 -right-5"
      @click="cancelFile"
    >
      <BaseSvgIcon
        class="w-full h-full object-cover object-center text-[#62AAD7]"
        name="close"
      />
    </button>

    <div
      ref="frameRef"
      class="w-full h-full overflow-hidden relative flex flex-col items-center justify-center"
    >
      <div
        ref="canvasBox"
        class="canvasBox relative w-full h-full flex items-center justify-center"
      >
        <div
          v-if="getNpyModelErrorMessage"
          class="w-[126px] h-[115px] absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
        >
          <BaseSvgIcon
            name="close"
            class="w-5 h-5"
            src="@/assets/images/close.svg"
          />
          <p class="text-content text-lighter">
            {{ getNpyModelErrorMessage }}
          </p>
        </div>
        <div
          v-if="isLoading && !getNpyModelErrorMessage"
          class="w-[126px] h-[115px] flex flex-col items-center justify-center"
        >
          <img
            class="h-10 w-10"
            src="@/assets/images/svg-loading.svg"
          >
          <p class="text-content text-lighter">
            <!-- 圖片準備中，請稍候 -->
            {{ modelStatus ? modelStatus :'圖片準備中，請稍候' }}
          </p>
        </div>
        <button
          v-if="!isShowCanvas && !isLoading"
          class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
          @click="selectFile"
        >
          <input
            ref="input"
            type="file"
            class="hidden"
            accept="image/png"
            @change="handleFileChange"
          >
          <BaseSvgIcon
            class="w-6 h-6 text-[#9CA4AB]"
            name="upload"
          />
          <p class="text-lighter text-content">
            上傳檔案
          </p>
        </button>

        <div
          v-show="!isLoading"
          :class="`${
            shouldFitToWidth ? 'w-full' : 'h-full'
          } ${imageClasses}`"
          class="relative overflow-hidden"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
          @mousemove="handleMouseMove"
        >
          <div
            v-if="absolutePosition.x && absolutePosition.y"
            class="box pointer-events-none border border-red-400 z-[1]"
            :style="{
              width:`${box.width}px`,
              height:`${box.height}px`,
              position: 'absolute',
              top: `${absolutePosition.y}px`,
              left: `${absolutePosition.x}px`
            }"
          />
          <canvas
            v-show="isShowCanvas"
            ref="imageRef"
            :class="`${
              shouldFitToWidth ? 'w-full' : 'h-full'
            } ${imageClasses}`"
            :style="{width: `${imageRef?.width}`, height:`${imageRef?.height}`}"
            class="object-contain object-center"
          />
          <img
            v-if="maskImg && isMouseDown"
            :src="maskImg.src"
            :class="`${
              shouldFitToWidth ? 'w-full top-1/2 -translate-y-1/2' : 'h-full top-0'
            } ${maskImageClasses}`"
          >
          <div
            v-if="maskImg && !isMouseDown"
            :style="{ maskImage: `linear-gradient(black, black), url('${maskImg?.src}')` }"
            class="mask pointer-events-none w-full h-full absolute top-0 left-0 bg-black/70"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.mask {
  mask: no-repeat center;
  mask-size: cover, 100% 100%;
  mask-composite: exclude;
}
</style>

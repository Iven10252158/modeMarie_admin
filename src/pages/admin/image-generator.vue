<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useGenerator, ImageStyleList } from '@/store/useImageGeneratedStore'
import { useNotification } from '@/composables/useNotification'

const useGeneratorImage = useGenerator()

const { getGeneratedImage, setImageStylePayloadValue, setContentValue, setImageNumberPayloadValue, getImageFile, setCustomTemplate } = useGeneratorImage
const { isPending, aiImagesArray, generateImagePayload, imageFile, customTemplate, content, timer } = storeToRefs(useGeneratorImage)

const isOpen = ref<boolean>(false)
const imageStyleList = ref<ImageStyleList[]>([ImageStyleList['無'], ImageStyleList['MBE風格'], ImageStyleList['寫實風格'], ImageStyleList['插畫風格'], ImageStyleList['扁平風格'], ImageStyleList['立體風格'], ImageStyleList['肌理風格'], ImageStyleList['自訂風格']])

const chooseStyle = (styleName:ImageStyleList) => {
  isOpen.value = !isOpen.value
  setImageStylePayloadValue(styleName)
}

const getContentText = (event:Event) => {
  const target = event.target as HTMLInputElement
  setContentValue(target.value)
}

const getCustomTemplate = (event:Event) => {
  const target = event.target as HTMLInputElement
  setCustomTemplate(target.value)
}

const menuListHeight = computed(() => {
  return isOpen.value ? `${imageStyleList.value.length * 44}` : 0
})

const { isTokenExpired, setErrorStatus } = useErrorHandler()
const { notification } = useNotification()

const getUploadFileMessage = (message:string) => {
  notification.value.error({
    content: message
  })
}
const router = useRouter()
watch(() => isTokenExpired.value, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      setErrorStatus({ code: 0, message: '' })
      router.go(0)
    }, 5000)
  }
})
const isDisabledButton = computed(() => {
  if (generateImagePayload.value.style === '無') generateImagePayload.value.style = ''
  if (content.value.length < 250 && customTemplate.value.length < 1000) {
    if ((imageFile.value) || (content.value && generateImagePayload.value.style && generateImagePayload.value.style !== '自訂風格') || (content.value && generateImagePayload.value.style === '自訂風格' && customTemplate.value)) {
      return false || isPending.value
    }
  }
  return true
})

const clickHandler = () => {
  if (isOpen.value) isOpen.value = false
}
onMounted(() => {
  notification.value.isOpen = false
  document.addEventListener('click', clickHandler)
  document.addEventListener('visibilitychange', removeTabTitleFlash)
})

onUnmounted(() => {
  document.removeEventListener('click', clickHandler)
  document.removeEventListener('visibilitychange', removeTabTitleFlash)
})

const removeTabTitleFlash = () => {
  if (!document.hidden) {
    document.title = 'AI 構想助手'
    clearInterval(timer.value)
  }
}

</script>

<template>
  <section class="w-full h-full">
    <div class="w-full h-[calc(100%-40px)]">
      <div class="w-full h-full flex justify-center items-start gap-x-6 xl:gap-x-[86px] 2xl:gap-x-6">
        <div class="w-[373px] xl:w-[479px] 2xl:w-[586px] h-full flex flex-col">
          <div class="mb-3 w-full h-[128px] 2xl:h-[295px]">
            <TheUpload
              @upload-file="getImageFile"
              @upload-file-message="getUploadFileMessage"
            />
          </div>
          <div class="w-full h-10 mb-3 rounded-[10px] relative z-[1]">
            <BaseSvgIcon
              name="triangle"
              class="w-6 h-6 absolute top-1/2 -translate-y-1/2 right-3"
              @click.stop="isOpen = !isOpen"
            />
            <button
              class="w-full px-3 text-base text-lighter leading-10 bg-background rounded-[10px] text-left mb-2 outline-0"
              :class="[{'text-navy': generateImagePayload.style},{'border-2 border-[#62AAD7] shadow-[0_0px_4px_0px_rgb(98,170,215)]': isOpen}]"
              @click.stop="isOpen = !isOpen"
            >
              {{ generateImagePayload.style ? generateImagePayload.style: '選擇風格' }}
            </button>
            <ul
              :style="{height: `${menuListHeight}px`}"
              class="block w-full h-0 overflow-hidden bg-background rounded-[10px] transition-[height] duration-300 px-2"
            >
              <li
                v-for="style in imageStyleList"
                :key="style"
                class="list w-full px-3 h-10 text-base leading-10 text-lighter hover:bg-[#62AAD7] hover:text-white hover:rounded-[10px]"
                @click.stop="chooseStyle(ImageStyleList[style])"
              >
                {{ style }}
              </li>
            </ul>
          </div>
          <!-- 自訂風格 -->
          <textarea
            v-if="generateImagePayload.style === '自訂風格'"
            class="w-full grow px-3 py-2 mb-3 rounded-[10px] bg-background outline-none resize-none"
            :class="{'border border-red-400': customTemplate.length > 1000}"
            placeholder="輸入您自訂的風格"
            :value="customTemplate"
            @input="getCustomTemplate"
          />
          <p
            v-show="customTemplate.length > 1000"
            class="text-remark font-bold text-red-400 -mt-2"
          >
            {{ '自訂風格內容不可超過 1000 個字！' }}
          </p>
          <!-- 輸入您希望添加到圖片中的內容 -->
          <textarea
            class="w-full grow px-3 py-2 mb-3 rounded-[10px] bg-background outline-none resize-none"
            :class="{'border border-red-400': content.length > 250}"
            placeholder="輸入您希望添加到圖片中的內容"
            :value="content"
            @input="getContentText"
          />
          <p
            v-show="content.length > 250"
            class="text-remark font-bold text-red-400 -mt-2"
          >
            {{ '提示詞不可超過 250 個字！' }}
          </p>
          <div class="w-full">
            <header class="mb-2 text-lighter text-content">
              生成張數
            </header>
            <div class="w-full mb-9 flex flex-wrap justify-center items-center gap-2">
              <button
                v-for="item in 4"
                :key="item"
                :disabled="isDisabledButton"
                class="w-[calc(50%-4px)] bg-background rounded-[10px] focus:bg-blue-sky focus:text-white"
                :class="[generateImagePayload.numbers=== item ? 'bg-blue-sky' : 'bg-background']"
                @click="setImageNumberPayloadValue(item)"
              >
                <p
                  class="py-2"
                  :class="[generateImagePayload.numbers === item ? 'text-white': 'text-lighter']"
                >
                  {{ item }} 張
                </p>
              </button>
            </div>

            <Button
              :is-disabled="isDisabledButton"
              @click="getGeneratedImage(generateImagePayload)"
            >
              AI靈感生圖
            </Button>
            <p class="text-error text-remark text-center mt-2">
              AI圖片生成會消耗使用次數
            </p>
          </div>
        </div>
        <div class="w-[calc(100%-373px)] xl:w-[calc(100%-479px)] 2xl:w-[calc(100%-586px)] h-full overflow-y-auto flex flex-wrap content-start gap-6">
          <AIGenerateImage
            v-for="aiImage in aiImagesArray"
            :key="aiImage.image_id"
            :generated-image-data="aiImage"
            :url="aiImage.url"
            :error="aiImage.error"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  margin: 10px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #62aad7;
}

.list:first-child {
  @apply mt-2;
}
</style>

<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useCutImage } from '@/store/useCutImageStore'

const useCutter = useCutImage()
const { transferSvg, downloadSvgData, handlePopupOpen, handleShowPngUrl, handleCroppingImg, clearPngUrl } = useCutter
const { currentImage, svgData, pngUrl, pngImageFile, isOpenPopup, isShowPngUrl, isLoading, imageFile, isTransfering, isDownLoading, isMouseDown } = storeToRefs(useCutter)
const { absolutePosition } = useMouseEvent()

// currentImage: 生圖轉到切圖的圖片url
// uploadImageUrl: 上傳圖片的 url

const uploadImageUrl = ref<string>('')
const handleSrc = (url:string) => {
  uploadImageUrl.value = url
}

const uploadImageFile = ref<File|null>(null)
const handleUploadFile = (file:File|null) => {
  uploadImageFile.value = file
}

const { notification } = useNotification()
const handleUploadFail = (message:string) => {
  notification.value.error({
    content: message
  })
}

const isGetNpyModel = ref<boolean>(false)
const handleNpyModel = (isGet:boolean) => {
  isGetNpyModel.value = isGet
}

watch(() => currentImage.value, (newValue) => {
  // currentImage存在時，表示切圖的圖片是從生圖那邊過來的，所以上傳圖片的值不該存在
  if (newValue !== '') uploadImageFile.value = null
})
const svgsElementRef = ref<HTMLElement|null>(null)
const handleSvgTransfer = () => {
  // 切圖時的判斷
  if (pngUrl.value && isShowPngUrl.value) {
    transferSvg(pngImageFile.value as File)
    handlePopupOpen(false)
  }

  // 上傳圖片的全圖轉換 svg
  if (uploadImageFile.value && !isShowPngUrl.value) {
    transferSvg(uploadImageFile.value as File)
    handlePopupOpen(false)
  }
  // 生圖或歷史紀錄的整張圖轉換 svg
  if (!uploadImageFile.value && currentImage.value && !isShowPngUrl.value) {
    transferSvg(imageFile.value as File)
    handlePopupOpen(false)
  }

  nextTick(() => {
    if (svgsElementRef.value) {
      svgsElementRef.value.scrollTop = svgsElementRef.value.scrollHeight
    }
  })
}

const isPreview = ref<boolean>(false)
watchEffect(() => {
  if (!isOpenPopup.value) {
    isPreview.value = false
    isShowPngUrl.value = false
    clearPngUrl()
  }
})

const svgUrl = ref<string>('')

const previewData = (previewSvgUrl:string) => {
  handlePopupOpen(true)
  isPreview.value = true
  svgUrl.value = previewSvgUrl
}

const pictureToSvg = () => {
  handlePopupOpen(true)
  handleShowPngUrl(false)
}

const isShowModal = ref<boolean>(false)
const svgIndex = ref<number>(0)
const handleSvgDelete = (index:number) => {
  isShowModal.value = true
  svgIndex.value = index
}

const isShowCutButton = computed(() => {
  const { x, y } = absolutePosition.value
  if (x && y && !isMouseDown.value) return true
})

onMounted(() => {
  notification.value.isOpen = false
})

onActivated(() => {
  notification.value.isOpen = false
})

</script>

<template>
  <section class="w-full h-full pb-9 relative flex gap-x-6">
    <!-- 確認是否 刪除 svg 的 modal-->
    <CheckModal
      v-model:is-show-modal="isShowModal"
      :svg-index="svgIndex"
    />
    <div class="w-full h-full flex gap-6">
      <div
        class="w-[556px] h-full shrink-0 bg-background rounded-[10px] 2xl:w-[707px] relative flex flex-col items-center"
      >
        <!--  h-[calc(100%-78px)]  -->
        <div class="h-full flex flex-col justify-center">
          <div class="w-[466px] 2xl:w-[635px] aspect-square mt-3">
            <TheCutUpload
              :current-image="currentImage"
              @image-src="handleSrc"
              @image-file="handleUploadFile"
              @get-npy-model="handleNpyModel"
              @upload-fail="handleUploadFail"
            />
          </div>
          <div class="w-full flex flex-col mt-3 items-center">
            <button
              class="w-10 h-10"
              :class="[isShowCutButton ? 'visible': 'invisible']"
              @click="handleCroppingImg"
            >
              <BaseSvgIcon
                class="w-6 h-6"
                name="cut"
              />
            </button>
            <button
              v-if="isGetNpyModel && (currentImage || uploadImageUrl)"
              class="w-[88px] bg-white py-1 px-2 rounded-full"
              @click="pictureToSvg"
            >
              <p class="text-remark text-navy">
                全圖轉換SVG
              </p>
            </button>
          </div>
        </div>
      </div>
      <!-- 轉換的 svgData -->
      <div class="h-full grow flex flex-col">
        <div
          ref="svgsElementRef"
          class="svgsElementRef w-full h-full overflow-y-auto mb-6"
        >
          <div class="w-full flex flex-wrap content-start gap-2">
            <TheSvgData
              v-for="(svg, index) in svgData"
              :key="svg.history_id"
              :svg-data="svg"
              :index="index"
              @preview-svg-image="previewData"
              @delete-svg-data="handleSvgDelete"
            />
          </div>
        </div>
        <Button
          v-show="svgData.length > 0"
          :is-disabled="isTransfering || isDownLoading"
          @click="downloadSvgData"
        >
          <div class="flex justify-center">
            <img
              v-if="isDownLoading"
              src="@/assets/images/svg-loading.svg"
              class="w-6 h-6"
            >
            全部下載
          </div>
        </Button>
      </div>
    </div>
    <BasePopup
      v-model:is-open-popup="isOpenPopup"
      :is-like="false"
      :is-cut="false"
      :is-download="false"
      :is-show-close="false"
    >
      <button
        v-if="isPreview"
        class="w-6 h-6 absolute rounded-full top-4 right-4"
        @click="handlePopupOpen(false)"
      >
        <BaseSvgIcon
          class="w-6 h-6 text-white"
          name="close"
        />
      </button>
      <div
        class="bg-white relative"
        :class="[ isPreview ? 'w-[624px] h-[624px]' : 'w-[580px] h-[550px]']"
      >
        <button
          v-if="!isPreview"
          class="w-6 h-6 absolute rounded-full top-4 right-4"
          @click="handlePopupOpen(false)"
        >
          <BaseSvgIcon
            class="w-6 h-6"
            name="close"
          />
        </button>
        <div
          v-if="!isPreview"
          class="w-full h-full px-10 pt-4 pb-6"
        >
          <div class="w-full h-full">
            <div class="w-full h-[395px] my-6 relative">
              <img
                v-if="(uploadImageUrl || currentImage) && !isShowPngUrl"
                class="aaa w-full h-full object-center object-contain"
                :src="uploadImageUrl || currentImage"
              >
              <img
                v-if="pngUrl && isShowPngUrl"
                class="pngUrl w-full h-full object-contain object-center"
                :src="pngUrl"
              >
              <img
                v-if="isLoading"
                class="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                src="@/assets/images/svg-loading.svg"
              >
            </div>
            <Button
              :is-disabled="isLoading"
              @click="handleSvgTransfer"
            >
              轉換成SVG
            </Button>
            <p class="text-center text-error text-remark">
              轉換SVG會消耗使用次數
            </p>
          </div>
        </div>
        <div
          v-else
          class="w-full h-full"
        >
          <img
            class="w-full h-full object-contain object-center"
            :src="svgUrl"
          >
        </div>
      </div>
    </BasePopup>
  </section>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #62aad7;
}
</style>

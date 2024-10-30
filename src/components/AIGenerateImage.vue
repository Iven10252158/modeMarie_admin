<script setup lang='ts'>
import type { AiImage } from '@/store/useImageGeneratedStore'
const { errorMessage } = useErrorHandler()

interface Props {
  url: string|null,
  generatedImageData: AiImage,
  error?: string|null
}

const image = ref<HTMLImageElement|null>(null)
const props = defineProps<Props>()
const isOpenPopup = ref<boolean>(false)
const imageUrl = ref<string>('')
const imageId = ref<number>(0)
const handlePopup = (data: AiImage) => {
  isOpenPopup.value = true
  imageUrl.value = data.url as string
  imageId.value = data.image_id
  // console.log(imageId.value)
}

</script>

<template>
  <div class="aspect-square w-[calc(50%-12px)]">
    <div
      v-if="props.url"
      class="cursor-pointer w-full h-full relative hover-style"
      @click.stop="handlePopup(props.generatedImageData)"
    >
      <img
        :src="props.url"
        class="object-cover object-center w-full h-full"
      >
    </div>
    <template v-if="props.error || errorMessage">
      <div
        class="relative aspect-square rounded-[10px] w-full bg-background"
      >
        <div class="w-full h-full flex flex-col items-center justify-center">
          <BaseSvgIcon
            name="close"
            class="w-5 h-5"
            src="@/assets/images/close.svg"
          />
          <p class="text-content text-lighter px-2">
            {{ props.error || errorMessage }}
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-if="!props.url"
        class="relative aspect-square rounded-[10px] w-full bg-background"
      >
        <div class="w-full h-full flex flex-col items-center justify-center">
          <img
            class="w-[59px] h-[59px]"
            src="@/assets/images/svg-loading.svg"
          >
          <p class="text-content text-lighter">
            圖片生成中
          </p>
        </div>
      </div>
    </template>
  </div>

  <BasePopup
    v-model:is-open-popup="isOpenPopup"
    :is-like="true"
    :is-cut="true"
    :is-download="true"
    :is-show-close="true"
    :image-url="imageUrl"
    :image-data="props.generatedImageData"
  >
    <div class="w-[624px]">
      <img
        ref="image"
        class="aspect-square w-full object-cover object-center"
        :src="imageUrl"
      >
    </div>
  </BasePopup>
</template>

<style scoped>
.hover-style::before,
.hover-style::after {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  opacity: 0; /* 預設透明度為 0 */
  transition: opacity 0.3s ease; /* 控制淡入淡出效果 */
  content: ""; /* 確保偽元素總是有內容，即使是空的 */
}

.hover-style::before {
  height: 100%;
  color: white;
  background-color: rgb(0 0 0 / 60%);
}

.hover-style::after {
  top: 55%;
  font-size: 14px;
  color: white;
}

/* 當 hover 時，改變透明度為 1 */
.hover-style:hover::before {
  opacity: 1;
  content: url("@/assets/icons/eye_white.svg");
}

.hover-style:hover::after {
  opacity: 1;
  content: "預覽";
}

</style>

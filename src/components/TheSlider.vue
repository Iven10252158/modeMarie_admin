<script setup lang='ts'>
import type { ImageData } from '@/store/useHistoryStore'
import { useHistoryStore } from '@/store/useHistoryStore'
const { setHistoryImageStatus } = useHistoryStore()
interface Props {
  slideImage: ImageData[],
  clickedIndex: number,
}
interface Emits {
  (event: 'updateIndex', index:number, type:string): void,
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const currentIdx = ref(0)

onMounted(() => {
  currentIdx.value = props.clickedIndex
  emits('updateIndex', currentIdx.value, props.slideImage[currentIdx.value].type)
  setHistoryImageStatus(props.slideImage[currentIdx.value])
})
const nextImage = () => {
  currentIdx.value++
  emits('updateIndex', currentIdx.value, props.slideImage[currentIdx.value].type)
  setHistoryImageStatus(props.slideImage[currentIdx.value])
}

const prevImage = () => {
  currentIdx.value--
  emits('updateIndex', currentIdx.value, props.slideImage[currentIdx.value].type)
  setHistoryImageStatus(props.slideImage[currentIdx.value])
}

const isLoadingImage = ref<boolean>(false)
watch(() => props.slideImage[currentIdx.value].url, () => {
  isLoadingImage.value = true
})

const checkLoadImage = () => {
  isLoadingImage.value = false
}
</script>

<template>
  <div class="w-[674px] h-[392px] xl:w-[886px] xl:h-[528px] 2xl:w-[1100px] 2xl:h-[664px] text-white flex items-center justify-center gap-6 -mt-10">
    <div class="h-[392px] xl:h-[528px] 2xl:h-[664px] aspect-square relative">
      <img
        v-if="isLoadingImage"
        class="block w-12 h-12 aspect-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        src="@/assets/images/svg-loading.svg"
      >
      <img
        :src="props.slideImage[currentIdx].url"
        class="w-full h-full select-none ascept-square object-contain object-center transition-opacity duration-200 ease-linear"
        :class="[!isLoadingImage ? 'opacity-100': 'opacity-0']"
        @load="checkLoadImage"
      >
    </div>
    <transition>
      <div
        v-if="props.slideImage[currentIdx].type === 'AI 生圖'"
        class="w-full h-full overflow-y-auto break-all"
      >
        <h4 class="text-white text-content">
          預設風格：{{ props.slideImage[currentIdx].style }}
        </h4>
        <h4
          v-if="props.slideImage[currentIdx].style === '自訂風格'"
          class="text-white text-content"
        >
          風格描述：{{ props.slideImage[currentIdx].custom_template }}
        </h4>
        <h4 class="text-white text-content h-[80px] overflow-y-auto">
          提示詞：{{ props.slideImage[currentIdx].prompt }}
        </h4>
      </div>
    </transition>
  </div>

  <div
    class="w-full h-7 absolute top-1/2 -translate-y-1/2 flex items-center justify-between"
  >
    <button
      class="w-7 h-7 2xl:w-9 2xl:h-9 absolute left-12 xl:left-[61px] 2xl:left-[82px]"
      @click="prevImage"
    >
      <BaseSvgIcon
        v-if="currentIdx"
        class="w-full h-full text-white"
        name="arrow"
      />
      <br>
    </button>
    <button
      class="w-7 h-7 2xl:w-9 2xl:h-9 text-white absolute right-12 xl:right-[61px] 2xl:right-[82px]"
      @click="nextImage"
    >
      <BaseSvgIcon
        v-if="currentIdx < props.slideImage.length -1"
        class="w-full h-full text-white rotate-180"
        name="arrow"
      />
    </button>
  </div>
</template>
<style scoped>
::-webkit-scrollbar {
  width: 0;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #62aad7;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s linear;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>

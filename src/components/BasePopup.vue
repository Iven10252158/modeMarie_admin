<script setup lang='ts'>
import type { ImageData } from '@/store/useHistoryStore'

interface Props {
  isOpenPopup: boolean,
  isCut: boolean,
  isDownload: boolean,
  isShowClose: boolean,
  isLike:boolean,
  imageUrl?: string,
  imageData?: ImageData,
  currentImageType?: string
}

interface Emits {
  (event: 'update:isOpenPopup', isOpen:boolean): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

</script>

<template>
  <transition>
    <section
      v-if="props.isOpenPopup"
      class="w-screen h-screen px-4 fixed top-0 left-0 bg-black/90 z-50"
      @click.self="emits('update:isOpenPopup', false)"
    >
      <div class="w-full flex justify-end gap-3">
        <TheLikeBtn
          v-if="props.isLike"
          :id="props.imageData?.image_id"
          :is-great="props.imageData?.is_great_effect"
        />
        <TheCutBtn
          v-if="props.isCut"
          v-show="props.currentImageType !== 'AI 切圖'"
          :image-url="props.imageUrl"
        />
        <TheDownloadBtn
          v-if="props.isDownload"
          :image-url="props.imageUrl"
        />
        <button
          v-if="props.isShowClose"
          class="w-10 h-10 relative transition-[background-color] duration-300 rounded-full hover:bg-white/10"
          @click="emits('update:isOpenPopup', false)"
        >
          <BaseSvgIcon
            class="w-6 h-6 text-white"
            name="close"
          />
        </button>
      </div>
      <div
        class="w-full h-[calc(100%-42px)] flex justify-center items-center"
        @click.self="emits('update:isOpenPopup', false)"
      >
        <slot />
      </div>
    </section>
  </transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 200ms linear;
  will-change: opacity;
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

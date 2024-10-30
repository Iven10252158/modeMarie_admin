<script setup lang='ts'>
import type { SvgData } from '@/store/useCutImageStore'
interface Props {
  svgData: SvgData,
  index: number,

}
interface Emits {
  (event: 'previewSvgImage', svgUrl:string): void,
  (event: 'deleteSvgData', index:number): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const hoverIndex = ref<number>(-1)

</script>

<template>
  <div
    class="w-[162px] xl:w-[141px] aspect-square relative bg-white"
    @mousemove=" hoverIndex = props.index"
    @mouseleave="hoverIndex = -1"
  >
    <img
      v-if="props.svgData.url"
      class="w-full h-full aspect-square object-contain object-center"
      :src="svgData.thumbnail"
    >
    <div
      v-if="!props.svgData.url && !props.svgData.errorMsg"
      class="w-full h-full relative flex flex-col items-center justify-center"
    >
      <img
        class="block w-12 h-12 aspect-square"
        src="@/assets/images/svg-loading.svg"
      >
      <p class="text-lighter text-content">
        SVG 轉換中
      </p>
    </div>

    <div
      v-if="!props.svgData.url && props.svgData.errorMsg"
      class="w-full h-full relative flex flex-col items-center justify-center"
    >
      <BaseSvgIcon
        name="close"
        class="w-5 h-5"
        src="@/assets/images/close.svg"
      />
      <p class="text-[#FFCE4F] text-content">
        {{ props.svgData.errorMsg }}
      </p>
    </div>
    <transition>
      <div
        v-if="hoverIndex === props.index && (props.svgData.url || props.svgData.errorMsg)"
        class="w-full h-full bg-black/60 flex items-center justify-center absolute top-0"
      >
        <div
          v-if="props.svgData.url || props.svgData.errorMsg"
          class="flex gap-4"
        >
          <button @click="emits('deleteSvgData', props.index)">
            <BaseSvgIcon
              class="w-[30px] h-[30px] text-white"
              name="close"
            />
            <p class="text-white text-content">
              刪除
            </p>
          </button>
          <button
            v-if="svgData.url"
            @click="emits('previewSvgImage', props.svgData.url)"
          >
            <!-- @click="previewData(props.svg)" -->
            <BaseSvgIcon
              class="w-[30px] h-[30px]"
              name="eye_white"
            />
            <p class="text-white text-content">
              預覽
            </p>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s linear;
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

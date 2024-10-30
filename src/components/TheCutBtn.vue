<script setup lang='ts'>
import { useCutImage } from '@/store/useCutImageStore'
interface Props {
  imageUrl: string,
}

const props = defineProps<Props>()
const useCutter = useCutImage()
const { moveToCutPage } = useCutter

</script>

<template>
  <button
    class="w-10 h-10 relative transition-[background-color] duration-300 rounded-full hover:bg-white/10 before:hover:content-['AI切圖'] before:hover:absolute before:hover:text-white before:hover:bg-black before:hover:rounded-full before:hover:py-1 before:hover:px-1 before:hover:top-12 before:hover:left-0 before:hover:text-remark before:hover:w-[49px]"
    @click="moveToCutPage(props.imageUrl)"
  >
    <BaseSvgIcon
      class="w-6 h-6 text-white"
      name="knife"
    />
  </button>
</template>

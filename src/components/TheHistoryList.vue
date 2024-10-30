<script setup lang='ts'>
import type { ImageData } from '@/store/useHistoryStore'

interface Props {
  histroyData: ImageData[],
  histroyKey: string
}

interface Emits {
  (event: 'openPopup', key:string, data:ImageData):void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const key = ref()
watchEffect(() => {
  key.value = props.histroyKey
})

</script>

<template>
  <section class="w-full flex gap-x-12 mb-2 last:mb-0">
    <slot />

    <div class="w-full flex gap-2 flex-wrap">
      <template
        v-for="data in props.histroyData"
        :key="data.image_id"
      >
        <button
          class="relative shrink-0 aspect-square w-[101px] h-[101px] object-cover object-center"
          @click="emits('openPopup', key, data)"
        >
          <BaseSvgIcon
            v-show="data.is_great_effect"
            class="w-4 h-4 absolute top-0 right-0"
            name="like_solid"
          />
          <BaseSvgIcon
            v-if="data.type === 'AI 生圖'"
            class="w-4 h-4 absolute top-0 left-0"
            name="square_solid"
          />

          <BaseSvgIcon
            v-else
            class="w-4 h-4 absolute top-0 left-0"
            name="knife_solid"
          />
          <img
            v-if="data.thumbnail"
            class="aspect-square w-full h-full object-cover object-center"
            loading="lazy"
            :src="data.thumbnail"
          >
        </button>
      </template>
    </div>
  </section>
</template>

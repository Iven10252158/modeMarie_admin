<script setup lang='ts'>
import lodash from 'lodash'
interface Props {
  totalPages: number,
  currentPage: number
}
interface Emits {
  (event: 'changePage', page: number): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const middlePages = computed(() => {
  if (props.currentPage < 6) {
    return Array.from({ length: 5 }, (_, i) => i + 2)
  } else if (props.totalPages - props.currentPage > 5) {
    return Array.from({ length: 5 }, (_, i) => props.currentPage - 2 + i)
  } else {
    return Array.from({ length: 5 }, (_, i) => props.totalPages - 5 + i)
  }
})

const changePage = lodash.debounce((page:number) => {
  if (page < 1 || page > props.totalPages) {
    return
  }
  emits('changePage', page)
}, 300)
</script>

<template>
  <div class="flex justify-center items-center">
    <button
      class="w-[25px] h-[25px] flex items-center justify-center text-lighter"
      :disabled="props.currentPage === 1"
      @click.prevent="changePage(props.currentPage - 1)"
    >
      <BaseSvgIcon
        class="w-4 h-4"
        name="arrow_prev"
      />
    </button>
    <div
      v-if="props.totalPages <= 10"
    >
      <button
        v-for="page in props.totalPages"
        :key="page"
        class="w-[25px] h-[25px] rounded-[5px] text-lighter"
        :class="{'text-white bg-[#62AAD7]': props.currentPage === page}"
        @click.prevent="changePage(page)"
      >
        {{ page }}
      </button>
    </div>
    <div
      v-else
      class="flex gap-[14px]"
    >
      <button
        :class="{'text-white bg-[#62AAD7]': props.currentPage === 1}"
        class="w-[25px] h-[25px] rounded-[5px] text-lighter"
        @click.prevent="changePage(1)"
      >
        1
      </button>
      <span v-if="props.currentPage > 6">....</span>
      <button
        v-for="page in middlePages"
        :key="page"
        class="w-[25px] h-[25px] rounded-[5px] text-lighter"
        :class="{'text-white bg-[#62AAD7]': props.currentPage === page}"
        @click.prevent="changePage(page)"
      >
        {{ page }}
      </button>
      <span v-if="props.totalPages - props.currentPage > 5">....</span>
      <button
        :class="{'text-white bg-[#62AAD7]': props.currentPage === props.totalPages}"
        class="w-[25px] h-[25px] rounded-[5px] text-lighter"
        @click.prevent="changePage(totalPages)"
      >
        {{ props.totalPages }}
      </button>
    </div>
    <button
      class="w-[25px] h-[25px] flex items-center justify-center text-lighter"
      :disabled="props.currentPage === props.totalPages"
      @click.prevent="changePage(props.currentPage + 1)"
    >
      <BaseSvgIcon
        class="w-4 h-4"
        name="arrow_next"
      />
    </button>
  </div>
</template>

<script setup lang='ts'>
import type { CustomDate } from '@/store/useHistoryStore'

import 'v-calendar/style.css'
import BaseSvgIcon from './BaseSvgIcon.vue'

interface Emits {
  (event: 'updateDate', date:CustomDate):void
}

const emits = defineEmits<Emits>()

const { startDate, endDate } = useDateFormatter()
const dateData = ref({
  startDate: startDate(),
  endDate: endDate()
})

const attribute = ref({
  highlight: {
    start: {
      style: {
        width: '37px',
        height: '37px',
        borderRadius: '10px',
        backgroundColor: '#62AAD7', // blue
        color: '#ffffff'
      },
      contentStyle: {
        color: '#ffffff', // color of the text
        minHeight: '37px',
        borderRadius: '10px',
        width: '37px',
        height: '37px'
      }
    },
    base: {
      style: {
        backgroundColor: '#62AAD7', // light blue
        borderRadius: '10px',
        width: '37px',
        height: '37px'
      }
    }
  }
})
const popover = ref({
  visibility: 'focus',
  placement: 'bottom',
  autoHide: true
})

</script>

<template>
  <section class="relative">
    <div class="h-10 flex justify-center items-start">
      <div class="h-full relative z-10 flex gap-5">
        <div
          class="my-calendar rounded-[10px] flex"
        >
          <VDatePicker
            v-model="dateData.startDate"
            :max-date="dateData.endDate"
            :popover="popover"
            :select-attribute="attribute"
            mode="date"
            is-required
            expanded
            @dayclick="emits('updateDate',{start_date: dateData.startDate, end_date: dateData.endDate})"
          >
            <template #default="{ inputValue, inputEvents }">
              <div
                class="w-[173px] h-full relative flex items-center"
              >
                <input
                  :value="inputValue"
                  class="input-date relative cursor-pointer w-full h-full text-center bg-[#ecf1f6] rounded-md"
                  readonly
                  v-on="inputEvents"
                >
                <BaseSvgIcon
                  name="date"
                  class="w-6 h-6 absolute left-3"
                />
              </div>
            </template>
          </VDatePicker>

          <span class="mx-2 leading-10">至</span>
          <VDatePicker
            v-model="dateData.endDate"
            :popover="popover"
            :select-attribute="attribute"
            mode="date"
            expanded
            :min-date="dateData.startDate"
            is-required
            @dayclick="emits('updateDate',{start_date: dateData.startDate, end_date: dateData.endDate})"
          >
            <!-- @dayclick="emits('updateEndDate', 'end',dateData.endDate)" -->
            <template #default="{ inputValue, inputEvents }">
              <div
                class="w-[173px] h-full relative flex items-center"
              >
                <input
                  ref="endDate"
                  :value="inputValue"
                  class="input-date relative cursor-pointer w-full h-full text-center bg-[#ecf1f6] rounded-md"
                  readonly
                  v-on="inputEvents"
                >
                <BaseSvgIcon
                  name="date"
                  class="w-6 h-6 absolute left-3"
                />
              </div>
            </template>
          </VDatePicker>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.my-calendar :deep(.vc-title > span) {
  font-weight: normal;
  color: #153751;
}

.my-calendar :deep(.vc-weeks .vc-week) {
  color: #153751;
}

.my-calendar :deep(.vc-weeks .vc-weekdays .vc-weekday) {
  color: #153751;
}

.my-calendar :deep(.vc-header > button) {
  color: #62aad7;
}

.my-calendar :deep(.vc-popover-content) {
  /*  #ecf1f6; */
  background-color: transparent;
  border: 0;
}

.my-calendar :deep(.vc-container) {
  background-color: #ecf1f6;
}

.input-date {
  color: transparent;
  text-shadow: 0 0 0 #78828a;
}

.input-date:focus {
  @apply border-2 border-[#62AAD7] shadow-[0_0px_4px_0px_rgb(98,170,215)];

  outline: 0;
}

</style>

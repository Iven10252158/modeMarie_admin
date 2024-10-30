<script setup lang='ts'>
import 'animate.css'

import { useNotification } from '@/composables/useNotification'

const { notification } = useNotification()
interface Props {
  message: string|null,
  index:number
}
const props = defineProps<Props>()
onMounted(() => {
  // console.log('Alert', notifications.value)
  notification.value.autoClose()
})

const closeAlert = () => {
  notification.value.close(props.index)
  // console.log('closeAlert', props.index)
}

onUnmounted(() => {
  notification.value.isOpen = false
})
</script>

<template>
  <section
    v-if="props.message"
    class="w-full h-10 bg-red-400 text-white rounded-[10px] flex items-center justify-center mb-4 animate__animated animate__slideInDown"
  >
    <button
      class="cursor-pointer w-6 h-6 text-white absolute right-2"
      @click="closeAlert"
    >
      <BaseSvgIcon
        class="w-full h-full object-cover object-center"
        name="close"
      />
    </button>
    {{ props.message }}
  </section>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 500ms linear;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-100%);
}

.v-enter-to,
.v-leave-from {
  transform: translateY(0);
}
</style>

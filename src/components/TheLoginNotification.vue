<script setup lang='ts'>
import 'animate.css'

interface Props {
  errorMessage: string|null
}
interface Emits {
  (event: 'updateErrorMsg', message: null): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

watch(() => props.errorMessage, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      emits('updateErrorMsg', null)
    }, 5000)
  }
})

</script>
<!-- animate__animated animate__slideInDown -->
<template>
  <section
    v-if="props.errorMessage"
    class="w-full mb-6 z-50 bg-error absolute top-2 left-0 -translate-x-1/2 rounded-[10px] animate__animated animate__slideInDown"
  >
    <p class="text-white py-[10px] px-3">
      {{ props.errorMessage }}
    </p>
  </section>
</template>

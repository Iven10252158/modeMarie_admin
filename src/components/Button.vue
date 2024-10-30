<script setup lang='ts'>
interface Props {
  isDisabled?: boolean
}

const props = defineProps<Props>()

</script>

<template>
  <section class="w-[calc(100%-4px)] h-9 relative mb-2">
    <div
      class="absolute -right-1 top-1  w-full h-9"
      :class="[props.isDisabled? 'bg-disabled' : 'bg-blue-light']"
    />
    <button
      class="w-full h-full relative border-2 bg-white"
      :class="[props.isDisabled? 'border-disabled' : 'border-navy']"
      :disabled="props.isDisabled"
    >
      <p
        class="text-highlight"
        :class="[props.isDisabled? 'text-disabled' : 'text-navy']"
      >
        <slot />
      </p>
    </button>
  </section>
</template>

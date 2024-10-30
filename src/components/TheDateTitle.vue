<script setup lang='ts'>
interface Props {
  histroyKey: string
}
const props = defineProps<Props>()
const dateTitle = computed(() => {
  const [year, month, day] = props.histroyKey.split('-')
  return {
    year,
    date: `${month}/${day}`
  }
})
</script>

<template>
  <header class="flex flex-col">
    <div class="text-subTitle text-navy">
      {{ dateTitle.date }}
    </div>
    <div class="text-content text-lighter">
      {{ dateTitle.year }}
    </div>
  </header>
</template>

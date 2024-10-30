<script setup lang='ts'>
import { useNotification } from '@/composables/useNotification'

const { notifications } = useNotification()

</script>

<template>
  <section class="absolute z-[99]">
    <Notification
      v-for="(item, index) in notifications"
      :key="item.id"
      :message="item.message"
      :index="index"
    />
  </section>
</template>

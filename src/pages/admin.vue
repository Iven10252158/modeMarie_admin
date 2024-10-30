<script lang="ts" setup>
import TheGlobalNotification from '@/components/TheGlobalNotification.vue'
const { notification } = useNotification()

const router = useRouter()
const route = useRoute()
onMounted(async () => {
  notification.value.isOpen = false
  if (route.name === 'admin') {
    router.push('/admin/image-generator')
  }
})

</script>

<template>
  <section class="w-full h-full relative">
    <div class="relative pt-9 z-10">
      <Tab />
    </div>

    <div class="w-full h-full bg-[url('@/assets/images/background.jpg')] bg-cover bg-center bg-no-repeat absolute top-0" />
    <div class="w-full h-[calc(100%-92px)] absolute bottom-4 bg-white/50 backdrop-blur-[5px]" />

    <div class="w-full h-[calc(100%-92px)] relative">
      <div class="w-full h-full px-12 absolute pt-9">
        <TheGlobalNotification
          v-if="notification.isOpen"
          class="w-[calc(100%-96px)]"
        />
        <!-- <router-view /> -->
        <router-view v-slot="{ Component }">
          <keep-alive include="cut">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </section>
</template>

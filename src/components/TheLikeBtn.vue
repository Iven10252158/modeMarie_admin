<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/store/global'
import { useGenerator } from '@/store/useImageGeneratedStore'
import { useHistoryStore } from '@/store/useHistoryStore'

const { setImageStatus } = useGenerator()
const { aiImagesArray } = storeToRefs(useGenerator())
const { updataImageStatus } = useHistoryStore()
const { currentHistoryImageData } = storeToRefs(useHistoryStore())

interface Props {
  id: number,
  isGreat?: boolean
}

const props = defineProps<Props>()
const apiUrl = import.meta.env.VITE_APP_API_BASE_URL
const isLike = ref<boolean>(false)

watchEffect(() => {
  if (currentHistoryImageData.value.id) {
    isLike.value = currentHistoryImageData.value.isLike
  }
})

onMounted(() => {
  aiImagesArray.value.forEach((item) => {
    if (props.id === item.image_id) {
      isLike.value = item.is_great_effect
    }
  })
})

const { setErrorStatus } = useErrorHandler()
const likeImage = async () => {
  const { getTokenFromStorage } = useGlobalStore()
  isLike.value = !isLike.value

  setImageStatus({
    id: props.id,
    isLike: isLike.value
  })

  const token = getTokenFromStorage()
  const header = {
    Authorization: token
  }
  axios.defaults.headers.common = header

  try {
    const response = await axios.patch(`${apiUrl}images/${props.id}/mark/effect`, {
      is_great_effect: isLike.value
    })
    isLike.value = response.data.is_great_effect
    updataImageStatus(response.data)

    setImageStatus({
      id: response.data.image_id,
      isLike: response.data.is_great_effect
    })
    // console.log(response)
  } catch (error) {
    setErrorStatus({ code: (error as any).response.status, message: (error as any).response.data.detail })
  }
}

</script>

<template>
  <button
    v-if="isLike"
    class="w-10 h-10 relative transition-[background-color] duration-300 rounded-full hover:bg-white/10 before:hover:content-['不喜歡'] before:hover:absolute before:hover:text-white before:hover:bg-black before:hover:rounded-full before:hover:py-1 before:hover:px-1 before:hover:top-12 before:hover:left-0 before:hover:text-remark before:hover:w-[49px]"
    @click="likeImage"
  >
    <BaseSvgIcon
      class="w-6 h-6 text-white"
      name="like_active"
    />
  </button>
  <button
    v-else
    class="w-10 h-10 relative transition-[background-color] duration-300 rounded-full hover:bg-white/10 before:hover:content-['喜歡'] before:hover:absolute before:hover:text-white before:hover:bg-black before:hover:rounded-full before:hover:py-1 before:hover:px-1 before:hover:top-12 before:hover:left-0 before:hover:text-remark before:hover:w-[49px]"
    @click="likeImage"
  >
    <BaseSvgIcon
      class="w-6 h-6 text-white"
      name="like"
    />
  </button>
</template>

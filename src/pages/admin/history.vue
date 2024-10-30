<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useHistoryStore } from '@/store/useHistoryStore'
import type { CustomDate, Button, ImageData } from '@/store/useHistoryStore'

const { getHistoryData, setSelectedDate } = useHistoryStore()
const { histroyData, paginations, currentPage, slideImageData, buttons } = storeToRefs(useHistoryStore())

const contentButton = ref<string>('不篩選')

// http://192.168.1.65:8000/histories?start_date=2024%2F01%2F17&end_date=2024%2F01%2F17&action=all
const { startDate, endDate } = useDateFormatter()

const selectedDate = ref<CustomDate>({
  start_date: startDate(),
  end_date: endDate()
})

const isOpenPopup = ref<boolean>(false)
let action = 'all'

const changePage = async (page:number) => {
  await getHistoryData({ page: page, buttonAction: action })
}

const imageSlideData = ref({
  currentDate: '',
  clickedIndex: 0,
  isFirstImage: false,
  isLastImage: false
})

const currentImage = ref<ImageData>({
  prompt: '',
  style: '',
  type: '',
  url: '',
  thumbnail: '',
  image_id: 0,
  is_great_effect: false,
  custom_template: ''
})
const handlePopupOpen = (key:string, data:ImageData) => {
  isOpenPopup.value = true
  imageSlideData.value.currentDate = key

  imageSlideData.value.clickedIndex = slideImageData.value.findIndex((item:ImageData) => item.image_id === data.image_id)
  currentImage.value = data
}

const buttonFilter = async (button:Button) => {
  contentButton.value = button.name
  action = button.action

  await getHistoryData({ page: 1, buttonAction: button.action })
}
const { notification } = useNotification()
onMounted(async () => {
  notification.value.isOpen = false
  contentButton.value = '不篩選'
  setSelectedDate(selectedDate.value)
  await getHistoryData()
})

const searchHistoryData = async () => {
  contentButton.value = '不篩選'
  await getHistoryData()
}

const downloadImageUrl = ref<string>('')
const currentImageType = ref<string>('')
const updateIndex = (index:number, indexType:string) => {
  downloadImageUrl.value = slideImageData.value[index].url
  currentImageType.value = indexType
  currentImage.value = slideImageData.value[index]
}

const { isTokenExpired, setErrorStatus } = useErrorHandler()
const router = useRouter()
watch(() => isTokenExpired.value, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      setErrorStatus({ code: 0, message: '' })
      router.go(0)
    }, 5000)
  }
})
</script>

<template>
  <section class="w-full h-full">
    <div class="w-full flex justify-center items-start pb-12">
      <TheDate @update-date="setSelectedDate" />
      <Button
        :is-disabled="false"
        class="w-[85px] h-10 bg-black text-white ml-2 mr-9"
        @click="searchHistoryData"
      >
        查詢
      </Button>
      <div class="flex gap-2">
        <button
          v-for="button in buttons"
          :key="button.action"
          class="w-[87px] xl:w-[117px] py-2 rounded-[10px]"
          :class="[contentButton === button.name ? 'bg-blue-sky text-white' : 'bg-background text-black']"
          @click="buttonFilter(button)"
        >
          {{ button.name }}
        </button>
      </div>
    </div>
    <div
      v-if="JSON.stringify(histroyData) === '{}'"
      class="w-full h-[calc(100%-128px)] flex items-center justify-center"
    >
      <p class="text-content text-medium-dark">
        查無結果，請重新篩選
      </p>
    </div>
    <section
      v-else
      class="w-full h-[calc(100%-154px)] overflow-y-auto mb-6"
    >
      <TheHistoryList
        v-for="(histroyValue, key) in histroyData"
        :key="key"
        :histroy-data="histroyValue"
        :histroy-key="key"
        @open-popup="handlePopupOpen"
      >
        <TheDateTitle :histroy-key="key" />
      </TheHistoryList>
    </section>

    <ThePagination
      v-if="JSON.stringify(histroyData) !== '{}'"
      :total-pages="paginations"
      :current-page="currentPage"
      @change-page="changePage"
    />
    <BasePopup
      v-model:isOpenPopup="isOpenPopup"
      :is-cut="true"
      :is-like="true"
      :is-download="true"
      :is-show-close="true"
      :image-url="downloadImageUrl"
      :image-data="currentImage"
      :current-image-type="currentImageType"
    >
      <!-- :slideing-image="histroyData?.[imageSlideData.currentDate]" -->
      <TheSlider
        v-if="slideImageData"
        :slide-image="slideImageData"
        :clicked-index="imageSlideData.clickedIndex"
        @update-index="updateIndex"
      />
    </BasePopup>
  </section>
</template>
<style scoped>
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #62aad7;
}
</style>

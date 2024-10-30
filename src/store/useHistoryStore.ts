
import { defineStore } from 'pinia'
import { useGlobalStore } from '@/store/global'
const { getTokenFromStorage } = useGlobalStore()
export interface CustomDate {
  start_date: Date|string,
  end_date: Date|string
}

export interface Button {
  name: string,
  action: string
}

export interface ImageData {
  prompt: string,
  style: string,
  type: string,
  url: string,
  thumbnail: string,
  image_id: number,
  is_great_effect: boolean,
  custom_template: string
}

export const useHistoryStore = defineStore('history-store', () => {
  const histroyData = ref<ImageData[]>()
  const currentPageDates = ref<string[]>()
  const paginations = ref<number>(1)
  const currentPage = ref<number>(1)
  const slideImageData = ref()
  const buttons = ref<Button[]>([
    {
      name: '不篩選',
      action: 'all'
    },
    {
      name: 'AI生圖',
      action: 'created'
    },
    {
      name: 'AI切圖',
      action: 'cropped'
    },
    {
      name: '喜歡',
      action: 'great_effect'
    }
  ])
  const { startDate, endDate, dateFormatter } = useDateFormatter()

  const selectedDateData = ref<CustomDate>({
    start_date: startDate(),
    end_date: endDate()
  })
  const setSelectedDate = (selectDate:CustomDate) => {
    selectedDateData.value = {
      start_date: dateFormatter(selectDate.start_date),
      end_date: dateFormatter(selectDate.end_date)
    }
  }

  const getHistoryData = async ({ page = 1, buttonAction = 'all' } = {}) => {
    const apiUrl = import.meta.env.VITE_APP_API_BASE_URL
    const token = getTokenFromStorage()
    const headers = { Authorization: token }

    currentPage.value = page
    slideImageData.value = []
    const action = buttons.value.filter(button => button.action === buttonAction)
    try {
      axios.defaults.headers.common = headers
      const response = await Get(`${apiUrl}histories/paginate`, { start_date: selectedDateData.value.start_date, end_date: selectedDateData.value.end_date, action: action[0].action, page: page }, { headers: { Authorization: token } })
      histroyData.value = response.data.items
      for (const item in response.data.items) {
        slideImageData.value = slideImageData.value.concat(response.data.items[item])
      }

      currentPageDates.value = Object.keys(response.data.items)

      const { pages } = response.data
      paginations.value = pages
    } catch (error) {
      const { setErrorStatus } = useErrorHandler()
      setErrorStatus({
        code: (error as any).response.status,
        message: (error as any).response.data.detail
      })
    }
  }
  const updataImageStatus = (data: ImageData) => {
    slideImageData.value?.forEach((item:ImageData) => {
      if (item.image_id === data.image_id) {
        item.is_great_effect = data.is_great_effect
      }
    })
  }
  const currentHistoryImageData = ref({
    id: 0,
    isLike: false
  })
  const setHistoryImageStatus = (data: ImageData) => {
    currentHistoryImageData.value = {
      isLike: data.is_great_effect,
      id: data.image_id
    }
  }

  return {
    setHistoryImageStatus,
    currentHistoryImageData,
    getHistoryData,
    histroyData,
    updataImageStatus,
    currentPageDates,
    paginations,
    currentPage,
    slideImageData,
    buttons,
    setSelectedDate
  }
})

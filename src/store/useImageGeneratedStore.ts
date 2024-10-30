import { defineStore } from 'pinia'
import { useGlobalStore } from './global'
export interface AiImage {
  url: string | null,
  image_id: number,
  error: string | null,
  detail?: string,
  is_great_effect: boolean
}
interface ImagePayloadType {
  style: string,
  numbers: number,
}
export enum ImageStyleList {
  '無' = '無',
  'MBE風格' = 'MBE風格',
  '寫實風格' = '寫實風格',
  '插畫風格' = '插畫風格',
  '扁平風格' = '扁平風格',
  '立體風格' = '立體風格',
  '肌理風格' = '肌理風格',
  '自訂風格' = '自訂風格'
}

export const useGenerator = defineStore('generate-image', () => {
  const apiUrl = import.meta.env.VITE_APP_API_BASE_URL
  const customTemplate = ref<string>('')
  const content = ref<string>('')
  const aiImagesArray = ref<AiImage[]>([])
  const isPending = ref<boolean>(false)
  const imageFile = ref<File|null>(null)
  const generateImagePayload = ref<ImagePayloadType>({
    style: '',
    numbers: 1
  })

  const setImageStylePayloadValue = (style:ImageStyleList) => {
    generateImagePayload.value.style = ImageStyleList[style]
  }

  const setCustomTemplate = (customStyle:string) => {
    customTemplate.value = customStyle
  }

  const setContentValue = (contentText:string) => {
    content.value = contentText
  }

  const setImageNumberPayloadValue = (number:number) => {
    generateImagePayload.value.numbers = number
  }

  const getImageFile = (file:File|null) => {
    imageFile.value = file
  }

  const makeApiUrlQuery = (apiUrlQuery: ImagePayloadType) => {
    const apiQuery = `${apiUrl}image/generate`
    const obj:Record<string, any> = {}
    type ApiUrlQueryType = keyof ImagePayloadType
    // style | content | numbers

    Object.keys(apiUrlQuery).forEach((key) => {
      if (apiUrlQuery[key as ApiUrlQueryType]) {
        obj[key] = apiUrlQuery[key as ApiUrlQueryType]
      }
    })

    const apiUrlArguments = new URLSearchParams(obj).toString()

    return `${apiQuery}?${apiUrlArguments}`
  }

  const initAiImagesArray = (imageNum: number) => {
    aiImagesArray.value = Array(imageNum).fill(null).map((_, index) => {
      return {
        image_id: Date.now() + index,
        url: null,
        error: null,
        is_great_effect: false
      }
    })
  }

  const timer = ref(0)
  const handleTabTitleFlash = (newTitle:string) => {
    if (!document.hidden) return
    const defaultTitle = 'AI 構想助手'
    timer.value = setInterval(() => { useFlashTitle(defaultTitle, newTitle) }, 1000)
  }

  const { setErrorStatus } = useErrorHandler()
  const getGeneratedImage = async (payload: ImagePayloadType) => {
    initAiImagesArray(generateImagePayload.value.numbers)

    const token = useGlobalStore().getTokenFromStorage()
    const headers = { Authorization: token }
    const apiUrl = makeApiUrlQuery(payload)
    isPending.value = true
    let newTitle:string
    try {
      axios.defaults.timeout = 0
      axios.defaults.headers.common = headers
      const formData = new FormData()
      if (content.value) formData.append('content', content.value)
      if (imageFile.value) formData.append('file', imageFile.value)
      if (customTemplate.value) formData.append('custom_template', customTemplate.value)
      const response = await axios.post(apiUrl, formData)
      newTitle = `您的${aiImagesArray.value.length}張圖片已生成完成！`
      const { data } = response
      handleTabTitleFlash(newTitle)

      isPending.value = false
      data.forEach((image:AiImage, index:number) => {
        if (image.detail) {
          aiImagesArray.value[index].error = image.detail
        } else {
          aiImagesArray.value[index] = image
        }
      })
    } catch (error) {
      setErrorStatus({ code: (error as any).response.status, message: (error as any).response.data.detail })
    }
  }

  const setImageStatus = (data:{id: number, isLike: boolean}) => {
    aiImagesArray.value.forEach((item) => {
      if (item.image_id === data.id) {
        item.is_great_effect = data.isLike
      }
    })
  }

  return {
    getGeneratedImage,
    setImageStylePayloadValue,
    setContentValue,
    setImageNumberPayloadValue,
    setCustomTemplate,
    customTemplate,
    aiImagesArray,
    content,
    isPending,
    imageFile,
    getImageFile,
    generateImagePayload,
    ImageStyleList,
    setImageStatus,
    timer
  }
})

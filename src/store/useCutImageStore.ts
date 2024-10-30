import { useImageFormatter } from '@/composables/imageProcessor/useImageFormatter'
import { useGlobalStore } from '@/store/global'
import { defineStore } from 'pinia'
const { getTokenFromStorage } = useGlobalStore()
export interface SvgData {
  url: string,
  'history_id': number,
  errorMsg: string,
  thumbnail: string
}
export const useCutImage = defineStore('cutImgae', () => {
  // pngUrl: string
  const apiUrl = import.meta.env.VITE_APP_API_BASE_URL
  const isMouseDown = ref(false)
  const router = useRouter()
  const currentImage = ref<string>('')
  const svgData = ref<SvgData[]>([])
  const imageFile = ref<File|null>(null) // 整張圖
  const pngUrl = ref<string>('') // 顯示popup的png 二進位轉 image url
  const pngImageFile = ref<File>() // 整張圖
  const isOpenPopup = ref<boolean>(false)
  const isShowPngUrl = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const isShowAlert = ref<boolean>(false)
  const { setTransferredPngUrl, setUrlToImageFile } = useImageFormatter()

  const handleCutImageStatus = (status: boolean) => {
    isMouseDown.value = status
  }
  const setCurrnetImageUrl = (url:string) => {
    currentImage.value = url
  }
  const moveToCutPage = async (image:string) => {
    router.push('/admin/cut')
    setCurrnetImageUrl(image)
    imageFile.value = await setUrlToImageFile(image)
    handlePopupOpen(false)
  }

  let title:string
  let maskFile: File // mask 遮罩
  // 取得 mask 遮罩
  const handleMask64ToMaskFile = (mask:string) => {
    if (!mask) return
    const maskBase64 = mask.split(',')
    const type = maskBase64[0].match(/:(.*?);/)
    if (type) title = type[1]
    const data = window.atob(maskBase64[1])
    let length = data.length
    const u8array = new Uint8Array(length)
    while (length--) {
      u8array[length] = data.charCodeAt(length)
    }
    maskFile = new File([u8array], 'mask.jpg', { type: title })
  }

  const handleLoadingStatus = (status: boolean) => {
    isLoading.value = status
  }
  const handleAlertShow = (status:boolean) => {
    isShowAlert.value = status
  }

  const limitedSvgDataLength = () => {
    const { notification } = useNotification()
    if (svgData.value.length >= 20) {
      notification.value.error({
        content: 'svg 數量不可超過 20 個'
      })
      return true
    }
    return false
  }

  let uploadImageFile:File|null = null
  const handleUploadImageFile = (file:File|null) => {
    uploadImageFile = file
  }

  // cropping 將割下的圖轉成png -> response 拿到的是 二進位
  const handleCroppingImg = async () => {
    const isOverTwenty = limitedSvgDataLength()
    if (isOverTwenty) return
    handlePopupOpen(true)
    handleLoadingStatus(true)
    handleShowPngUrl(true)

    if (!imageFile.value && !uploadImageFile) return
    if (uploadImageFile) {
      imageFile.value = null
    }
    const fileToUpload = uploadImageFile || imageFile.value
    const formData = new FormData()
    // formdata 要帶的是 整張圖的File 和 maskFile 遮罩
    if (fileToUpload) formData.append('file', fileToUpload)
    formData.append('mask', maskFile)

    const token = getTokenFromStorage()
    const headers = { Authorization: token }
    axios.defaults.timeout = 0
    try {
      axios.defaults.headers.common = headers
      const response = await axios.post(`${apiUrl}image/cropping`, formData, { responseType: 'arraybuffer' })
      // response 的 arrayBuffer 轉 png 的 url
      pngUrl.value = setTransferredPngUrl(response.data)
      pngImageFile.value = await setUrlToImageFile(pngUrl.value)
      handleLoadingStatus(false)
    } catch (error) {
      const { setErrorStatus } = useErrorHandler()
      setErrorStatus({ code: (error as any).response.status, message: (error as any).response.data.detail })
    }
  }

  const handlePopupOpen = (isOpen:boolean) => {
    isOpenPopup.value = isOpen
    if (!isOpenPopup.value) clearPngUrl()
  }

  const handleShowPngUrl = (show:boolean) => {
    isShowPngUrl.value = show
  }

  const clearPngUrl = () => {
    pngUrl.value = ''
  }

  const cancelImage = () => {
    currentImage.value = ''
  }
  const isTransfering = ref<boolean>(false)
  let requestCounter = 0
  // transferSvg 將裁切後的圖轉成svg，參數要帶的是 cropping 完的 pngFile
  const transferSvg = async (cutFile: File) => {
    isTransfering.value = true
    const url = `${apiUrl}image/transfer`
    const formData = new FormData()
    formData.append('file', cutFile)
    const token = getTokenFromStorage()

    const headers = { Authorization: token }
    const svgItem = ref({
      url: '',
      history_id: 0,
      errorMsg: '',
      thumbnail: ''
    })
    // 限制 svg 數量，不可超過 20 個
    const isOverTwenty = limitedSvgDataLength()
    if (isOverTwenty) return

    svgData.value.push(svgItem.value)
    axios.defaults.timeout = 0
    try {
      axios.defaults.headers.common = headers

      requestCounter++
      const response = await axios.post(url, formData)

      const { data } = response
      isMouseDown.value = false

      svgItem.value.history_id = data.history_id
      svgItem.value.url = data.url
      svgItem.value.thumbnail = data.thumbnail
    } catch (error) {
      const { setErrorStatus } = useErrorHandler()
      setErrorStatus({ code: (error as any).response.status, message: (error as any).response.data.detail })
    } finally {
      requestCounter--
      // 如果沒有正在進行的請求，表示所有請求都已完成
      if (requestCounter === 0) {
        isTransfering.value = false
        console.log('All requests are completed.')
      }
    }
  }
  const deleteData = (idx:number) => {
    svgData.value.splice(idx, 1)
  }
  const isDownLoading = ref<boolean>(false)

  const downloadSvgData = async () => {
    // http://192.168.1.182:8000/download?ids=item.history_id&ids=item.history_id
    // 'application/x-zip-compressed'
    const ids = svgData.value.map((item) => `ids=${item.history_id}`).join('&')
    const url = `${apiUrl}download?${ids}`
    isDownLoading.value = true
    const token = getTokenFromStorage()

    const response = await axios.get(url, { responseType: 'blob', headers: { Authorization: token } })
    const { data } = response
    const dataBlob = new Blob([data], { type: 'application/x-zip-compressed' })
    const getTimeStamp = Date.now()
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(dataBlob)
    link.download = `zip-${getTimeStamp}.zip`
    isDownLoading.value = false
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  }
  return {
    isOpenPopup,
    isShowPngUrl,
    isLoading,
    isShowAlert,
    handleLoadingStatus,
    handleShowPngUrl,
    handlePopupOpen,
    handleCutImageStatus,
    moveToCutPage,
    cancelImage,
    imageFile,
    currentImage,
    transferSvg,
    isTransfering,
    svgData,
    downloadSvgData,
    isMouseDown,
    handleMask64ToMaskFile,
    handleCroppingImg,
    clearPngUrl,
    pngImageFile,
    pngUrl,
    deleteData,
    handleAlertShow,
    handleUploadImageFile,
    isDownLoading
  }
})

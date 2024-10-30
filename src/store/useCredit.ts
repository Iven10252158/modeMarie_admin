import { defineStore } from 'pinia'

export const useCredit = defineStore('credit', () => {
  const apiUrl = import.meta.env.VITE_APP_API_BASE_URL
  const token = JSON.parse(localStorage.getItem('token') as string)
  const generateCredit = ref<number>(0)
  const SvgCredit = ref({
    current: 0,
    total: 0
  })

  const headers = {
    Authorization: token
  }
  // http://192.168.1.182:8000/image/generator/credits
  const handleGenerateCredit = async () => {
    try {
      axios.defaults.headers.common = headers
      const response = await axios.get(`${apiUrl}image/generator/credits`)
      generateCredit.value = response.data.remain_credits
    } catch (error) {
      console.log('error', error)
    }
  }

  const hanldeSvgCredit = async () => {
    try {
      axios.defaults.headers.common = headers
      const response = await axios.get(`${apiUrl}image/cropper/credits`)
      SvgCredit.value.current = response.data.remain_credits
      SvgCredit.value.total = response.data.remain_total
    } catch (error) {
      console.log('error', error)
    }
  }
  return {
    handleGenerateCredit,
    hanldeSvgCredit,
    generateCredit,
    SvgCredit
  }
})

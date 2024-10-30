import { Ref } from 'vue'
const npyRunPath = import.meta.env.VITE_APP_API_NPY_RUN
const npyToken = import.meta.env.VITE_APP_API_TOKEN
const npyStatusPath = import.meta.env.VITE_APP_API_NPY_STATUS

export const handleLoadNpyConnect = () => {
  const connectTimeOut = ref<string>('')
  const loadNpyId = async (imageBase64:string) => {
    // const controller = new AbortController()
    const data = {
      input: {
        upload_file: imageBase64.split(',')[1],
        filename: 'image'
      }
    }
    axios.defaults.timeout = 0 // 60 * 1000
    try {
      const response = await axios.post(npyRunPath, data, { headers: { Authorization: `Bearer ${npyToken}` } })
      axios.defaults.timeout = 0
      return response.data
    } catch (error:any) {
      axios.defaults.timeout = 0
      if (error.code === 'ECONNABORTED') {
        connectTimeOut.value = '網路連線不穩，請檢查網路連線或重新整理頁面。'
        controller.abort()
      } else {
        console.log(error)
      }
    }
  }

  const controller = new AbortController()
  let timer:any
  const cancelConnect = (isCancel:boolean) => {
    if (isCancel) {
      controller.abort()
      clearInterval(timer)
    }
  }

  let oldID = ''
  const loadNpyFile = async (id: Ref<string>):Promise<string> => {
    if (oldID !== id.value && oldID) {
      clearInterval(timer)
      // console.log('interrupt')
    }

    oldID = id.value

    return new Promise((resolve, reject) => {
      timer = setInterval(async () => {
        try {
          const response = await axios.get(`${npyStatusPath}${oldID}`,
            {
              headers: { Authorization: `Bearer ${npyToken}` }
            })
          const { status } = response.data

          if (status === 'COMPLETED') {
            clearInterval(timer)
            resolve(response.data.output.url)
            axios.defaults.timeout = 0
          }
        } catch (error:any) {
          if (error.code === 'ECONNABORTED') {
            connectTimeOut.value = '網路連線不穩，模型尚未載入，請檢查網路連線或重新整理頁面。'
            reject(new Error(connectTimeOut.value))
            controller.abort()
            clearInterval(timer)
            axios.defaults.timeout = 0
          } else {
            // console.log(error.response.data.error)

            reject(new Error(error.response.data.error))
          }
        }
      }, 2000)
    })
  }

  return {
    loadNpyId,
    connectTimeOut,
    loadNpyFile,
    cancelConnect
  }
}

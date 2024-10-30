import { useGlobalStore } from '@/store/global'

export const useLogin = () => {
  const { setTokenToStorage } = useGlobalStore()
  const { setErrorMessage } = useErrorHandler()

  const userAccount = ref({
    username: '',
    password: ''
  })
  const router = useRouter()
  const isLogin = ref<boolean>(false)
  const isShowAlert = ref<boolean>(false)
  const apiUrl = import.meta.env.VITE_APP_API_BASE_URL

  const login = async () => {
    try {
      const response = await Post(`${apiUrl}login`, userAccount.value)
      const accessToken = response.data.access_token
      const type = response.data.token_type
      const token = `${type} ${accessToken}`
      setTokenToStorage(token)
      isLogin.value = true
      router.push('/admin/image-generator')
    } catch (error) {
      setErrorMessage((error as any).response.data.detail)
      isShowAlert.value = true
      isLogin.value = false
    }
  }

  return {
    login,
    userAccount,
    isShowAlert,
    isLogin
  }
}

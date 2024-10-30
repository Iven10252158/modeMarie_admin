export const useLogOut = () => {
  const router = useRouter()
  const apiUrl = import.meta.env.VITE_APP_API_BASE_URL
  const token = JSON.parse(localStorage.getItem('token') as string)
  const logout = async () => {
    const header = {
      Authorization: token
    }
    axios.defaults.headers.common = header
    const response = await axios.post(`${apiUrl}logout`)
    const { data } = response
    if (data) {
      localStorage.removeItem('token')
      router.go(0)
    }
  }
  return {
    logout
  }
}

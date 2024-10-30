enum ErrorStatus {
  insufficient = 400,
  tokenExpired = 401,
  forbidden = 403,
  unexpected = 406,
  validationError = 422,
  serverError = 500
}
// useApiErrorHandler
const errorMessage = ref<string|null>(null)
const isTokenExpired = ref<boolean>(false)
const { notification } = useNotification()
export const useErrorHandler = () => {
  const setErrorMessage = (errorMsg:string|null) => {
    errorMessage.value = errorMsg
    notification.value.error({
      content: errorMsg
    })
  }

  const setErrorStatus = ({ code = 0, message = '' }) => {
    if (!code) { isTokenExpired.value = false }
    if (code === ErrorStatus.tokenExpired || code === ErrorStatus.forbidden) {
      isTokenExpired.value = true
      setErrorMessage('身份過期，請重新登入，5秒後頁面跳轉')
      return
    }

    if (code === ErrorStatus.validationError) {
      setErrorMessage('請重新選擇')
      return
    }
    if (code === ErrorStatus.serverError) {
      setErrorMessage('不可預期的錯誤')
      return
    }
    setErrorMessage(message)
  }
  return {
    setErrorMessage,
    setErrorStatus,
    isTokenExpired,
    errorMessage
  }
}

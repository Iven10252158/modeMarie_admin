import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global-store', () => {
  const imageUrl = ref<string|null>(null)
  const imageFile = ref<File|null>(null)

  const setImageFile = (file:File|null) => {
    imageFile.value = file
    console.log('setImageFile', imageFile.value)
  }

  const setImageUrl = (src: string|null) => {
    imageUrl.value = src
    console.log('setImageUrl', imageUrl.value)
  }

  const setTokenToStorage = (token:string) => {
    localStorage.setItem('token', JSON.stringify(token))
  }

  const getTokenFromStorage = () => JSON.parse(localStorage.getItem('token') as string)

  const removeToken = () => {
    localStorage.removeItem('token')
  }
  return {
    setTokenToStorage,
    getTokenFromStorage,
    removeToken,
    setImageFile,
    imageFile,
    setImageUrl,
    imageUrl
  }
})

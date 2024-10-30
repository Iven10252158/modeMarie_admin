export const useImageFormatter = () => {
  const setUrlToImageFile = async (imageUrl:string): Promise<File> => {
    try {
      const response = await fetch(imageUrl, { cache: 'no-cache' })
      const blob = await response.blob()
      return new File([blob], `image.${blob.type.split('/')[1]}`, { type: blob.type })
    } catch (error) {
      console.log(error)
      throw new Error('Failed to fetch or process image')
    }
  }

  const setTransferredPngUrl = (data:ArrayBuffer) => window.URL.createObjectURL(new Blob([data], { type: 'image/png' }))

  const blobToBase64 = async (blob:Blob):Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        resolve(base64)
      }
    })
  }
  const loadImageFromBase64 = (base64:string):Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.src = base64
    })
  }

  return {
    setUrlToImageFile,
    setTransferredPngUrl,
    blobToBase64,
    loadImageFromBase64
  }
}

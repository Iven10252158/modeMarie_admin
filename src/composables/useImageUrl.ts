// 無狀態邏輯

const handleImageUrl = (value:string) => {
  if (!value) return

  const url = new URL(value, location.origin)
  return url
}
export { handleImageUrl }

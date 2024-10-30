// 無狀態邏輯

const handleImageScale = (image: HTMLCanvasElement) => {
  // Input images to SAM must be resized so the longest side is 1024
  const LONG_SIDE_LENGTH = 1024
  const w = image.width
  const h = image.height
  const samScale = LONG_SIDE_LENGTH / Math.max(h, w)
  return { height: h, width: w, samScale }
}

export { handleImageScale }

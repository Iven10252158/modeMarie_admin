const arrayToImageData = (input: any, width: number, height: number) => {
  const [r, g, b, a] = [0, 114, 189, 255] // the masks's blue color
  // const [r, g, b, a] = [0, 0, 0, 0]
  const arr = new Uint8ClampedArray(4 * width * height).fill(0)
  // console.log(arr)
  for (let i = 0; i < input.length; i++) {
    // Threshold the onnx model mask prediction at 0.0
    // This is equivalent to thresholding the mask using predictor.model.mask_threshold
    // in python
    if (input[i] > 0.0) {
      arr[4 * i + 0] = r
      arr[4 * i + 1] = g
      arr[4 * i + 2] = b
      arr[4 * i + 3] = a
    }
  }
  return new ImageData(arr, height, width)
}

// Use a Canvas element to produce an image from ImageData
const imageDataToImage = (imageData: ImageData) => {
  const canvas = imageDataToCanvas(imageData)
  const image = new Image()
  image.src = canvas.toDataURL()
  return image
}

// Canvas elements can be created from ImageData
const imageDataToCanvas = (imageData: ImageData) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = imageData.width
  canvas.height = imageData.height
  ctx?.putImageData(imageData, 0, 0)
  return canvas
}

export const onnxMaskToImage = (input: any, width: number, height: number) => {
  return imageDataToImage(arrayToImageData(input, width, height))
}

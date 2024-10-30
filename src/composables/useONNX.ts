import { ref } from 'vue'
import lodash from 'lodash'
import { InferenceSession, Tensor } from 'onnxruntime-web'
import { onnxMaskToImage } from './useMaskUtils'

const modelScale = ref()
const model = ref<InferenceSession|null>(null)
const tensor = ref<Tensor|null>(null)
const maskImg = ref()

export const useOnnxModel = () => {
  const setMaskImg = (mask:HTMLImageElement) => {
    maskImg.value = mask
  }

  const runONNX = lodash.debounce(async (clickObj:any) => {
    if (model.value === null || clickObj === null || tensor.value === null || modelScale.value === null) return

    const feeds = modelData({
      clicks: [clickObj],
      tensor: tensor.value,
      modelScale: modelScale.value
    })

    if (feeds === undefined) return false
    const results = await model.value.run(feeds as any)
    const output = results[model.value.outputNames[0]]
    setMaskImg(onnxMaskToImage(output.data, output.dims[2], output.dims[3]))
  }, 15)
  return {
    modelScale, model, tensor, runONNX, maskImg
  }
}

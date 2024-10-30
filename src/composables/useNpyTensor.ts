import npyjs from 'npyjs'
import * as ort from 'onnxruntime-web'

const loadNpyTensor = async (tensorFile:string, file:string) => {
  // eslint-disable-next-line new-cap
  const npLoader = new npyjs()
  const npArray = await npLoader.load(tensorFile)

  const tensor:ort.Tensor = new ort.Tensor(npArray.data, npArray.shape)
  return tensor
}
export { loadNpyTensor }

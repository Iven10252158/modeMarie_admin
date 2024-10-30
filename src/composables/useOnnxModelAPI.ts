// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.
import { Tensor } from 'onnxruntime-web'

interface Clicks {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  clickType: number
}

interface ModelScale{
  height: number,
  samScale: number,
  width: number
}

interface ModelData {
  clicks: Clicks[];
  tensor: any;
  modelScale: ModelScale;
}
// click 點擊的座標
// tensor embadding的結果
const modelData = ({ clicks, tensor, modelScale }: ModelData) => {
  const imageEmbedding = tensor
  // console.log(imageEmbedding)
  let pointCoords
  let pointLabels
  let pointCoordsTensor
  let pointLabelsTensor

  // // Check there are input click prompts
  if (clicks) {
    const n = clicks.length

    // If there is no box input, a single padding point with
    // label -1 and coordinates (0.0, 0.0) should be concatenated
    // so initialize the array to support (n + 1) points.
    pointCoords = new Float32Array(2 * (n + 1))
    pointLabels = new Float32Array(n + 1)
    // console.log('pointLabels', pointLabels)

    // Add clicks and scale to what SAM expects
    for (let i = 0; i < n; i++) {
      // console.log('i', i)
      // pointCoords[2 * i] = clicks[i].x * modelScale.samScale
      pointCoords[2 * i] = clicks[i].x1 * modelScale.samScale
      pointCoords[2 * i + 1] = clicks[i].y1 * modelScale.samScale
      pointCoords[2 * i + 2] = clicks[i].x2 * modelScale.samScale
      pointCoords[2 * i + 3] = clicks[i].y2 * modelScale.samScale
      pointLabels[i] = clicks[i].clickType
    }

    // Add in the extra point/label when only clicks and no box
    // The extra point is at (0, 0) with label -1
    // pointCoords[2 * n] = 0.0
    // pointCoords[2 * n + 1] = 0.0
    // pointLabels[n] = -1.0
    pointLabels = [2, 3]

    // Create the tensor
    pointCoordsTensor = new Tensor('float32', pointCoords, [1, n + 1, 2])
    pointLabelsTensor = new Tensor('float32', pointLabels, [1, n + 1])
  }
  const imageSizeTensor = new Tensor('float32', [
    modelScale.height,
    modelScale.width
  ])

  if (pointCoordsTensor === undefined || pointLabelsTensor === undefined) return false

  // // There is no previous mask, so default to an empty tensor
  const maskInput = new Tensor(
    'float32',
    new Float32Array(256 * 256),
    [1, 1, 256, 256]
  )
  // There is no previous mask, so default to 0
  const hasMaskInput = new Tensor('float32', [0])

  return {
    image_embeddings: imageEmbedding,
    point_coords: pointCoordsTensor,
    point_labels: pointLabelsTensor,
    orig_im_size: imageSizeTensor,
    mask_input: maskInput,
    has_mask_input: hasMaskInput
  }
}

export { modelData }

<script setup lang='ts'>
import lodash from 'lodash'
interface Props{
  imageUrl: string
}
const props = defineProps<Props>()
const handleDownloadBtn = lodash.debounce(async () => {
  // console.log(props.imageUrl)

  const response = await fetch(props.imageUrl, { cache: 'no-cache' })

  const getTimeStamp = Date.now()
  const blob = await response.blob()
  const file = new File([blob], `image.${blob.type.split('/')[1]}`, { type: blob.type })

  if (props.imageUrl.split('.').length > 0) {
    const stringLength = props.imageUrl.split('/').length
    const splitString = props.imageUrl.split('/')[stringLength - 1].split('.')
    const splitStringLength = splitString.length
    const splitSubFileName = splitString[splitStringLength - 1]

    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(file)
    const subFileName = splitSubFileName
    const fileName = getTimeStamp
    a.download = `image-${fileName}.${subFileName}`
    a.click()
  }
}, 300)
</script>

<template>
  <button
    class="w-10 h-10 relative transition-[background-color] duration-300 rounded-full hover:bg-white/10 before:hover:content-['下載'] before:hover:absolute before:hover:text-white before:hover:bg-black before:hover:rounded-full before:hover:py-1 before:hover:px-1 before:hover:top-12 before:hover:left-1/2 before:hover:-translate-x-1/2 before:hover:text-remark before:hover:w-[49px]"
    @click="handleDownloadBtn"
  >
    <BaseSvgIcon
      class="w-6 h-6 text-white"
      name="download"
    />
  </button>
</template>

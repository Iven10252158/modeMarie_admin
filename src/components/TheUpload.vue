<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/store/global'
const useStore = useGlobalStore()
const { setImageUrl } = useStore
const { imageUrl } = storeToRefs(useStore)
const input = ref<HTMLInputElement|null>(null)

const selectFile = () => {
  input.value?.click()
}

interface Emits {
  (event: 'uploadFile', file: File|null): void
  (event: 'uploadFileMessage', message: string|null): void
}

const emits = defineEmits<Emits>()

let imageSrc:string|null
const fileName = ref<string>()

const fileMaxSize = 1024 * 1024 * 5
const handleFileChange = (event:Event) => {
  const target = event.target as HTMLInputElement

  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file.size > fileMaxSize) {
      emits('uploadFileMessage', '圖片大小不可超過 5MB !')
      target.value = ''
      return
    }
    fileName.value = file.name
    imageSrc = URL.createObjectURL(file)
    emits('uploadFile', file)
    emits('uploadFileMessage', null)
    setImageUrl(imageSrc)
  }
}

const cancelFile = () => {
  imageSrc = null
  emits('uploadFile', null)
  // setImageFile(null)
  setImageUrl(null)
}

</script>

<template>
  <section
    class="w-full h-full py-3 mb-3 bg-background relative rounded-[10px] the-upload"
  >
    <button
      v-show="imageUrl"
      class="w-6 h-6 absolute top-2 right-2"
      @click="cancelFile"
    >
      <BaseSvgIcon
        class="w-full h-full object-cover object-center text-[#62AAD7]"
        name="close"
      />
    </button>

    <div
      v-if="!imageUrl"
      class="w-full h-full flex flex-col items-center justify-center"
    >
      <button
        @click="selectFile"
      >
        <input
          ref="input"
          type="file"
          class="hidden"
          accept="image/.jpg,.png,.jpeg"
          @change="handleFileChange"
        >
        <BaseSvgIcon
          class="w-6 h-6 text-[#9CA4AB]"
          name="upload"
        />
        <p class="text-lighter text-content">
          上傳檔案
        </p>
      </button>
    </div>
    <img
      v-else
      ref="uploadImage"
      class="w-full h-full object-contain object-center"
      :src="imageUrl"
      :alt="fileName"
    >
  </section>
</template>

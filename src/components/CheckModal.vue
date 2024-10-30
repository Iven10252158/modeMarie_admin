<script setup lang='ts'>
import { useCutImage } from '@/store/useCutImageStore'
const useCutter = useCutImage()
const { deleteData } = useCutter

interface Props {
  svgIndex: number,
  isShowModal: boolean
}
interface Emits {
  (event: 'update:isShowModal', isShow:boolean): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const localIsShowModal = ref(props.isShowModal)
const handleSvgData = () => {
  deleteData(props.svgIndex)
  emits('update:isShowModal', false)
}
watch(() => props.isShowModal, (newValue) => {
  localIsShowModal.value = newValue
})
</script>

<template>
  <BasePopup
    v-model:isOpenPopup="localIsShowModal"
    :is-like="false"
    :is-cut="false"
    :is-download="false"
    :is-show-close="false"
  >
    <div class="w-full h-full">
      <div class="w-[378px] h-[300px] bg-background rounded-[10px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div class="w-full h-full flex flex-col items-center justify-center px-12">
          <h3 class="text-content text-center text-lighter flex flex-col gap-6 items-center justify-center w-full h-[calc(100%-120px)]">
            確定要刪除SVG嗎？
          </h3>

          <div class="w-full flex items-center justify-center gap-4">
            <Button
              class="w-[160px]"
              @click="emits('update:isShowModal', false)"
            >
              <p class="text-navy">
                取消
              </p>
            </Button>
            <Button
              class="w-[160px]"
              @click="handleSvgData"
            >
              <p class="text-blue-sky">
                確定
              </p>
            </Button>
          </div>
          <h3 class="text-remark text-center text-error pt-2">
            刪除後點數不會復原
          </h3>
        </div>
      </div>
    </div>
  </BasePopup>
</template>

<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useCredit } from '@/store/useCredit'
interface TabList {
  name: string,
  path: string
}

const handleCredit = useCredit()
const { handleGenerateCredit, hanldeSvgCredit } = handleCredit
const { generateCredit, SvgCredit } = storeToRefs(handleCredit)

const tabList = ref<TabList[]>(
  [
    {
      name: 'AI生圖',
      path: 'image-generator'
    },
    {
      name: 'AI切圖',
      path: 'cut'
    },
    {
      name: '歷史紀錄',
      path: 'history'
    }
  ]
)
const router = useRouter()
const route = useRoute()
const currentTab = ref<string>()
const isOpenPopup = ref<boolean>(false)

onMounted(() => {
  if (route.name) {
    const name = route.name as string

    const pathName = name.split('-')[1]
    const path = tabList.value.filter(item => item.path === pathName)
    if (!path.length) currentTab.value = 'AI生圖'
    else {
      currentTab.value = path[0].name
    }
  }
})

const clickTab = (tab:string) => {
  currentTab.value = tab

  const path = tabList.value.filter(item => item.name === tab)
  if (path) router.push(`/admin/${path[0].path}`)
}

router.afterEach((to) => {
  const name = to.name as string
  const pathName = name.split('-')[1]
  const path = tabList.value.filter(item => item.path === pathName)
  if (path.length > 0)currentTab.value = path[0].name
})

const handlePopup = () => {
  isOpenPopup.value = true
  if (currentTab.value === 'AI生圖') {
    handleGenerateCredit()
    return
  }

  if (currentTab.value === 'AI切圖') {
    hanldeSvgCredit()
  }
}

const { logout } = useLogOut()
</script>

<template>
  <ul
    class="w-full flex justify-center items-center gap-x-3"
  >
    <li
      v-for="tab in tabList"
      :key="tab.name"
    >
      <button
        class="w-[166px] h-10 flex justify-center items-center rounded-[10px]"
        :class="[tab.name === currentTab? 'bg-white': 'bg-background']"
        @click.stop="clickTab(tab.name)"
      >
        <p
          :class="[tab.name === currentTab? 'text-navy text-highlight': 'text-lighter text-content']"
        >
          {{ tab.name }}
        </p>
      </button>
    </li>
    <li
      v-show="currentTab !== '歷史紀錄'"
      class="cursor-pointer text-navy text-remark underline"
      @click.stop="handlePopup"
    >
      {{ currentTab === 'AI生圖' ? '總生圖剩餘次數':'向量圖剩餘次數' }}
    </li>
    <li
      class="w-6 h-6 absolute right-12"
    >
      <button
        class="w-full h-full"
        @click="logout"
      >
        <BaseSvgIcon
          class="w-full h-full"
          name="logout"
        />
      </button>
    </li>
  </ul>

  <BasePopup
    v-model:isOpenPopup="isOpenPopup"
    :is-like="false"
    :is-cut="false"
    :is-download="false"
    :is-show-close="false"
  >
    <div
      class="relative w-[305px] bg-white rounded-[10px]"
      :class="[currentTab === 'AI生圖' ? 'h-[188px]' : 'h-[264px]']"
    >
      <button
        class="w-6 h-6 absolute rounded-full top-4 right-4"
        @click.stop="isOpenPopup = false"
      >
        <BaseSvgIcon
          class="w-6 h-6"
          name="close"
        />
      </button>
      <div
        v-if="currentTab === 'AI生圖'"
        class="w-full h-full flex flex-col items-center justify-center"
      >
        <h3 class="text-content text-lighter">
          總生圖剩餘次數
        </h3>
        <h4 class="text-title text-blue-sky">
          {{ generateCredit }}次
        </h4>
      </div>
      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center"
      >
        <div class="w-full h-full pt-6 flex flex-col items-center">
          <div class="w-full h-[108px] mb-6 flex flex-col items-center">
            <div class="w-[209px] h-full pb-6 text-center">
              <h3 class="text-content text-lighter">
                目前向量圖剩餘次數
              </h3>
              <h4 class="text-title text-blue-sky mb-[10px]">
                {{ SvgCredit.current }}次
              </h4>
              <p class="text-remark text-lighter">
                （每月依方案固定增加，若即將用完請提前告知）
              </p>
            </div>
          </div>
          <div class="w-full pt-6 text-center border-t border-light">
            <h3 class="text-content text-lighter">
              總共轉向量圖剩餘次數
            </h3>
            <h4 class="text-title text-blue-sky mb-[10px]">
              {{ SvgCredit.total }}次
            </h4>
          </div>
        </div>
      </div>
    </div>
  </BasePopup>
</template>

<script setup lang='ts'>
const { login, userAccount, isShowAlert } = useLogin()
const isShow = ref<boolean>(false)
const { errorMessage, setErrorMessage } = useErrorHandler()
const { notification } = useNotification()
onUnmounted(() => {
  notification.value.isOpen = false
  setErrorMessage(null)
})
</script>

<template>
  <section class="w-[356px] relative pt-16">
    <TheLoginNotification
      :error-message="errorMessage"
      @update-error-msg="setErrorMessage(null)"
    />

    <form class="w-full flex flex-col gap-5">
      <input
        v-model.trim="userAccount.username"
        class="account bg-background rounded-[10px] outline-none w-full h-10 py-2 px-3"
        type="text"
        placeholder="輸入您的帳號"
        @keyup.enter="login"
      >
      <div class="w-full relative">
        <input
          v-model.trim="userAccount.password"
          class="password bg-background rounded-[10px] w-full h-10 py-2 px-3"
          :class="[isShowAlert? 'border border-error':'outline-none']"
          :type="isShow ? 'text' :'password'"
          placeholder="輸入您的密碼"
          @keyup.enter="login"
        >
        <BaseSvgIcon
          v-if="isShow"
          class="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2"
          name="eye_regular_active"
          @click="isShow = !isShow"
        />
        <BaseSvgIcon
          v-else
          class="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2"
          name="eye_regular"
          @click="isShow = !isShow"
        />
      </div>
    </form>
    <Button
      class="mt-[38px]"
      :is-disabled="false"
      @click="login"
    >
      登入
    </Button>
  </section>
</template>

<style scoped>
.account:focus,
.password:focus {
  @apply border-2 border-[#62AAD7] shadow-[0_0px_4px_0px_rgb(98,170,215)];

  outline: 0;
}
</style>

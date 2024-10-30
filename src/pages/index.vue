<script setup lang="ts">

</script>

<template>
  <section class="w-screen h-screen">
    <div class="w-full h-full bg-[url('@/assets/images/background_login.jpg')] bg-cover bg-center bg-no-repeat" />
    <article class="w-[48%] h-full bg-white absolute top-0 flex flex-col items-center justify-center shadow-[rgba(0,0,15,0.5)_15px_0px_30px_0px]">
      <section class="w-[356px] relative">
        <h1 class="overflow-hidden whitespace-nowrap indent-[101%] mb-5">
          曼黛瑪蓮
          <img
            class="w-30 h-9"
            src="@/assets/images/logo.png"
            alt="曼黛瑪蓮"
          >
        </h1>
        <p class="w-[356px] text-primaryTitle text-navy">
          歡迎回來AI構想助手
          請登入您的帳號
        </p>
        <Login />
      </section>
    </article>
  </section>
</template>

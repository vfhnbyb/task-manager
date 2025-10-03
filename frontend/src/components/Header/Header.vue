<template>
  <div class="header">
    <div class="header__text">
      Задания
    </div>

    <div class="header__link">
      <a href="/">
        <UserIcon />
        <span>Иванов И. И.</span>
      </a>
      <a href="/">
        <ExitIcon />
        <span>Выход</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserIcon from "@/components/UI/Icon/User.vue"
import ExitIcon from "@/components/UI/Icon/Exit.vue"
</script>

<style lang="scss">
@use "Header";
</style>

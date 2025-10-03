<template>
  <div class="navigation">
    <router-link class="navigation__logo" to="/">
      <img src="@/assets/img/logo.svg" alt="logo">
    </router-link>

    <div class="navigation__links">
      <template v-for="item in navLinks">
        <div class="navigation__link">
          <router-link active-class="navigation__link--active" :to="item.url">
            <span v-html="item.icon"></span>
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import timeAccountingIcon from "@/assets/img/Navigation/time-accounting.svg?raw"
import systemIcon from "@/assets/img/Navigation/system.svg?raw"
import usersIcon from "@/assets/img/Navigation/users.svg?raw"
import taskIcon from "@/assets/img/Navigation/task.svg?raw"

const navLinks = [
  {
    name: 'Учёт времени',
    icon: timeAccountingIcon,
    url: '/1',
    active: false
  },
  {
    name: 'Системный раздел',
    icon: systemIcon,
    url: '/2',
    active: false
  },
  {
    name: 'Сотрудники',
    icon: usersIcon,
    url: '/3',
    active: false
  },
  {
    name: 'Задания',
    icon: taskIcon,
    url: '/tasks',
    active: true
  }
]
</script>

<style lang="scss">
@use "Navigation";
</style>

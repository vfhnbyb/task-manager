<template>
  <div v-if="breadcrumbs.length > 1" class="breadcrumbs">
    <div class="breadcrumbs__items">
      <template v-for="item in breadcrumbs">
        <div class="breadcrumbs__item">
          <router-link v-if="item.to" :to="item.to">
            <span>{{ item.title }}</span>
          </router-link>
          <span v-else>{{ item.title }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from "vue"

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed((): Breadcrumb[] => {
  const paths = route.path.split('/').filter(path => path)

  const crumbs: Breadcrumb[] = [{ title: 'Главная', to: '/' }]

  let currentPath = ''
  paths.forEach(path => {
    currentPath += `/${path}`

    const routeRecord = router.resolve(currentPath)
    const title = routeRecord.meta.breadcrumb as string ||
        path.charAt(0).toUpperCase() + path.slice(1)

    crumbs.push({
      title,
      to: currentPath
    })
  })

  // Последний элемент не должен быть ссылкой
  if (crumbs.length > 1) {
    crumbs[crumbs.length - 1].to = undefined
  }

  return crumbs
})

</script>

<style lang="scss">
@use "Breadcrumbs";
</style>

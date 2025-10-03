<template>
  <Navigation />
  <Header />
  <Breadcrumbs />

  <RouterView class="main" />

  <ConfirmModalComponent ref="confirmModalRef" />
  <NotificationContainer />
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import Header from "@/components/Header/Header.vue"
import Navigation from "@/components/Navigation/Navigation.vue"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs.vue"
import NotificationContainer from '@/components/NotificationContainer/NotificationContainer.vue'
import type { ConfirmModalType, ModalConfig } from '@/types/modal'

import ConfirmModalComponent from '@/components/Modals/ConfirmModal/ConfirmModal.vue'
import { confirmModalKey } from '@/composables/useModals'

const confirmModalRef = ref<InstanceType<typeof ConfirmModalComponent>>()

onMounted(() => {
  const confirmModal: ConfirmModalType = {
    open: async (config: ModalConfig) => {
      if (confirmModalRef.value) {
        return await confirmModalRef.value.open(config)
      }
      return false
    }
  }

  provide(confirmModalKey, confirmModal)
})
</script>

<style scoped>

</style>

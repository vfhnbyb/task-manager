<template>
  <div class="notifications-container">
    <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `notification--${notification.type}`]"
        @click="removeNotification(notification.id)"
    >
      <div class="notification__content">
        <span class="notification__message">{{ notification.message }}</span>
        <button class="notification__close" @click.stop="removeNotification(notification.id)">
          &times;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const { notifications, removeNotification } = notificationStore
</script>

<style lang="scss">
@use "NotificationContainer";
</style>

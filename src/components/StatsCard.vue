<template>
  <div class="stat-card">
    <div class="stat-card-header">
      <div class="stat-card-icon">{{ icon }}</div>
    </div>
    <div class="stat-card-value">{{ formattedValue }}</div>
    <div class="stat-card-label">{{ label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  icon: { type: String, default: '📊' },
  value: { type: Number, default: 0 },
  label: { type: String, default: 'Stat' }
})
const formattedValue = computed(() => {
  if (props.value >= 1000000) return (props.value / 1000000).toFixed(1) + 'M'
  if (props.value >= 1000) return (props.value / 1000).toFixed(1) + 'K'
  return props.value.toLocaleString()
})
</script>

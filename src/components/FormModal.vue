<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="modal-close" @click="$emit('close')">&times;</button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="modal-body">
          <div v-for="field in fields" :key="field.key" class="form-group">
            <label class="form-label">{{ field.label }}<span v-if="field.required" class="required">*</span></label>
            <input
              v-if="field.type !== 'textarea' && field.type !== 'checkbox' && field.type !== 'select'"
              :type="field.type || 'text'"
              class="form-input"
              v-model="formData[field.key]"
              :placeholder="field.placeholder"
              :required="field.required"
            />
            <textarea
              v-else-if="field.type === 'textarea'"
              class="form-input form-textarea"
              v-model="formData[field.key]"
              :placeholder="field.placeholder"
              :required="field.required"
              rows="3"
            ></textarea>
            <select
              v-else-if="field.type === 'select'"
              class="form-input"
              v-model="formData[field.key]"
              :required="field.required"
            >
              <option value="">Select {{ field.label }}</option>
              <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <label v-else-if="field.type === 'checkbox'" class="checkbox-label">
              <input type="checkbox" v-model="formData[field.key]" />
              {{ field.checkboxLabel || field.label }}
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  fields: { type: Array, required: true },
  initialData: { type: Object, default: () => ({}) },
  isEdit: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'submit'])

const formData = reactive({})

onMounted(() => {
  props.fields.forEach(field => {
    formData[field.key] = props.initialData[field.key] ?? field.default ?? ''
  })
})

watch(() => props.initialData, (newData) => {
  props.fields.forEach(field => {
    formData[field.key] = newData[field.key] ?? field.default ?? ''
  })
}, { deep: true })

function handleSubmit() {
  emit('submit', { ...formData })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-close:hover {
  color: var(--danger);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.required {
  color: var(--danger);
  margin-left: 4px;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}
</style>

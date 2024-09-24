<script>
export default {
  props: {
    node: {
      type: Object,
      required: true
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  methods: {
    getKeys(obj) {
      return typeof obj === 'object' ? Object.keys(obj) : [];
    },
    onChange(event) {
      const newValue = event.target.value;
      this.$emit('update:modelValue', newValue);
    },
    onChildInput(val) {
      const newValue = this.currentKey ? `${this.currentKey}.${val}` : val;
      this.$emit('update:modelValue', newValue);
    }
  },
  computed: {
    restPath() {
      return this.modelValue ? this.modelValue.split('.').slice(1).join('.') : '';
    },
    currentKey() {
      return this.modelValue ? this.modelValue.split('.')[0] : '';
    },
    hasValidChildren() {
      const target = this.node && this.currentKey ? this.node[this.currentKey] : null;
      return target && typeof target === 'object' && !Array.isArray(target) && Object.keys(target).length > 0;
    }
  }
};
</script>

<template>
  <div class="prop-path-selector">
    <select :value="currentKey" @change="onChange">
      <option value="">(Wurzel)</option>
      <option v-for="key in getKeys(node)" :key="key" :value="key">{{ key }}</option>
    </select>
    <PropPathSelector v-if="hasValidChildren" :node="node[currentKey]" :modelValue="restPath"
      @update:modelValue="onChildInput" />
  </div>
</template>

<style scoped>
.prop-path-selector {
  display: inline-flex;
  align-items: center;
}

.prop-path-selector select {
  cursor: pointer;
  margin: 0;
  border: unset;
  background-color: unset;
}
</style>

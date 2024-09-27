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
    },
    rootNodeLabel: {
      type: String,
      default: '(Wurzel)'
    }
  },
  data() {
    return {
      dropDownOpen: false,
    };
  },
  emits: ['update:modelValue'],
  methods: {
    toggleDropdown() {
      this.dropDownOpen = !this.dropDownOpen;
      if (this.dropDownOpen) {
        document.addEventListener('click', this.handleClickOutside);
      } else {
        document.removeEventListener('click', this.handleClickOutside);
      }
    },
    handleClickOutside(event) {
      const dropdown = this.$el.querySelector('.prop-path-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        this.dropDownOpen = false;
        document.removeEventListener('click', this.handleClickOutside);
      }
    },
    getKeys(obj) {
      return typeof obj === 'object' ? Object.keys(obj) : [];
    },
    onChange(newValue) {
      this.dropDownOpen = false;
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
      return target && typeof target === 'object' && Object.keys(target).length > 0;
    },
    iconClass() {
      if (this.dropDownOpen) return "bi bi-caret-left-fill";
      if (!this.hasValidChildren) return "";
      if (this.modelValue) return "bi bi-arrow-right-short";
      return "";
    }
  }
};
</script>

<template>
  <div class="prop-path-selector">
    <div class="prop-path-dropdown">
      <button @click="toggleDropdown" class="prop-path-dropdown-button">
        <span>{{ currentKey || rootNodeLabel }}</span>
        <i :class="iconClass"></i>
      </button>
      <ul v-if="dropDownOpen" class="prop-path-dropdown-list">
        <li @click="onChange('')">{{ rootNodeLabel }}</li>
        <li v-for="key in getKeys(node)" :key="key" @click="onChange(key)">
          {{ key }}
        </li>
      </ul>
    </div>
    <PropPathSelector
      v-if="hasValidChildren"
      :node="node[currentKey]"
      :modelValue="restPath"
      @update:modelValue="onChildInput"
    />
  </div>
</template>

<style lang="scss" scoped>
  .prop-path-selector {
    position: relative;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;

    button.prop-path-dropdown-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .25rem;
      border: none;
      background-color: white;
      padding: 0;

      span {
        text-decoration: underline;
      }

      i {
        display: flex;
        transition: transform 0.2s;
      }
    }

    ul.prop-path-dropdown-list {
      position: absolute;
      z-index: 1000;
      background-color: white;
      border-radius: 5px;
      border: 1px solid #e8e8e8;
      padding-left: 0;
      list-style: none;

      li {
        cursor: pointer;
        padding: .25rem .25rem .25rem 1rem;

        &:hover {
          background-color: var(--bs-primary);
        }
      }
    }
  }
</style>

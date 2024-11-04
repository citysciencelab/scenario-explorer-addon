<script>
  import Slider from '@vueform/slider';
  import isEqual from "lodash/isEqual";

  export default {
    components: {
      Slider,
    },
    props: {
      modelValue: {
        type: Array,
        default: () => [0, 100]
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
    },
    data() {
      return {
        internalValue: [...this.modelValue],
      }
    },
    watch: {
      modelValue(newValue) {
        if (isEqual(newValue, this.internalValue)) return;
        this.internalValue = [...newValue];
      },
      internalValue(newValue) {
        if (isEqual(newValue, this.modelValue)) return;
        this.$emit('update:modelValue', newValue);
      }
    },
    emits: ['update:modelValue'],
  }
</script>

<template>
  <div class="range-slider">
    <input
      type="number"
      class="form-control"
      v-model="internalValue[0]"
      :min="min"
    />
    <Slider
      v-model="internalValue"
      showTooltip="drag"
      :min="min"
      :max="max"
    />
    <input
      type="number"
      class="form-control"
      v-model="internalValue[1]"
      :max="max"
    />
  </div>
</template>

<style lang="scss">
  @import "@vueform/slider/themes/default.css";

  .range-slider {
    display: flex;
    align-items: center;
    gap: 1em;

    .slider-target {
      flex: 1;
    }

    input[type="number"] {
      width: 3em;
      padding: 0;
      text-align: center;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }
  }
</style>

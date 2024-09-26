<script>
export default {
  name: "LoadingMask",
  props: {
    label: {
      type: String,
      default: ""
    }
  }
};
</script>

<template>
  <div class="loading-mask">
    <div class="spinner"></div>
    <div v-if="label" class="loading-label">{{ label }}</div>
  </div>
</template>

<style scoped>
  .loading-mask {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s infinite linear;
  }

  .loading-label {
    margin-top: 15px;
    color: white;
    font-size: 16px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>

<script>
export default {
  name: 'TutorialPage',
  props: {
    tutorialTitle: String,
    sectionTitle: String,
    sections: Array,
    hintsTitle: String,
    hints: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<template>
    <div class="tutorial-page">
      <div class="segment-header bold">
        {{ tutorialTitle }}
      </div>
      <div class="segment-header">
        {{ sectionTitle }}
      </div>
  
      <div v-for="(section, index) in sections" :key="index">
        <p v-if="section.type === 'text'" v-html="section.content"></p>
        <img v-if="section.type === 'image'" :src="section.src" :alt="section.alt" class="tutorial-image">
      </div>
  
      <div v-if="hints && hints.length > 0">
        <div class="segment-header">
          {{ hintsTitle }}
        </div>
        <hr class="section-divider" />
        <p v-for="(hint, index) in hints" :key="index">
          {{ hint }}
        </p>
      </div>
    </div>
  </template>
  
  <style lang="scss">
  .tutorial-page {
    padding: 20px;
  }
  
  .section-divider {
    border: none;
    height: 2px;
    background-color: var(--bs-gray-700);
    width: 100%;
    margin: 0 0 10px 0;
  }
  
  .segment-header {
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
    padding-bottom: 5px;
    margin-top: 20px;
    margin-bottom: 0;
  
    &.bold {
      font-weight: bold;
    }
  }
  
  .tutorial-image {
    width: 100%;
    height: auto;
    max-width: 100%;
    object-fit: contain;
    margin: 25px 0px;
  }
  </style>
  
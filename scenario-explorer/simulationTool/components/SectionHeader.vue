<script>
export default {
    name: "SectionHeader",
    props: {
      title: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: false
      }
    }
}
</script>

<template>
  <v-sheet rounded color="#ffffff">
  <header class="section-header">
    <i
      v-if="icon"
      class="bi"
      :class="icon"
    ></i>
    <h3>{{ title }}</h3>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
  </header>
</v-sheet>
</template>

<style scoped>
  header {
    display: flex;
    align-items: center;
    font-size: 1.75rem;
    padding: .5rem;
    margin-bottom: 2rem;

    i {
      margin-right: .75rem;
    }

    h3 {
      flex: 1;
      margin-bottom: 2px
    }
  }

  .actions {
    display: flex;
    gap: 8px;
  }
</style>

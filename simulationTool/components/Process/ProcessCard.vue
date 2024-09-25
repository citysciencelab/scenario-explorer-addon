<script>
export default {
    name: "ProcessCard",
    props: {
        "process": {
            type: Object,
            required: true
        }
    },
    emits: [
      "selected",
      "tag-clicked"
    ],
    methods: {
        getProcessLink (process) {
            const link = process?.links?.find(({rel}) => rel === "about");
            return link ? link.href : "";
        },
        getProcessImageSource (process) {
            const image = process?.links?.find(({type}) => type === "image");
            return image ? image : "resources/img/DALLE_Placeholder2.png";
        }
    }
};
</script>

<template>
  <div class="process-card card" style="width: 18rem;">
      <img
        class="card-img-top"
        :src="getProcessImageSource(process)"
        :alt="process.title + ' image'"
      >
      <div class="card-body">
          <h5 class="card-title">
            {{process.title}}
          </h5>
          <h6 class="card-subtitle mb-2 text-muted">
            Version {{process.version}}
          </h6>
          <p class="card-text">
            {{process.description}}
          </p>
          <div class="keywords">
              <span
                class="tag"
                v-for="keyword in process.keywords"
                :key="keyword"
                @click="$emit('tag-clicked', keyword)"
              >
                #{{keyword}}
              </span>
          </div>
          <div class="card-buttons">
            <button
              class="btn btn-secondary"
              @click="$emit('selected', { id: process.id, mode: 'process-details'})"
            >
              <i class="bi bi-info-circle-fill">&nbsp;</i>
              {{ $t("additional:modules.tools.simulationTool.additionalInfo") }}
            </button>
            <button
              class="btn btn-primary"
              @click="$emit('selected', { id: process.id, mode: 'job-execution'})"
            >
              <i class="bi bi-rocket">&nbsp;</i>
              {{ $t("additional:modules.tools.simulationTool.simulate") }}
            </button>
          </div>
      </div>
  </div>
</template>

<style lang="scss" scoped>
@import "~variables";
@import "~bootstrap/scss/card";

.process-card {
  width: 100% !important;

  img.card-img-top {
      height: 10rem;
      object-fit: cover;
  }

  .keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;

      .tag {
          cursor: pointer;
          background: var(--bs-gray-200);
          color: var(--bs-dark);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
      }
  }

  .card-body {
    display: flex;
    flex-direction: column;

    .card-text {
      display: -webkit-box;
      line-clamp: 3;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 4.5em;
      line-height: 1.5em;
    }

    .card-buttons {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
  }
}



</style>

<script>
import Chart from './Chart.vue';
import ChartSettings from './ChartSettings.vue';
import { mapGetters } from "vuex";

export default {
  name: "Diagramm",
  components: {
    Chart,
    ChartSettings
  },
  data() {
    return {
      data: [],
      type: 'bar',
      xProp: '',
      yProp: '',
      rootProp: '',
      activePanel: 'settings'
    };
  },
  methods: {
    togglePanel() {
      this.activePanel = this.activePanel === 'settings' ? 'chart' : 'settings';
    }
  },
  computed: {
    ...mapGetters("Modules/SimulationTool", ["jobResultData"]),
    chartConfigIsValid() {
      return this.xProp && this.yProp && this.rootProp && this.jobResultData;
    },
    validationMessage() {
      if (!this.chartConfigIsValid) {
        return this.$t('additional:modules.tools.simulationTool.inValidChartConfig');
      }
      return '';
    }
  }
};
</script>

<template>
  <div class="toolbar">
    <i
      v-if="validationMessage"
      class="bi bi-exclamation-triangle-fill"
      :title="validationMessage"
    ></i>
    <button
      class="btn btn-primary btn-sm"
      :disabled="!chartConfigIsValid && activePanel === 'settings'"
      :title="activePanel === 'settings'
        ? $t('additional:modules.tools.simulationTool.showChart')
        : $t('additional:modules.tools.simulationTool.settings')
      "
      @click="togglePanel"
    >
      <i v-if="activePanel === 'settings'" class="bi bi-graph-up"></i>
      <i v-if="activePanel === 'chart'" class="bi bi-gear-fill"></i>
    </button>
  </div>
  <div class="panel">
    <Chart
      v-if="activePanel === 'chart'"
      :type="type"
      :rootProp="rootProp"
      :xProp="xProp"
      :yProp="yProp"
    />
    <ChartSettings
        v-if="activePanel === 'settings'"
        v-model:type="type"
        v-model:root-prop="rootProp"
        v-model:xProp="xProp"
        v-model:yProp="yProp"
    />
  </div>
</template>

<style lang="scss" scoped>
  .toolbar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 2rem;

    .bi.bi-exclamation-triangle-fill {
      color: red;
    }
  }
</style>

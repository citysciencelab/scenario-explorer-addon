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
      chartConfigs: {
        // jobId: { xProp: '', yProp: '', rootProp: '' }
      },
      activePanel: 'settings'
    };
  },
  watch: {
    jobResultData: {
      // get configured graph properties from providers
      handler(newValue) {
        const jobIds = Object.keys(newValue);
        const jobs = this.jobs;
        const providers = this.providers;
        for (const jobId of jobIds) {
          if (!this.chartConfigs[jobId]) {
            this.chartConfigs[jobId] = { xProp: '', yProp: '', rootProp: '' };
          }
          const job = jobs.find(job => job.jobID === jobId);
          if (!job) continue;
          const [serverName, processName] = job.processID.split(":");
          const config = providers?.[serverName]?.processes?.[processName]?.["graph-properties"];
          if (!config) continue;
          this.chartConfigs[jobId] = {
            xProp: config["x-path"] || '',
            yProp: config["y-path"] || '',
            rootProp: config["root-path"] || ''
          };
        }
      },
      immediate: true
    }
  },
  methods: {
    togglePanel() {
      this.activePanel = this.activePanel === 'settings' ? 'chart' : 'settings';
    },
    chartConfigIsValid(jobId) {
      const jobConfig = this.chartConfigs?.[jobId];
      return jobConfig?.xProp && jobConfig?.yProp && jobConfig?.rootProp;
    },
    atLeastOneChartIsValid() {
      const jobIds = Object.keys(this.jobResultData);
      return jobIds.some(jobId => this.chartConfigIsValid(jobId));
    },
  },
  computed: {
    ...mapGetters("Modules/SimulationTool", ["jobResultData", "providers", "jobs"]),
    validationMessage() {
      if (!this.atLeastOneChartIsValid()) {
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
      :disabled="!atLeastOneChartIsValid && activePanel === 'settings'"
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
      v-model:chartConfigs="chartConfigs"
    />
    <ChartSettings
        v-if="activePanel === 'settings'"
        v-model:chartConfigs="chartConfigs"
        v-model:type="type"
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

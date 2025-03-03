<script>
import PropPathSelector from './PropPathSelector.vue';
import { mapGetters } from "vuex";

export default {
  name: "ChartSettings",
  components: {
    PropPathSelector,
  },
  props: {
    type: {
      type: String,
      default: 'bar',
    },
    chartConfigs: {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters("Modules/SimulationTool", ["jobResultData", "jobs"])
  },
  methods: {
    getValue(obj, prop) {
      try {
        return prop.split('.').reduce((acc, prop) => acc[prop], obj);
      } catch {
        return undefined;
      }
    },
    getName(jobId) {
      const job = this.jobs.find(job => job.jobID === jobId);
      return job ? job.name : jobId;
    },
    getDataNode(jobId) {
      if (!this.chartConfigs[jobId]?.rootProp) {
        return this.jobResultData[jobId];
      }
      return this.getValue(this.jobResultData[jobId], this.chartConfigs[jobId].rootProp + '.0')
    },
    updateChartConfigs: function(jobId, prop, value) {
      this.$emit('update:chartConfigs', {
        ...this.chartConfigs,
        [jobId]: {
          ...this.chartConfigs[jobId],
          [prop]: value
        }
      });
    }
  },
};
</script>

<template>
  <div class="settings">
    <div class="input-wrapper">
      <label>{{ $t('additional:modules.tools.simulationTool.chartType') }}</label>
      <select
        :value="this.type"
        @change="$emit('update:type', $event.target.value)"
      >
        <option value="line">{{ $t('additional:modules.tools.simulationTool.chart-line') }}</option>
        <option value="bar">{{ $t('additional:modules.tools.simulationTool.chart-bar') }}</option>
      </select>
    </div>
    <template v-for="(value, jobId) in this.jobResultData" :key="jobId">
      <span>{{ this.getName(jobId) }}</span>
      <div class="input-wrapper prop-path-wrapper">
        <label>{{ $t('additional:modules.tools.simulationTool.chartDataRootProperty') }}</label>
        <PropPathSelector
          :modelValue="this.chartConfigs?.[jobId]?.rootProp || ''"
          @update:modelValue="(value) => updateChartConfigs(jobId, 'rootProp', value)"
          :node="this.jobResultData[jobId]"
        />
      </div>
      <div class="input-wrapper prop-path-wrapper" v-if="this.getDataNode(jobId)">
        <label>{{ $t('additional:modules.tools.simulationTool.chartDataXProperty') }}</label>
        <PropPathSelector
          :modelValue="this.chartConfigs?.[jobId]?.xProp || ''"
          @update:modelValue="(value) => updateChartConfigs(jobId, 'xProp', value)"
          :node="this.getDataNode(jobId)"
        />
      </div>
      <div class="input-wrapper prop-path-wrapper" v-if="this.getDataNode(jobId)">
        <label>{{ $t('additional:modules.tools.simulationTool.chartDataYProperty') }}</label>
        <PropPathSelector
          :modelValue="this.chartConfigs?.[jobId]?.yProp || ''"
          @update:modelValue="(value) => updateChartConfigs(jobId, 'yProp', value)"
          :node="this.getDataNode(jobId)"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  label {
    font-weight: 600;
    margin-bottom: 5px;
  }

  select,
  input[type="text"],
  input[type="checkbox"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.3s ease;

    &:focus {
      border-color: #888;
      outline: none;
      box-shadow: var(--bs-box-shadow);
    }
  }

  div.input-wrapper {
    display: flex;
    flex-direction: column;

    &.prop-path-wrapper {
      display: flex;
      flex-direction: row;

      label {
        margin: 0 0.5em 0 0;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  select {
    cursor: pointer;

    &:hover {
      border-color: #888;
    }
  }

  input[type="checkbox"] {
    align-self: flex-start;
  }

  .PropPathSelector {
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
  }
}
</style>

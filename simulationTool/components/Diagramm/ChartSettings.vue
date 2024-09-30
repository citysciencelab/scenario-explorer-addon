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
    xProp: {
      type: String,
      default: '',
    },
    yProp: {
      type: String,
      default: '',
    },
    rootProp: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      localType: this.type,
      localXProp: this.xProp,
      localYProp: this.yProp,
      localRootProp: this.rootProp
    };
  },
  computed: {
    ...mapGetters("Modules/SimulationTool", ["jobResultData"]),
    dataNode() {
      return this.getValue(this.jobResultData, this.localRootProp + '.0')
    }
  },
  methods: {
    getValue(obj, prop) {
      try {
        return prop.split('.').reduce((acc, prop) => acc[prop], obj);
      } catch {
        return undefined;
      }
    }
  },
  watch: {
    localType(newVal) {
      this.$emit('update:type', newVal);
    },
    localXProp(newVal) {
      this.$emit('update:xProp', newVal);
    },
    localYProp(newVal) {
      this.$emit('update:yProp', newVal);
    },
    localRootProp(newVal) {
      this.$emit('update:rootProp', newVal);
    }
  }
};
</script>

<template>
  <div class="settings">
    <div class="input-wrapper">
      <label>{{ $t('additional:modules.tools.simulationTool.chartType') }}</label>
      <select v-model="localType">
        <option value="line">{{ $t('additional:modules.tools.simulationTool.chart-line') }}</option>
        <option value="bar">{{ $t('additional:modules.tools.simulationTool.chart-bar') }}</option>
      </select>
    </div>
    <div class="input-wrapper">
      <label>{{ $t('additional:modules.tools.simulationTool.chartDataRootProperty') }}</label>
      <PropPathSelector
        v-if="this.jobResultData"
        v-model="localRootProp"
        :node="this.jobResultData"
      />
    </div>
    <div class="input-wrapper" v-if="this.dataNode">
      <label>{{ $t('additional:modules.tools.simulationTool.chartDataXProperty') }}</label>
      <PropPathSelector
        v-model="localXProp"
        :node="this.dataNode"
      />
    </div>
    <div class="input-wrapper" v-if="this.dataNode">
      <label>{{ $t('additional:modules.tools.simulationTool.chartDataYProperty') }}</label>
      <PropPathSelector
        v-model="localYProp"
        :node="this.dataNode"
      />
    </div>
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
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
  }

  div.input-wrapper {
    display: flex;
    flex-direction: column;

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

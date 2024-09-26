<script>
import Plotly from 'plotly.js-dist';
import { mapGetters } from "vuex";

export default {
  props: {
    type: {
      type: String,
      default: 'bar'
    },
    rootProp: {
      type: String,
      default: 'features'
    },
    xProp: {
      type: String,
      required: 'true'
    },
    yProp: {
      type: String
    }
  },
  watch: {
    jobResultData: {
      handler() {
        this.drawChart();
      },
      deep: true,
      immediate: true
    },
    type() {
      this.drawChart();
    }
  },
  methods: {
    drawChart() {
      if (!this.$refs.plotlyChart) {
        return;
      }
      const config = {
        displayModeBar: false,
      };
      const plotlyData = this.getPlotlyData();
      const layout = this.guessLayoutByData();
      Plotly.newPlot(this.$refs.plotlyChart, plotlyData, layout, config);
    },
    guessLayoutByData() {
      return {
        xaxis: {
          title: this.xProp.split('.').pop()
        },
        yaxis: {
          title: this.yProp.split('.').pop()
        }
      };
    },
    getValue(obj, prop) {
      return prop.split('.').reduce((acc, prop) => acc[prop], obj);
    },
    getPlotlyData() {
      if (!this.jobResultData) {
        return [];
      }

      const root = this.getValue(this.jobResultData, this.rootProp);

      if (!Array.isArray(root)) {
        return [];
      }

      const x = root.map(item => Number(this.getValue(item, this.xProp)));
      const y = this.yProp ? root.map(item => Number(this.getValue(item, this.yProp))) : undefined;

      // Currently only one trace supported
      const unsortedTrace = [{
        x,
        y,
        type: this.type
      }];

      return unsortedTrace.map(trace => {
        const sortedIndices = x
          .map((value, index) => ({ value, index }))
          .sort((a, b) => a.value - b.value)
          .map(({ index }) => index);

        return {
          x: sortedIndices.map(i => x[i]),
          y: y ? sortedIndices.map(i => y[i]) : undefined,
          type: trace.type
        };
      });

    }
  },
  mounted() {
    this.drawChart(this.chartData);
  },
  computed: {
    ...mapGetters("Modules/SimulationTool", ["jobResultData"]),
  },
};

</script>

<template>
  <div ref="plotlyChart" style="width: 100%; height: 400px;"></div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>

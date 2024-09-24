<script>
import Plotly from 'plotly.js-dist';
import { mapGetters } from "vuex";

export default {
  props: {
    type: {
      type: String,
      default: 'bar'
    },
    // rootProp: {
    //   type: String,
    //   default: 'features'
    // },
    xProp: {
      type: String,
      required: 'true'
    },
    yProp: {
      type: String
    },
    sort: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // Todo: adjust getValue so we can remove the rootProp here
      rootProp: 'results.results.features.0.properties.result'
    };
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

      if (this.sort) {
        this.jobResultData.sort((a, b) => this.getValue(a, this.xProp) - this.getValue(b, this.xProp));
      }

      const root = this.getValue(this.jobResultData, this.rootProp);

      if (!root) {
        return [];
      };

      const x = root.map(item => Number(this.getValue(item, this.xProp)));
      const y = this.yProp ? root.map(item => Number(this.getValue(item, this.yProp))) : undefined;

      const unsortedTrace = [{
        x,
        y,
        type: this.type
      }];

      if (!this.sort) {
        return unsortedTrace;
      }

      return unsortedTrace.map(trace => {
        const indices = x.map((value, index) => index);
        indices.sort((a, b) => x[a] - x[b]);
        return {
          x: indices.map(index => x[index]),
          y: y ? indices.map(index => y[index]) : undefined,
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

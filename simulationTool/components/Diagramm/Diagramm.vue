<script>
import Chart from './Chart.vue';
import { mapGetters } from "vuex";

export default {
  components: {
    Chart
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
    sort: {
      type: Boolean,
      default: false,
    },
    rootProp: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: [],
    };
  },
  computed: {
    ...mapGetters("Modules/SimulationTool", ["jobResultData"]),
  }
};
</script>

<template>
  <div class="graph">
    <Chart :data="this.jobResultData" :type="type" :x-prop="xProp" :y-prop="yProp" :sort="sort" :root-prop="rootProp" />
  </div>
</template>

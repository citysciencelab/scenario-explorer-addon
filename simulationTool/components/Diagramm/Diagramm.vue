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
  watch: {
    jobResultData: {
      handler(newData) {
        if (newData && newData.length > 0) {
          console.log('Daten wurden geladen:', newData);
        }
      },
      immediate: true,
    }
  },
  computed: {
    ...mapGetters("Modules/SimulationTool", ["jobResultData"]),
  }
};
</script>

<template>
  <div class="graph">
    <Chart v-if="this.jobResultData" :data="this.jobResultData" :type="type" :xProp="xProp" :yProp="yProp"
      :rootProp="rootProp" />
  </div>
</template>

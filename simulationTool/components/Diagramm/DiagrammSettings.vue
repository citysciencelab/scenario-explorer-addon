<script>
import PropPathSelector from './PropPathSelector.vue';
import { mapGetters } from "vuex";

export default {
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
    sort: {
      type: Boolean,
      default: false,
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
      localSort: this.sort,
      localRootProp: this.rootProp
    };
  },
  computed: {
        ...mapGetters("Modules/SimulationTool", ["jobResultData"]),
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
    localSort(newVal) {
      this.$emit('update:sort', newVal);
    },
    localRootProp(newVal) {
      this.$emit('update:rootProp', newVal);
    },
    jobResultData(newVal) {
      console.log('Fritz:', newVal)
    }
  }
};
</script>

<template>
  <div class="settings">
    <div>
      <label>Diagrammtyp:</label>
      <select v-model="localType">
        <option value="line">Liniendiagramm</option>
        <option value="bar">Balkendiagramm</option>
      </select>
    </div>
    <div>
      <label>x prop:</label>
      <input v-model="localXProp" />
    </div>
    <div>
      <label>y prop:</label>
      <input v-model="localYProp" />
    </div>
    <div>
      <label>sortieren:</label>
      <input type="checkbox" v-model="localSort" />
    </div>
    <div>
      <label>Root Prop:</label>
      <PropPathSelector v-if="this.jobResultData" v-model="localRootProp" :node="this.jobResultData" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;

  label {
    font-weight: 600;
    margin-bottom: 5px;
  }

  select, input[type="text"], input[type="checkbox"] {
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

  input[type="checkbox"] {
    width: auto;
    margin-right: 10px;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;

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
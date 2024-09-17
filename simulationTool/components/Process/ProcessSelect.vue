<script>
import { mapGetters } from "vuex";
import Multiselect from "vue-multiselect";

export default {
    name: "ProcessSelect",
    components: {
        Multiselect
    },
    props: {
        modelValue: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapGetters({
            processes: 'Modules/SimulationTool/processes'
        })
    },
    methods: {
        handleInputChange(value) {
            this.$emit('update:modelValue', value);
        },
        labelFunction(process) {
            return `${process.title} v${process.version} (${process.id})`;
        }
    },
    emits: ["update:modelValue"]
};
</script>

<template>
    <div class="process-list">
        <multiselect
            :modelValue="modelValue"
            placeholder="Nach Modellen suchen ..."
            aria-label="Nach Modellen suchen..."
            track-by="id"
            :custom-label="labelFunction"
            @update:modelValue="handleInputChange"
            :options="this.processes"
            :multiple="true"
        />
    </div>
</template>

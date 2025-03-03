<script>
import Multiselect from "vue-multiselect";

export default {
    name: "JobSelect",
    components: {
        Multiselect
    },
    props: {
        modelValue: {
            type: Array,
            default: () => []
        },
        filteredJobs: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        handleInputChange(value) {
            this.$emit('update:modelValue', value);
        },
        labelFunction(job) {
            return `${job.name} v${job.process_version} (${job.process_title})`;
        }
    },
    emits: ["update:modelValue"]
};
</script>

<template>
    <div class="job-list">
        <multiselect
            :modelValue="modelValue"
            :placeholder="$t('additional:modules.tools.simulationTool.searchJobs') + '...'"
            :aria-label="$t('additional:modules.tools.simulationTool.searchJobs') + '...'"
            track-by="jobID"
            :custom-label="labelFunction"
            @update:modelValue="handleInputChange"
            :options="this.filteredJobs"
            :multiple="true"
        />
    </div>
</template>

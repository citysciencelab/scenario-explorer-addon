<script>
import { mapMutations } from "vuex";
import SectionHeader from "../SectionHeader.vue";

export default {
    name: "JobExecution",
    components: {
        SectionHeader
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode"
        ])
    }
};
</script>

<template>
    <div class="job-execution">
        <SectionHeader title="Neues Szenario" icon="bi-box-fill" />
    </div>

</template>

<style lang="scss" scoped>
</style>

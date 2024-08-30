<script>
import { mapMutations } from "vuex";
import SectionHeader from "../SectionHeader.vue";

export default {
    name: "JobDetails",
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
    <div class="job-details">
        <SectionHeader title="Szenario Details" icon="bi-box-fill" />
    </div>

</template>

<style lang="scss" scoped>
</style>

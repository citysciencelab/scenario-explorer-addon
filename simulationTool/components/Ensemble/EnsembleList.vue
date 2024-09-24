<script>
import { mapMutations } from "vuex";
import SectionHeader from "../SectionHeader.vue";

export default {
    name: "EnsembleList",
    components: {
        SectionHeader
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode",
            "setSelectedJobId"
        ])
    }
}
</script>

<template>
    <div class="ensemble-list">
        <SectionHeader title="Ensembles" icon="bi-collection-fill">
            <template #actions>
                <button
                    class="btn btn-primary"
                    @click="() => this.setMode('ensemble-execution')"
                >
                    <i class="bi bi-plus-lg">&nbsp;</i>
                    <span>Neues Ensemble</span>
                </button>
            </template>
        </SectionHeader>
    </div>
</template>

<style lang="scss" scoped>
    .ensemble-list {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>

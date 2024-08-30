<script>
import SectionHeader from "../SectionHeader.vue";

export default {
    name: "EnsembleList",
    components: {
        SectionHeader
    }
}
</script>

<template>
    <div class="job-list">
        <SectionHeader title="Ensembles" icon="bi-collection-fill" />
    </div>
</template>

<style lang="scss" scoped>
    .ensemble-list {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>

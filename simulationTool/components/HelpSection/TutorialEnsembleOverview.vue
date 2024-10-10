<script>
import TutorialEnsembleOverview from '../../resources/img/TutorialEnsembleOverview.png'

export default {
    name: "TutorialEnsembleOverview",
    data() {
        return {
            TutorialEnsembleOverview
        }
    }
};
</script>

<template>
    <div class="tutorial-page">
        <div class="segment-header bold">
            {{ $t('additional:modules.tools.simulationTool.tutorial') }}
        </div>
        <div class="segment-header">
            {{ $t('additional:modules.tools.simulationTool.ensembleOverview') }}
        </div>
        <p>
            {{ $t('additional:modules.tools.simulationTool.ensembleOverviewContent') }}
        </p>
        <img :src="TutorialEnsembleOverview" alt="TutorialEnsembleOverview" class="tutorial-image">
        <div class="segment-header">
            {{ $t('additional:modules.tools.simulationTool.hints') }}
        </div>
        <hr class="section-divider" />
        <p>
            {{ $t('additional:modules.tools.simulationTool.ensembleOverviewHint') }}
        </p>
    </div>
</template>

<style lang="scss" scoped>

.section-divider {
    border: none;
    height: 2px;
    background-color: var(--bs-gray-700);
    width: 100%;
    margin: 0 0 10px 0;
}

.segment-header {
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
    padding-bottom: 5px;
    margin-top: 20px;
    margin-bottom: 0;

    &.bold {
        font-weight: bold;
    }
}

.tutorial-image {
    width: 100%;
    height: auto;
    max-width: 100%;
    object-fit: contain;
}
</style>

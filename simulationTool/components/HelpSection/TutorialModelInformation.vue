<script>
import TutorialModelInformation from '../../resources/img/TutorialModelInformation.png'

export default {
    name: "TutorialModelInformation",
    data() {
        return {
            TutorialModelInformation
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
            {{ $t('additional:modules.tools.simulationTool.modelInformation') }}
        </div>
        <p v-html="$t('additional:modules.tools.simulationTool.modelInformationContent')">
        </p>
        <img :src="TutorialModelInformation" alt="TutorialModelInformation" class="tutorial-image">
        <div class="segment-header">
            {{ $t('additional:modules.tools.simulationTool.hints') }}
        </div>
        <hr class="section-divider" />
        <p>
            {{ $t('additional:modules.tools.simulationTool.modelInformationHint') }}
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

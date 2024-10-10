<script>
import TutorialCreateEnsemble1 from '../../resources/img/TutorialCreateEnsemble1.png'
import TutorialCreateEnsemble2 from '../../resources/img/TutorialCreateEnsemble2.png'
import TutorialCreateEnsemble3 from '../../resources/img/TutorialCreateEnsemble3.png'

export default {
    name: "TutorialCreateEnsemble",
    data() {
        return {
            TutorialCreateEnsemble1,
            TutorialCreateEnsemble2,
            TutorialCreateEnsemble3
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
            {{ $t('additional:modules.tools.simulationTool.createEnsemble') }}
        </div>
        <p>
            {{ $t('additional:modules.tools.simulationTool.createEnsembleContent') }}
        </p>
        <img :src="TutorialCreateEnsemble1" alt="TutorialCreateEnsemble1" class="tutorial-image">
        <p>
            {{ $t('additional:modules.tools.simulationTool.createEnsembleContent2') }}
        </p>
        <img :src="TutorialCreateEnsemble2" alt="TutorialCreateEnsemble2" class="tutorial-image">
        <p>
            {{ $t('additional:modules.tools.simulationTool.createEnsembleContent3') }}
        </p>
        <img :src="TutorialCreateEnsemble3" alt="TutorialCreateEnsemble3" class="tutorial-image">
        <div class="segment-header">
            {{ $t('additional:modules.tools.simulationTool.hints') }}
        </div>
        <hr class="section-divider" />
        <p>
            {{ $t('additional:modules.tools.simulationTool.createEnsembleHint') }}
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
    margin: 25px 0px
}
</style>

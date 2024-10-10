<script>
import TutorialLandingPage from '../../resources/img/TutorialLandingPage.png'

export default {
    name: "TutorialLandingPage",
    data() {
        return {
            TutorialLandingPage
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
            {{ $t('additional:modules.tools.simulationTool.landingPage') }}
        </div>
        <p>
            {{ $t('additional:modules.tools.simulationTool.landingPageContent') }}
        </p>
        <img :src="TutorialLandingPage" alt="TutorialLandingPage" class="tutorial-image">
    </div>
</template>

<style lang="scss" scoped>

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

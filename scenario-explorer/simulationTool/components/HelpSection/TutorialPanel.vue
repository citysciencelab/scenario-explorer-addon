<script>
import SectionHeader from '../SectionHeader.vue';
import TutorialCreateEnsemble from './TutorialCreateEnsemble.vue';
import TutorialCreateScenario from './TutorialCreateScenario.vue';
import TutorialEnsembleDetails from './TutorialEnsembleDetails.vue';
import TutorialEnsembleOverview from './TutorialEnsembleOverview.vue';
import TutorialLandingPage from './TutorialLandingPage.vue';
import TutorialModelInformation from './TutorialModelInformation.vue';
import TutorialModelOverview from './TutorialModelOverview.vue';
import TutorialScenarioOverview from './TutorialScenarioOverview.vue';
import TutorialSzenarioDetails from './TutorialSzenarioDetails.vue';

export default {
    name: "TutorialPanel",
    components: {
        SectionHeader,
        TutorialLandingPage,
        TutorialModelOverview,
        TutorialModelInformation,
        TutorialScenarioOverview,
        TutorialCreateScenario,
        TutorialSzenarioDetails,
        TutorialEnsembleOverview,
        TutorialEnsembleDetails,
        TutorialCreateEnsemble
    },
    data() {
        return {
            currentIndex: 0,
            views: [
                { name: 'TutorialLandingPage' },
                { name: 'TutorialModelOverview' },
                { name: 'TutorialModelInformation' },
                { name: 'TutorialScenarioOverview' },
                { name: 'TutorialCreateScenario' },
                { name: 'TutorialSzenarioDetails' },
                { name: 'TutorialEnsembleOverview' },
                { name: 'TutorialEnsembleDetails' },
                { name: 'TutorialCreateEnsemble' }
            ]
        };
    },
    methods: {
        nextView() {
            if (this.currentIndex < this.views.length - 1) {
                this.currentIndex++;
            }
        },
        previousView() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            }
        }
    }
};
</script>

<template>
    <div class="tutorial-panel">
        <SectionHeader :title="$t('additional:modules.tools.simulationTool.help')" icon="bi bi-question-circle-fill" />
        <div class="segment-wrapper">
            <div class="element-wrapper">
                <component :is="views[currentIndex].name" />
            </div>
            <div class="navigation-buttons btn-light">
                <button @click="previousView" :disabled="currentIndex === 0" class="arrow-button">
                    <i class="bi bi-chevron-left"></i>
                </button>
                <button @click="nextView" :disabled="currentIndex === views.length - 1" class="arrow-button">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tutorial-panel {
    max-height: 100vh;
    overflow-y: auto;
}

.segment-header {
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
    padding-bottom: 5px;
    margin-bottom: 0;

    &.bold {
        font-weight: bold;
    }
}

.segment-wrapper {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    border: 0px;
    border-radius: 8px;
    box-shadow: var(--bs-box-shadow);
    width: 100%;
    padding: 10px;
    background-color: transparent;
}

.element-wrapper {
    padding: 10px;
}

.navigation-buttons {
    display: flex;
    justify-content: space-between;
    margin: 20px 25vh;

    .arrow-button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        
        i {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: var(--bs-gray-500);
            color: var(--bs-body-bg);
            font-size: 1.5rem;
            font-weight: bold;
            transition: background-color 0.3s;

            &:hover {
                background-color: var(--bs-btn-hover-bg);
            }
        }
        
        &:disabled i {
            background-color: var(--bs-gray-300);
            cursor: not-allowed;
        }
    }
}
</style>

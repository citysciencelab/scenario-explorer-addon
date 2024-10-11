<script>

import SectionHeader from '../SectionHeader.vue';
import { mapMutations } from "vuex";
import FaqItem from './FaqItem.vue';

export default {
    name: "HelpPanel",
    components: {
        SectionHeader,
        FaqItem
    },
    data() {
        return {
            definitions: [
                {
                    question: this.$t('additional:modules.tools.simulationTool.QdigitalSimulation'),
                    answer: this.$t('additional:modules.tools.simulationTool.AdigitalSimulation')
                },
                {
                    question: this.$t('additional:modules.tools.simulationTool.QscenarioJob'),
                    answer: this.$t('additional:modules.tools.simulationTool.AscenarioJob')
                },
                {
                    question: this.$t('additional:modules.tools.simulationTool.QEnsemble'),
                    answer: this.$t('additional:modules.tools.simulationTool.AEnsemble')
                },
                {
                    question: this.$t('additional:modules.tools.simulationTool.Qabm'),
                    answer: this.$t('additional:modules.tools.simulationTool.Aabm')
                },
                {
                    question: this.$t('additional:modules.tools.simulationTool.Qiteration'),
                    answer: this.$t('additional:modules.tools.simulationTool.Aiteration')
                }
            ],
            faqsApplication: [
                {
                    question: this.$t('additional:modules.tools.simulationTool.QgroupEnsemble'),
                    answer: this.$t('additional:modules.tools.simulationTool.AgroupEnsemble')
                },
                {
                    question: this.$t('additional:modules.tools.simulationTool.QdeleteScenario'),
                    answer: this.$t('additional:modules.tools.simulationTool.AdeleteScenario')
                },
                {
                    question: this.$t('additional:modules.tools.simulationTool.QrenameWork'),
                    answer: this.$t('additional:modules.tools.simulationTool.ArenameWork')
                },
                {
                    question: this.$t('additional:modules.tools.simulationTool.QmodifyInsequrities'),
                    answer: this.$t('additional:modules.tools.simulationTool.AmodifyInsequrities')
                },
                {
                    question: this.$t('additional:modules.tools.simulationTool.QoptimalAmount'),
                    answer: this.$t('additional:modules.tools.simulationTool.AoptimalAmount')
                }
            ],
            faqsPrivacy: [
                {
                    question: this.$t('additional:modules.tools.simulationTool.QthirdParties'),
                    answer: this.$t('additional:modules.tools.simulationTool.AthirdParties')
                },
                {
                    question: this.$t('additional:modules.tools.simulationTool.QstoredData'),
                    answer: this.$t('additional:modules.tools.simulationTool.AstoredData')
                },
                {
                    question: this.$t('additional:modules.tools.simulationTool.QsharedData'),
                    answer: this.$t('additional:modules.tools.simulationTool.AsharedData')
                }
            ]
        };
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode"
        ]),
    }
};

</script>

<template>
    <div class="help-panel">
        <SectionHeader :title="$t('additional:modules.tools.simulationTool.help')" icon="bi bi-question-circle-fill" />

        <!-- ToDo: implement Searchbar -->
        <div class="segment-wrapper">
            <div class="segment-wrapper">
                <div class="segment-header bold">
                    {{ $t('additional:modules.tools.simulationTool.tutorial') }}
                </div>
                <button class="segment-wrapper btn-light" @click="this.setMode('tutorial-panel')">
                    <p>{{ $t("additional:modules.tools.simulationTool.tutorialInfo") }}</p>
                    <i class="bi bi-arrow-right-circle-fill"></i>
                </button>
            </div>
            <div class="segment-wrapper">
                <div class="segment-header bold">
                    {{ $t('additional:modules.tools.simulationTool.glossar') }}
                </div>
                {{ $t('additional:modules.tools.simulationTool.definitions') }}
                <FaqItem v-for="(def, index) in definitions" :key="index" :question="def.question"
                    :answer="def.answer" />
            </div>
            <div class="segment-wrapper">
                <div class="segment-header bold">
                    {{ $t('additional:modules.tools.simulationTool.faq') }}
                </div>
                {{ $t('additional:modules.tools.simulationTool.application') }}
                <FaqItem v-for="(faq, index) in faqsApplication" :key="index" :question="faq.question"
                    :answer="faq.answer" />
                {{ $t('additional:modules.tools.simulationTool.privacy') }}
                <FaqItem v-for="(faq, index) in faqsPrivacy" :key="index" :question="faq.question"
                    :answer="faq.answer" />
            </div>
            <div class="segment-wrapper">
                <div class="segment-header bold">
                    {{ $t('additional:modules.tools.simulationTool.contact') }}
                </div>
                <span>
                    {{ $t('additional:modules.tools.simulationTool.contactInfo') }}
                    <a href="mailto:cut@hcu-hamburg.de">cut@hcu-hamburg.de</a>
                    !
                </span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.help-panel {
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
    margin-bottom: 15px;

    button.segment-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        gap: 10px;
        transition: background-color 0.3s ease;
        padding: 10px;

        &:hover {
            background-color: var(--bs-btn-hover-bg);
        }

        p {
            margin: 0;
        }

        i {
            font-size: 1.5rem;
            margin: 0 15px 0 auto;
        }
    }
}

.element-wrapper {
    padding: 10px;
}

.bi-arrow-right-circle-fill {
    color: var(--bs-gray-500)
}
</style>

<script>
import TutorialPage from './TutorialPage.vue';
import TutorialScenarioDetails from '../../resources/img/TutorialScenarioDetails.png';

export default {
  components: { TutorialPage },
  data() {
    return {
        TutorialScenarioDetails
    };
  }
};
</script>

<template>
    <TutorialPage 
      :tutorialTitle="$t('additional:modules.tools.simulationTool.tutorial')"
      :sectionTitle="$t('additional:modules.tools.simulationTool.scenarioDetails')"
      :sections="[
        { type: 'text', content: $t('additional:modules.tools.simulationTool.scenarioDetailsContent') },
        { type: 'image', src: TutorialScenarioDetails, alt: 'TutorialScenarioDetails' },
      ]"
      :hintsTitle="$t('additional:modules.tools.simulationTool.hints')"
      :hints="[
        $t('additional:modules.tools.simulationTool.scenarioDetailsHint')
      ]"
    />
  </template>

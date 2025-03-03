<script>
import TutorialPage from './TutorialPage.vue';
import TutorialScenarioOverview from '../../resources/img/TutorialScenarioOverview.png';

export default {
  components: { TutorialPage },
  data() {
    return {
        TutorialScenarioOverview
    };
  }
};
</script>

<template>
    <TutorialPage 
      :tutorialTitle="$t('additional:modules.tools.simulationTool.tutorial')"
      :sectionTitle="$t('additional:modules.tools.simulationTool.scenarioOverview')"
      :sections="[
        { type: 'text', content: $t('additional:modules.tools.simulationTool.scenarioOverviewContent') },
        { type: 'image', src: TutorialScenarioOverview, alt: 'TutorialScenarioOverview' },
      ]"
      :hintsTitle="$t('additional:modules.tools.simulationTool.hints')"
      :hints="[
        $t('additional:modules.tools.simulationTool.scenarioOverviewHint')
      ]"
    />
  </template>

<script>
import TutorialPage from './TutorialPage.vue';
import TutorialModelOverview from '../../resources/img/TutorialModelOverview.png';

export default {
  components: { TutorialPage },
  data() {
    return {
        TutorialModelOverview
    };
  }
};
</script>

<template>
    <TutorialPage 
      :tutorialTitle="$t('additional:modules.tools.simulationTool.tutorial')"
      :sectionTitle="$t('additional:modules.tools.simulationTool.modelOverview')"
      :sections="[
        { type: 'text', content: $t('additional:modules.tools.simulationTool.modelOverviewContent') },
        { type: 'image', src: TutorialModelOverview, alt: 'TutorialModelOverview' },
      ]"
      :hintsTitle="$t('additional:modules.tools.simulationTool.hints')"
      :hints="[
        $t('additional:modules.tools.simulationTool.modelOverviewHint')
      ]"
    />
  </template>

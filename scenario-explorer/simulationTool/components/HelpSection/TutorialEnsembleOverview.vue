<script>
import TutorialPage from './TutorialPage.vue';
import TutorialEnsembleOverview from '../../resources/img/TutorialEnsembleOverview.png';

export default {
  components: { TutorialPage },
  data() {
    return {
        TutorialEnsembleOverview
    };
  }
};
</script>

<template>
    <TutorialPage 
      :tutorialTitle="$t('additional:modules.tools.simulationTool.tutorial')"
      :sectionTitle="$t('additional:modules.tools.simulationTool.ensembleOverview')"
      :sections="[
        { type: 'text', content: $t('additional:modules.tools.simulationTool.censembleOverviewContent') },
        { type: 'image', src: TutorialEnsembleOverview, alt: 'TutorialEnsembleOverview' },
      ]"
      :hintsTitle="$t('additional:modules.tools.simulationTool.hints')"
      :hints="[
        $t('additional:modules.tools.simulationTool.ensembleOverviewHint')
      ]"
    />
  </template>

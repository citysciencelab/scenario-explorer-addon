<script>
import TutorialPage from './TutorialPage.vue';
import TutorialEnsembleDetails from '../../resources/img/TutorialEnsembleDetails.png';

export default {
  components: { TutorialPage },
  data() {
    return {
        TutorialEnsembleDetails
    };
  }
};
</script>

<template>
    <TutorialPage 
      :tutorialTitle="$t('additional:modules.tools.simulationTool.tutorial')"
      :sectionTitle="$t('additional:modules.tools.simulationTool.ensembleDetails')"
      :sections="[
        { type: 'text', content: $t('additional:modules.tools.simulationTool.ensembleDetailsContent') },
        { type: 'image', src: TutorialEnsembleDetails, alt: 'TutorialEnsembleDetails' },
      ]"
    />
  </template>

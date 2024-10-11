<script>
import TutorialPage from './TutorialPage.vue';
import TutorialModelInformation from '../../resources/img/TutorialModelInformation.png';

export default {
  components: { TutorialPage },
  data() {
    return {
        TutorialModelInformation
    };
  }
};
</script>

<template>
    <TutorialPage 
      :tutorialTitle="$t('additional:modules.tools.simulationTool.tutorial')"
      :sectionTitle="$t('additional:modules.tools.simulationTool.modelInformation')"
      :sections="[
        { type: 'text', content: $t('additional:modules.tools.simulationTool.modelInformationContent') },
        { type: 'image', src: TutorialModelInformation, alt: 'TutorialModelInformation' },
      ]"
      :hintsTitle="$t('additional:modules.tools.simulationTool.hints')"
      :hints="[
        $t('additional:modules.tools.simulationTool.modelInformationHint')
      ]"
    />
  </template>

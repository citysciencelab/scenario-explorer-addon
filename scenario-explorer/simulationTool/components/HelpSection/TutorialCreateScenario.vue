<script>
import TutorialPage from './TutorialPage.vue';
import TutorialCreateScenario from '../../resources/img/TutorialCreateScenario.png';

export default {
  components: { TutorialPage },
  data() {
    return {
        TutorialCreateScenario
    };
  }
};
</script>

<template>
    <TutorialPage 
      :tutorialTitle="$t('additional:modules.tools.simulationTool.tutorial')"
      :sectionTitle="$t('additional:modules.tools.simulationTool.createScenario')"
      :sections="[
        { type: 'text', content: $t('additional:modules.tools.simulationTool.createScenarioContent') },
        { type: 'image', src: TutorialCreateScenario, alt: 'TutorialCreateScenario' },
      ]"
      :hintsTitle="$t('additional:modules.tools.simulationTool.hints')"
      :hints="[
        $t('additional:modules.tools.simulationTool.createEnsembleHint')
      ]"
    />
  </template>

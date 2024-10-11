<script>
import TutorialPage from './TutorialPage.vue';
import TutorialCreateEnsemble1 from '../../resources/img/TutorialCreateEnsemble1.png';
import TutorialCreateEnsemble2 from '../../resources/img/TutorialCreateEnsemble2.png';
import TutorialCreateEnsemble3 from '../../resources/img/TutorialCreateEnsemble3.png';

export default {
  components: { TutorialPage },
  data() {
    return {
      TutorialCreateEnsemble1,
      TutorialCreateEnsemble2,
      TutorialCreateEnsemble3
    };
  }
};
</script>

<template>
    <TutorialPage 
      :tutorialTitle="$t('additional:modules.tools.simulationTool.tutorial')"
      :sectionTitle="$t('additional:modules.tools.simulationTool.createEnsemble')"
      :sections="[
        { type: 'text', content: $t('additional:modules.tools.simulationTool.createEnsembleContent') },
        { type: 'image', src: TutorialCreateEnsemble1, alt: 'TutorialCreateEnsemble1' },
        { type: 'text', content: $t('additional:modules.tools.simulationTool.createEnsembleContent2') },
        { type: 'image', src: TutorialCreateEnsemble2, alt: 'TutorialCreateEnsemble2' },
        { type: 'text', content: $t('additional:modules.tools.simulationTool.createEnsembleContent3') },
        { type: 'image', src: TutorialCreateEnsemble3, alt: 'TutorialCreateEnsemble3' }
      ]"
      :hintsTitle="$t('additional:modules.tools.simulationTool.hints')"
      :hints="[
        $t('additional:modules.tools.simulationTool.createEnsembleHint')
      ]"
    />
  </template>

<script>
import TutorialPage from './TutorialPage.vue';
import TutorialLandingPage from '../../resources/img/TutorialLandingPage.png';

export default {
  components: { TutorialPage },
  data() {
    return {
        TutorialLandingPage
    };
  }
};
</script>

<template>
    <TutorialPage 
      :tutorialTitle="$t('additional:modules.tools.simulationTool.tutorial')"
      :sectionTitle="$t('additional:modules.tools.simulationTool.landingPage')"
      :sections="[
        { type: 'text', content: $t('additional:modules.tools.simulationTool.landingPageContent') },
        { type: 'image', src: TutorialLandingPage, alt: 'TutorialLandingPage' },
      ]"
    />
  </template>

<script>
export default {
  name: 'PopConfirm',
  props: {
    onConfirm: {
      type: Function,
      required: true,
    },
    confirmText: {
      type: String
    },
  },
  data() {
    return {
      confirmVisible: false,
      translateX: 0,
      translateY: 0,
    };
  },
  methods: {
    showConfirm(event) {
      this.confirmVisible = true;
    },
    hideConfirm() {
      this.confirmVisible = false;
    },
    handleConfirm() {
      this.onConfirm();
      this.hideConfirm();
    }
  },
  computed: {
    resolvedConfirmText() {
      return this.confirmText || this.$t('additional:modules.tools.simulationTool.defaultConfirmText');
    },
  },
  watch: {
    confirmVisible() {
      if (!this.confirmVisible) return;
      this.$nextTick(() => {
        const slotWrapperRect = this.$refs.slotWrapper.getBoundingClientRect();
        const popOverRect = this.$refs.popover.getBoundingClientRect();
        const isTopHalf = slotWrapperRect.top < window.innerHeight / 2;
        const isLeftHalf = slotWrapperRect.left < window.innerWidth / 2;

        this.translateX = isLeftHalf ? 0 : -(popOverRect.width - slotWrapperRect.width);
        this.translateY = isTopHalf ? 0 : -(popOverRect.height + slotWrapperRect.height);
      });
    },
  },
};
</script>

<template>
  <div class="pop-confirm-wrapper">
    <div
      ref="slotWrapper"
      @click="showConfirm"
      class="slot-wrapper"
    >
      <slot ></slot>
    </div>
    <div
      v-if="confirmVisible"
      ref="popover"
      class="popover"
      :style="{
        '--translateX': `${translateX}px`,
        '--translateY': `${translateY}px`
      }"
      role="tooltip"
    >
      <div class="popover-body">
        {{ this.resolvedConfirmText }}
        <div class="buttons">
          <button class="btn btn-danger btn-sm" @click="handleConfirm">
            {{ $t('additional:modules.tools.simulationTool.confirm') }}
          </button>
          <button class="btn btn-secondary btn-sm" @click="hideConfirm">
            {{ $t('additional:modules.tools.simulationTool.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
  .slot-wrapper {
    display: inline-block;
  }

  .popover {
    position: absolute;
    z-index: 1050;
    transform: translate(
      var(--translateX),
      var(--translateY)
    );

    .buttons {
      display: flex;
      gap: .5rem;
      justify-content: flex-end;
      margin-top: .25rem;
    }
  }
</style>

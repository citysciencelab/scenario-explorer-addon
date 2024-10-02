<script>
import LoadingMask from "./LoadingMask.vue";

export default {
    name: "AsyncWrapper",
    components: {
        LoadingMask
    },
    props: {
        asyncState: {
            type: Object,
            required: true,
            default: () => ({
                loading: false,
                error: null
            })
        },
    },
    watch: {
        asyncState: function(newVal) {
            console.log(newVal)
        }
    }
};
</script>

<template>
    <div class="async-wrapper">
        <LoadingMask
            v-if="asyncState.loading"
            :label="$t('additional:modules.tools.simulationTool.loading')"
        />
        <div v-else-if="asyncState.error" class="error-panel">
            <p>
                <i class="bi bi-exclamation-triangle-fill"></i>
                {{ $t("additional:modules.tools.simulationTool.errorLoadingData") }}:
            </p>
            <p>{{ asyncState.error }}</p>
        </div>
        <slot v-else></slot>
    </div>
</template>

<style lang="scss" scoped>
    .async-wrapper {
        display: contents;
    }

    .loading-mask {
        border-radius: var(--bs-border-radius-lg);
    }

    .error-panel {
        background-color: var(--bs-danger-bg-subtle);
        color: var(--bs-warning-text-emphasis);
        padding: 1rem;
        border: 1px solid var(--bs-danger-border-subtle);
        border-radius: var(--bs-border-radius-lg);
    }
</style>

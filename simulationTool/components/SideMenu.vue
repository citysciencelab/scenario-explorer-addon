<script>
import { mapActions, mapMutations, mapGetters} from "vuex";

export default {
    name: 'SideMenu',
    mounted: async function () {
        this.applyCustomLayout();
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", [
            "mode"
        ]),
        ...mapGetters("Modules/Login", [
            "loggedIn"
        ]),
        ...mapGetters("Menu", [
            "currentComponentName"
        ])
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode"
        ]),
        ...mapMutations("Menu", [
            "setCurrentComponent",
            "setCurrentComponentPropsName"
        ]),
        ...mapActions("Menu", [
            "resetMenu"
        ]),
        closeSimulationTool() {
            this.restoreDefaultLayout();
            if (this.currentComponentName('secondaryMenu') !== 'Simulationen') {
                this.setCurrentComponentPropsName({side: 'secondaryMenu', name: "Simulationen"})
            }
            this.resetMenu('secondaryMenu');
        },
        applyCustomLayout() {
                const defaultNavigation = document.getElementById("mp-menu-navigation-secondaryMenu");
                const menuBody = document.getElementById("mp-body-secondaryMenu");
                menuBody.style.padding = "0";
                defaultNavigation.style.display = "none";
        },
        restoreDefaultLayout() {
            const defaultNavigation = document.getElementById("mp-menu-navigation-secondaryMenu");
            const menuBody = document.getElementById("mp-body-secondaryMenu");
            menuBody.style.padding = "0 1.5rem 1.5rem 1.5rem";
            defaultNavigation.style.display = "block";
        },
    }
};
</script>

<template>
    <nav class="simulation-tool-sidebar">
        <button
            class="btn btn-link"
            @click="closeSimulationTool"
            :title="$t('additional:modules.tools.simulationTool.closeSimulationTool')"
        >
            <i class="bi bi-x-lg"></i>
        </button>
        <button
            class="btn btn-link"
            :class="{ active: mode === 'home-panel' }"
            @click="() => this.setMode('home-panel')"
            :title="$t('additional:modules.tools.simulationTool.home')"
        >
            <i class="bi bi-house-fill"></i>
        </button>
        <button
            class="btn btn-link"
            :class="{ active: mode === 'process-list' }"
            @click="() => this.setMode('process-list')"
            :title="$t('additional:modules.tools.simulationTool.models')"
        >
            <i class="bi bi-cpu-fill"></i>
        </button>
        <button
            class="btn btn-link"
            :class="{ active: mode === 'job-list' }"
            @click="() => this.setMode('job-list')"
            :title="$t('additional:modules.tools.simulationTool.scenarios')"
        >
            <i class="bi bi-box-fill"></i>
        </button>
        <button
            class="btn btn-link"
            :class="{ active: mode === 'ensemble-list' }"
            @click="() => this.setMode('ensemble-list')"
            :disabled="!loggedIn"
            :title="$t('additional:modules.tools.simulationTool.ensembles')"
        >
            <i class="bi bi-collection-fill"></i>
        </button>
        <button
            class="btn btn-link"
            :title="$t('additional:modules.tools.simulationTool.help')"
            @click="() => this.setMode('help-panel')"
        >
            <i class="bi bi-question-circle-fill"></i>
        </button>
    </nav>
</template>

<style scoped>
    nav.simulation-tool-sidebar {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background-color: var(--bs-primary);
        padding: 0 .5rem;

        .btn {
            font-size: 2rem;

            &.active {
                background-color: var(--bs-light);
            }

            &:first-child {
                margin-top: .5rem;
                margin-bottom: 2rem;
            }
        }
    }
</style>

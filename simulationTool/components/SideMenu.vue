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
        ])
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode"
        ]),
        ...mapMutations("Menu", [
            "setCurrentComponent"
        ]),
        ...mapActions("Menu", [
            "resetMenu"
        ]),
        closeSimulationTool() {
            this.restoreDefaultLayout();
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
            title="Close Simulation Tool"
        >
            <i class="bi bi-x-lg"></i>
        </button>
        <button
            class="btn btn-link"
            title="Home"
            disabled
        >
            <i class="bi bi-house-fill"></i>
        </button>
        <button
            class="btn btn-link"
            :class="{ active: mode === 'process-list' }"
            @click="() => this.setMode('process-list')"
            title="Modelle"
        >
            <i class="bi bi-cpu-fill"></i>
        </button>
        <button
            class="btn btn-link"
            :class="{ active: mode === 'job-list' }"
            @click="() => this.setMode('job-list')"
            title="Szenarien"
        >
            <i class="bi bi-box-fill"></i>
        </button>
        <button
            class="btn btn-link"
            :class="{ active: mode === 'ensemble-list' }"
            @click="() => this.setMode('ensemble-list')"
            :disabled="!loggedIn"
            :title="!loggedIn ? 'Ensembles require login' : 'Ensembles'"
        >
            <i class="bi bi-collection-fill"></i>
        </button>
        <button
            class="btn btn-link"
            title="Hilfe"
            disabled
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

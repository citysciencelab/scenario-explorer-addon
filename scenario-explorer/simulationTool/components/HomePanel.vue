<script>
import ProcessList from "./Process/ProcessList.vue";
import SectionHeader from "./SectionHeader.vue";

import { mapGetters, mapMutations } from "vuex";

export default {
    name: "HomePanel",
    components: {
        SectionHeader,
        ProcessList
    },
    computed: {
        ...mapGetters("Modules/Login", ["username", "loggedIn"])
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode"
        ]),
    }
};

</script>

<template>
    <div class="home-panel">
        <SectionHeader title="Startseite" icon="bi bi-person-fill" />
        <div class="segment-wrapper">
            <div v-if="username" class="welcome-user">
                <span>{{ $t("additional:modules.tools.simulationTool.welcome") }}</span>
                <span v-if="loggedIn">, {{ username }}</span>
            </div>
            <span v-else>
                <span class="welcome-user">{{ $t("additional:modules.tools.simulationTool.notLoggedIn") }}</span>
                <div class="not-authenticated">{{ $t("additional:modules.tools.simulationTool.authRequest") }}</div>
            </span>
            <div class="element-wrapper">
                <p class="segment-header">
                    {{ $t("additional:modules.tools.simulationTool.areYouNew") }}
                </p>
                <button class="segment-wrapper btn-light" @click="() => this.setMode('tutorial-panel')">
                    <p>{{ $t("additional:modules.tools.simulationTool.tutorialInfo") }}</p>
                    <i class="bi bi-arrow-right-circle-fill"></i>
                </button>
            </div>
            <div class="element-wrapper">
                <div class="segment-header">
                    {{ $t("additional:modules.tools.simulationTool.continue") }}
                </div>
                <ProcessList
                    :headerIsVisible=false
                    @selected="(payload) => $emit('selected', payload)"
                />
            </div>
            <div class="element-wrapper" v-if="loggedIn">
                <div class="segment-header">
                    {{ $t("additional:modules.tools.simulationTool.news") }}
                </div>
                <div class="segment-wrapper">
                    {{ $t("additional:modules.tools.simulationTool.newsCards") }}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.home-panel {
    max-height: 100vh;
    overflow-y: auto;
}

.welcome-user {
    font-weight: 600;
    font-size: 24px;
    padding: 10px;
}

.not-authenticated {
    padding: 10px;
}

.segment-header {
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
    padding-bottom: 5px;
    margin-bottom: 0;
}

.segment-wrapper {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    border: 0px;
    border-radius: 8px;
    box-shadow: var(--bs-box-shadow);
    width: 100%;
    padding: 10px;
    background-color: transparent;

    button.segment-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        gap: 10px;
        transition: background-color 0.3s ease;
        padding: 10px;

        &:hover {
            background-color: var(--bs-btn-hover-bg);;
        }

        p {
            margin: 0;
        }

        i {
            font-size: 1.5rem;
            margin: 0 15px 0 auto;
        }
    }
}

.element-wrapper {
    padding: 10px;
}

.bi-arrow-right-circle-fill {
    color: var(--bs-gray-500)
}
</style>

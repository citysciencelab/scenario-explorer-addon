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
            <v-img width="80" src="resources/img/Logo.jpg" class="m-4"></v-img >
            <div v-if="username" class="welcome-user p-2">
                <span>{{ $t("additional:modules.tools.simulationTool.welcome") }}</span>
                <span v-if="loggedIn">, {{ username }}</span>
            </div>
            <span v-else>
                <span class="welcome-user">{{ $t("additional:modules.tools.simulationTool.notLoggedIn") }}</span>
                <div class="not-authenticated">{{ $t("additional:modules.tools.simulationTool.authRequest") }}</div>
            </span>

        <div class="element-wrapper">

            <v-sheet rounded color="primary" @click="() => this.setMode('tutorial-panel')" class="p-4">
                <i class="bi bi-info-lg"></i>
                <p>{{ $t("additional:modules.tools.simulationTool.tutorialInfo") }} <i class="bi bi-arrow-right-circle-fill"></i></p>
                
            </v-sheet>
            
        </div>
        <div class="element-wrapper">
            <div class="segment-header">
                {{ $t("additional:modules.tools.simulationTool.continue") }}
            </div>
            <ProcessList :headerIsVisible=false @selected="(payload) => $emit('selected', payload)" />
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
            background-color: var(--bs-btn-hover-bg);
            ;
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

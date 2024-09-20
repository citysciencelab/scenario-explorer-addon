<script>
import ProcessList from "../Process/ProcessList.vue";
import SectionHeader from "../SectionHeader.vue";

import { mapGetters } from "vuex";

export default {
    name: "HomePanel",
    components: {
        SectionHeader,
        ProcessList
    },
    data() {
    },
    computed: {
        ...mapGetters("Modules/Login", ["username", "loggedIn"])
    },
    mounted() {
    },
    watch: {
    },
    methods: {
    }
};

</script>

<template>
    <div class="home-panel">
        <SectionHeader title="Startseite" icon="bi bi-person-fill" />
        <div class="segment-wrapper" v-if="loggedIn">
            <div v-show="username" class="welcome-user">{{ $t("additional:modules.tools.simulationTool.welcome") }}, {{
                username }}!</div>
            <div class="element-wrapper">
                <p class="segment-header">
                    {{ $t("additional:modules.tools.simulationTool.areYouNew") }}
                </p>
                <!-- ToDo: add onClick once component is finised -->
                <button class="segment-wrapper" @click="console.log('Open tutorial')">
                    <p>{{ $t("additional:modules.tools.simulationTool.tutorialInfo") }}</p>
                    <i class="bi bi-arrow-right-circle-fill"></i>
                </button>
            </div>
            <div class="element-wrapper">
                <div class="segment-header">
                    {{ $t("additional:modules.tools.simulationTool.continue") }}
                </div>
                <ProcessList :isVisible=false />
            </div>
            <div class="element-wrapper">
                <div class="segment-header">
                    {{ $t("additional:modules.tools.simulationTool.news") }}
                </div>
                <div class="segment-wrapper">
                    {{ $t("additional:modules.tools.simulationTool.newsCards") }}
                </div>
            </div>
        </div>
        <div class="segment-wrapper" v-else>
            Um auf die Simulationsdaten zugreifen zu können müssen Sie sich erst im Masterportal einloggen.
        </div>
    </div>
</template>

<style lang="scss" scoped>
.welcome-user {
    font-weight: 600;
    font-size: 24px;
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
    box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 8px;
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
            background-color: rgba(0, 0, 0, 0.1);
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
    color: rgb(201, 201, 201)
}
</style>

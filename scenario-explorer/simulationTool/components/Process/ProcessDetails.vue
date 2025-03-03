<script>
import { mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import AsyncWrapper from "../AsyncWrapper.vue";

export default {
    name: "ProcessDetails",
    components: {
        AsyncWrapper,
        SectionHeader
    },
    data() {
        return {
            process: null,
            requestState: {
                loading: false,
                error: null
            }
        };
    },
    computed: {
        ...mapGetters("Modules/Login", [
            "loggedIn"
        ]),
        ...mapGetters("Modules/SimulationTool", [
            "selectedProcessId"
        ])
    },
    mounted() {
        this.fetchProcess(this.selectedProcessId);
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode"
        ]),
        /**
         * Fetches a process from the simulation backend
         * @param {String} processId
         */
        async fetchProcess (processId) {
            let additionalHeaders = {};
            if (this.$store.getters["Modules/Login/loggedIn"]) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.$store.getters["Modules/Login/accessToken"]}`
                };
            }

            try {
                this.requestState.loading = true;
                const response = await fetch(`/api/processes/${processId}`,{
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                });

                const result = await response.json();
                if (!response.ok) {
                    this.requestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                    this.process = result;
                }
            } catch (error) {
                this.requestState.error = error;
            } finally {
                this.requestState.loading = false;
            }

        },
        getProcessImageSource (process) {
            const image = process?.links?.find(({type}) => type === "image");
            return image ? image : "resources/img/Process_placeholder.png";
        }
    },
};
</script>

<template>
    <div class="process-details">
        <SectionHeader
            :title="$t('additional:modules.tools.simulationTool.modelDetails')"
            icon="bi-box-fill"
        />
        <AsyncWrapper :asyncState="requestState">
        <div v-if="this.process" class="details-body">
            <div class="title-wrapper">
                <div class="title">
                    <h3>
                        {{process.title}}
                    </h3>
                </div>
                <div class="subtitle">
                    {{ $t('additional:modules.tools.simulationTool.version') }}: {{process.version}}
                </div>
            </div>
            <div class="information">
                <div class="left-column">
                    <div class="description">
                        <h4>{{ $t('additional:modules.tools.simulationTool.description') }}</h4>
                        <p>{{process.description}}</p>
                    </div>
                    <div class="inputs">
                        <h4>{{ $t('additional:modules.tools.simulationTool.inputParameters') }}</h4>
                        <ul>
                            <li v-for="input in process.inputs" :key="input.name">
                                <strong>{{input.title}}</strong>: {{input.description}}
                            </li>
                        </ul>
                    </div>
                    <div class="links">
                        <h4>{{ $t('additional:modules.tools.simulationTool.links') }}</h4>
                        <ul>
                            <li
                                v-for="link in process.links"
                                :key="link.rel"
                            >
                                <i class="bi bi-link"></i>
                                <a :href="link.href" target="_blank">{{link.title}}</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="right-column">
                    <img
                        class="card-img-top"
                        :src="getProcessImageSource(process)"
                        :alt="process.title + ' image'"
                    >
                    <div class="keywords">
                        <span
                            class="tag"
                            v-for="keyword in process.keywords"
                            :key="keyword"
                        >
                            #{{keyword}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="actions">
                <button
                    v-if="loggedIn"
                    class="btn btn-secondary"
                    @click="() => this.setMode('ensemble-creation')"
                >
                    <i class="bi bi-collection-fill">&nbsp;</i>
                    <span>{{ $t('additional:modules.tools.simulationTool.createEnsemble') }}</span>
                </button>
                <button
                    class="btn btn-primary"
                    @click="$emit('selected', { id: process.id, mode: 'job-execution'})"
                    >
                    <i class="bi bi-rocket">&nbsp;</i>
                    {{ $t("additional:modules.tools.simulationTool.simulate") }}
                </button>
            </div>
        </div>
        </AsyncWrapper>
    </div>

</template>

<style lang="scss" scoped>

    .process-details {
        max-height: 100%;
        display: flex;
        flex-direction: column;
        padding: 1rem;

        .details-body {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            overflow: hidden;

            .information {
                display: flex;
                gap: 1rem;
                padding: 1rem;
                overflow: auto;

                .left-column {
                    flex: 3;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;

                    h4 {
                        font-size: 1.25rem;
                        margin-bottom: .5rem;
                    }

                    ul {
                        list-style: none;
                        padding-left: .5rem;

                        li {
                            margin-bottom: .5rem;

                            i {
                                margin-right: .25rem;
                            }
                        }
                    }

                    .title-wrapper {
                        font-weight: bold;

                        .subtitle {
                            color: var(--bs-gray-600);
                        }
                    }
                }

                .right-column {
                    flex: 2;
                    gap: 1rem;
                    display: flex;
                    flex-direction: column;

                    .card-img-top {
                        width: 100%;
                        object-fit: cover;
                    }

                    .keywords {
                        flex: 1;
                        display: flex;
                        align-content: flex-start;
                        flex-wrap: wrap;
                        gap: 0.5rem;
                        margin-bottom: 1rem;

                        .tag {
                            background: var(--bs-gray-200);
                            color: var(--bs-dark);
                            padding: 0.25rem 0.5rem;
                            border-radius: 0.25rem;
                        }
                    }
                }
            }

            .actions {
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
            }
        }

    }
</style>

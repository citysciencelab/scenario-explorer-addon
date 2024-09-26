<script>
import { mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";

export default {
    name: "EnsembleDetails",
    components: {
        SectionHeader
    },
    data() {
        return {
            ensemble: null
        };
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", [
            "selectedEnsembleId"
        ]),
        ...mapGetters("Modules/Login", [
            "accessToken",
            "loggedIn"
        ]),
        scenarios: function() {
            return this.ensemble ? this.ensemble.scenario_configs : [];
        }
    },
    mounted() {
        this.fetchEnsemble(this.selectedEnsembleId);
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode"
        ]),
        /**
         * Fetches a ensemble from the simulation backend
         * @param {String} ensembleId
         */
        async fetchEnsemble (ensembleId) {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }

            this.ensemble = await fetch(`/api/ensembles/${ensembleId}`,{
                headers: {
                    "Content-Type": "application/json",
                    ...additionalHeaders
                }
            }).then((res) => res.json());
        },
        formatDateTime(dateTime) {
            return new Date(dateTime).toLocaleString({
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
        },
    }
};
</script>

<template>
    <div class="ensemble-details">
        <SectionHeader
            :title="$t('additional:modules.tools.simulationTool.ensembleDetails')"
            icon="bi-box-fill"
        />
        <div v-if="this.ensemble" class="details-body">
            <div class="details-header">
                <h3 :title="ensemble.id">{{ ensemble.name }}</h3>
                <div>
                    <strong>
                        {{ $t('additional:modules.tools.simulationTool.created') }}:
                    </strong>
                    {{ this.formatDateTime(ensemble.created) }}
                </div>
                <div class="status" :class="ensemble.status">
                    {{ensemble.description}}
                </div>
            </div>
            <div class="scenarios">
                <h4>{{ $t('additional:modules.tools.simulationTool.includedScenarios') }}</h4>
                <ul>
                    <li v-for="scenario in scenarios" :key="scenario.id">
                        <strong>{{scenario.process_id}}</strong>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .ensemble-details {
        max-height: 100%;
        display: flex;
        flex-direction: column;
        padding: 1rem;

        .details-body {
            display: grid;
            gap: 1rem;
            grid-template-areas:
                "header header"
                "links links"
                "parameter filter"
                "graphs notes";
            grid-template-columns: 1fr 1fr;

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

            div.status {
                display: inline-block;
                padding: .25rem .5rem;
                border-radius: .5rem;
                font-size: .875rem;
                font-weight: 500;
                color: white;
            }

            .accepted {
                background-color: var(--bs-info);
            }
            .running {
                background-color: var(--bs-warning);
            }
            .successful {
                background-color: var(--bs-success);
            }
            .dismissed {
                background-color: var(--bs-secondary);
            }
            .failed {
                background-color: var(--bs-danger);
            }

            .links {
                grid-area: links;
            }

            .header {
                grid-area: header;
            }

            .parameter {
                grid-area: parameter;
            }

            .filter {
                grid-area: filter;
            }

            .graphs {
                grid-area: graphs;
            }

            .notes {
                grid-area: notes;
            }
        }

    }
</style>

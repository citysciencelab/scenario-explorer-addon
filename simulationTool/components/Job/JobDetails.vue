<script>
import { mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import Diagramm from "../Diagramm/Diagramm.vue";
import DiagrammSettings from "../Diagramm/DiagrammSettings.vue";

export default {
    name: "JobDetails",
    components: {
        SectionHeader,
        Diagramm,
        DiagrammSettings
    },
    data() {
        return {
            job: null,
            type: 'bar',
            xProp: 'id',
            yProp: 'properties.value',
            sort: false,
            rootProp: 'results.features'
        };
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", ["selectedJobId"]),
        ...mapGetters("Modules/Login", ["accessToken", "loggedIn"])
    },
    mounted() {
        this.fetchJob(this.selectedJobId);
    },
    watch: {
        job: {
            handler: 'fetchJobResultData',
            immediate: true,
        }
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", ["setMode", "setJobResultData"]),
        /**
         * Fetches a job from the simulation backend
         * @param {String} jobId
         */
        async fetchJob(jobId) {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }

            this.job = await fetch(`/api/jobs/${jobId}`, {
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
        async fetchJobResultData() {
            try {
                const url = this.job?.links?.[0]?.href;
                if (!url) {
                    return;
                }
                // Todo: fix protocol
                const response = await fetch("http://" + url);
                const jsonData = await response.json();
                this.setJobResultData(jsonData);
            } catch (error) {
                console.error("Fehler beim Laden der Daten", error);
            }
        },
    }
};
</script>

<template>
    <div class="job-details">
        <SectionHeader
            :title="$t('additional:modules.tools.simulationTool.scenarioDetails')"
            icon="bi-box-fill"
        />
        <div v-if="this.job" class="details-body">
            <div class="details-header">
                <h3 :title="job.jobID">{{ job.process_title }} -> {{ job.name }}</h3>
                <div>
                    <strong>
                        {{ $t('additional:modules.tools.simulationTool.started') }}:
                    </strong>
                    {{ this.formatDateTime(job.started) }}
                </div>
                <div>
                    <strong>
                        {{ $t('additional:modules.tools.simulationTool.completed') }}:
                    </strong>
                    {{ this.formatDateTime(job.finished) }}
                </div>
                <div class="status" :class="job.status">
                    {{ job.status }}
                </div>
            </div>

            <div class="links">
                <h4>{{ $t('additional:modules.tools.simulationTool.links') }}</h4>
                <ul>
                    <li v-for="(link, index) in job.links" :key="link.rel">
                        <i class="bi bi-link"></i>
                        <a :href="link.href" target="_blank">{{link.title}}</a>
                    </li>
                </ul>
            </div>
            <div class="parameter">
                <h4>{{ $t('additional:modules.tools.simulationTool.parameters') }}</h4>
                <ul>
                    <li v-for="(value, key) in job.parameters.inputs" :key="key">
                        <strong>{{key}}</strong>: {{value}}
                    </li>
                </ul>
            </div>
            <div class="filter">
                <h4>{{ $t('additional:modules.tools.simulationTool.filter') }}</h4>
            </div>

            <div class="charts">
                <h4>{{ $t('additional:modules.tools.simulationTool.charts') }}</h4>
                <div class="wrapper">
                    <Diagramm :type="type" :x-prop="xProp" :y-prop="yProp" :sort="sort" :root-prop="rootProp" />
                </div>
            </div>

            <div class="settings">
                <h4>Graphen Einstellungen</h4>
                <div class="wrapper">
                    <DiagrammSettings v-model:type="type" v-model:xProp="xProp" v-model:yProp="yProp"
                        v-model:sort="sort" :root-prop="rootProp" />
                </div>
            </div>

            <div class="notes">
                <h4>{{ $t('additional:modules.tools.simulationTool.notes') }}</h4>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.job-details {
    max-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    overflow-y: auto;

        .details-body {
            display: grid;
            gap: 1rem;
            grid-template-areas:
                "header header"
                "links links"
                "parameter filter"
                "charts notes";
            grid-template-columns: 1fr 1fr;

        ul {
            list-style: none;
            padding-left: 0.5rem;

            li {
                margin-bottom: 0.5rem;

                i {
                    margin-right: 0.25rem;
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

            .charts {
                grid-area: charts;
            }

            .notes {
                grid-area: notes;
            }
        }

        div.status {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
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

        .graphs-and-settings {
            display: contents;
        }

        .wrapper {
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            padding: 20px;
        }

        .notes {
            grid-area: notes;
        }
    }
}
</style>

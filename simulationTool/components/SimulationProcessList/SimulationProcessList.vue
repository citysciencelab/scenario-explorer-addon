<script>
import Multiselect from "vue-multiselect";
import ProcessCard from './ProcessCard.vue';

export default {
    name: "SimulationProcessList",
    components: {
        Multiselect,
        ProcessCard
    },
    props: {
        "processes": {
            type: Array,
            required: true,
            default: []
        }
    },
    data () {
        return {
            selectedTags: [],
            searchString: ""
        }
    },
    computed: {
        filteredProcesses: {
            get() {
                let filteredProcesses = this.processes;
                if (this.selectedTags.length) {
                    filteredProcesses = filteredProcesses.filter(process => {
                        return this.selectedTags.some(tag =>
                            process.keywords?.includes(tag.name)
                        );
                    });
                }
                if (this.searchString) {
                    // TODO: Check if every value should be compared
                    filteredProcesses = filteredProcesses.filter(process => {
                        return Object.values(process)
                            .join()
                            .toLowerCase()
                            .includes(this.searchString.toLowerCase());
                    });
                }
                return filteredProcesses;
            },
            set(newProcesses) {
                this.filteredProcesses = newProcesses;
            }
        },
        options: {
            get() {
                return this.processes.reduce((acc, process) => {
                    process.keywords?.forEach(keyword => {
                        if (!acc.some(tag => tag.name === keyword)) {
                            acc.push({
                                name: keyword,
                                code: keyword
                            });
                        }
                    });
                    return acc;
                }, []);
            },
            set(newOptions) {
                this.options = newOptions;
            }
        }
    },
    methods: {
        clearSearch() {
            this.searchString = '';
        }
    },
    emits: ["selected"]
};
</script>

<template>
    <div class="process-list">
        <h3>{{ $t("additional:modules.tools.simulationTool.models") }}</h3>
        <div class="process-list-toolbar">
            <div class="input-group search-wrapper">
                <input
                    class="form-control"
                    :placeholder="$t('additional:modules.tools.simulationTool.search') + ' …'"
                    :aria-label="$t('additional:modules.tools.simulationTool.search')"
                    v-model="searchString"
                >
                <i
                    v-if="searchString"
                    class="bi-x-lg"
                    role="img"
                    @click="clearSearch"
                ></i>
                <i
                    v-else
                    class="bi-search"
                    role="img"
                ></i>
            </div>
            <multiselect
                v-model="selectedTags"
                :placeholder="$t('additional:modules.tools.simulationTool.filter') + ' …'"
                :aria-label="$t('additional:modules.tools.simulationTool.filter')"
                label="name"
                track-by="code"
                :options="options"
                :multiple="true"
            />
        </div>
        <div class="card-wrapper">
            <ProcessCard
                v-for="process in filteredProcesses"
                :key="process.id"
                :process="process"
                @selected="$emit('selected', process.id)"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
@import "~bootstrap/scss/card";

.process-list {
    height: 100%;

    .process-list-toolbar {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;

        .search-wrapper {
            input.form-control {
                border-top-right-radius: 5px !important;
                border-bottom-right-radius: 5px !important;
            }
            i {
                z-index: 10;
                position: absolute;
                right: 1em;
                top: 50%;
                transform: translate(0, -50%);
            }
        }
    }

    .card-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
        max-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
}

</style>

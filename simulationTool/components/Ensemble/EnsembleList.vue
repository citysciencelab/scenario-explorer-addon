<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import LoadingMask from "../LoadingMask.vue";
import UserDisplay from "../UserDisplay.vue";
import PopConfirm from "../PopConfirm.vue";

export default {
    name: "EnsembleList",
    components: {
        LoadingMask,
        SectionHeader,
        UserDisplay,
        PopConfirm
    },
    data () {
        return {
            searchString: ""
        }
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", [
            "ensembles",
            "ensemblesLoading"
        ]),
        filteredEnsembles: {
            get() {
                let filteredEnsembles = this.ensembles;
                if (this.searchString) {
                    filteredEnsembles = filteredEnsembles.filter(ensemble => {
                        return Object.values(ensemble)
                            .join()
                            .toLowerCase()
                            .includes(this.searchString.toLowerCase());
                    });
                }
                return filteredEnsembles;
            },
            set(newEnsembles) {
                this.filteredEnsembles = newEnsembles;
            }
        }
    },
    mounted() {
        this.fetchEnsembles();
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode",
            "setSelectedEnsembleId"
        ]),
        ...mapActions("Modules/SimulationTool", [
            "fetchEnsembles",
            "deleteEnsembleById"
        ]),
        clearSearch() {
            this.searchString = '';
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
        getEnsembleName(ensemble) {
            return ensemble.name || ensemble.id;
        },
        getScenarioStatus(ensemble) {
            const sum = ensemble.jobs_metadata ? Object
                .values(ensemble.jobs_metadata)
                .reduce((acc, amount) => acc + amount, 0) : 0;
            const successful = ensemble?.jobs_metadata?.successful || 0;
            return `${successful} / ${sum}`;
        },
        onEnsembleClick(ensemble) {
            this.setSelectedEnsembleId(ensemble.id);
            this.setMode("ensemble-details");
        },
        async deleteEnsemble(ensemble) {
            try {
                await this.deleteEnsembleById(ensemble.id);
                await this.fetchEnsembles();
            } catch (error) {
                console.error("Fehler beim Löschen des Ensembles:", error);
            }
        }
    }
}
</script>

<template>
    <div class="ensemble-list">
        <SectionHeader
            :title="$t('additional:modules.tools.simulationTool.ensembles')"
            icon="bi-collection-fill"
        >
            <template #actions>
                <button
                    class="btn btn-primary"
                    @click="() => this.setMode('ensemble-creation')"
                >
                    <i class="bi bi-plus-lg">&nbsp;</i>
                    <span>{{ $t('additional:modules.tools.simulationTool.newEnsemble') }}</span>
                </button>
            </template>
        </SectionHeader>
        <div class="ensemble-list-toolbar">
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
            <button
                class="btn btn-primary btn-sm"
                @click="this.fetchEnsembles"
                :title="$t('additional:modules.tools.simulationTool.refresh')"
            >
                <i class="bi-arrow-clockwise"></i>
            </button>
        </div>
        <LoadingMask
            v-if="ensemblesLoading"
            :text="$t('additional:modules.tools.simulationTool.loadingEnsembles') + '...'"
        />
        <div class="ensemble-list-table-wrapper" v-else>
            <table
                class="ensemble-list-table"
            >
                <thead>
                    <tr>
                        <th>{{ $t('additional:modules.tools.simulationTool.name') }}</th>
                        <th>{{ $t('additional:modules.tools.simulationTool.scenarios') }}</th>
                        <th>{{ $t('additional:modules.tools.simulationTool.date') }}</th>
                        <th>{{ $t('additional:modules.tools.simulationTool.user') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ensemble in filteredEnsembles">
                        <td>
                            <div>
                                <button
                                    class="btn btn-link"
                                    @click="onEnsembleClick(ensemble)"
                                >
                                    {{this.getEnsembleName(ensemble)}}
                                </button>
                            </div>
                        </td>
                        <td>
                            <div class="scenarios">
                                {{ this.getScenarioStatus(ensemble) }}
                            </div>
                        </td>
                        <td>
                            <div>
                                {{this.formatDateTime(ensemble.created)}}
                            </div>
                        </td>
                        <td>
                            <div>
                                <UserDisplay :user_id="ensemble.user_id" />
                            </div>
                        </td>
                        <td class="action-column">
                            <PopConfirm
                                :onConfirm="() => this.deleteEnsemble(ensemble)"
                                :confirmText= "$t('additional:modules.tools.simulationTool.confirmDelete')"
                            >
                                <button
                                    class="btn btn-link link-danger"
                                    :title="$t('additional:modules.tools.simulationTool.removeJob')"
                                >
                                    <i class="bi bi-trash"></i>
                                </button>
                            </PopConfirm>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .ensemble-list {
        height: 100%;
        display: flex;
        flex-direction: column;

        .ensemble-list-toolbar {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 1rem;

            .search-wrapper {
                height: 43px;
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

            >button {
                align-self: center;
            }
        }

        .ensemble-list-table-wrapper {
            overflow-y: auto;
        }

        .ensemble-list-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;

            th, td {
                padding: .5rem;
                text-align: left;
                overflow: hidden;
                text-overflow: ellipsis;

                &:not(:last-child) {
                    border-right: 2px solid var(--bs-default);
                }
            }

            th {
                white-space: nowrap;
            }

            td > div {
                white-space: normal;
                display: -webkit-box;
                line-clamp: 2;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
            }
        }
    }
</style>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import ProcessSelect from "../Process/ProcessSelect.vue";
import Config from "../../../../portal/simulation/config";
import EnsembleInput from "./EnsembleInput.vue";
import AsyncWrapper from "../AsyncWrapper.vue";

const DEFAULT_VALUE_MAP = {
    number: [0, 100],
    boolean: [],
    string: []
};

export default {
    name: "EnsembleCreation",
    components: {
        AsyncWrapper,
        EnsembleInput,
        SectionHeader,
        ProcessSelect
    },
    data() {
        return {
            processSelectVisible: false,
            selectedProcesses: [],
            processDetails: [],
            creationValues: {},
            processexecutionRequestState: {
                loading: false,
                error: null
            },
            executionRequestState: {
                loading: false,
                error: null
            },
            apiUrl: Config.simulationApiUrl
        };
    },
    watch: {
        async selectedProcesses() {
            this.processexecutionRequestState.error = null;
            if (!this.selectedProcesses || this.selectedProcesses.length === 0) {
                this.processDetails = [];
                this.creationValues = {
                    name: this.creationValues.name || '',
                    description: this.creationValues.description || ''
                };
                return;
            }
            try {
                this.processDetails = (await Promise.all(
                    this.selectedProcesses.map((process) => {
                        return this.fetchProcess(process.id);
                    })
                )).filter(process => process);

                this.setDefaultExecutionValues();

                // remove values for processes that are not selected anymore
                Object.keys(this.creationValues)
                    .filter(key => !['name', 'description'].includes(key))
                    .forEach((processId) => {
                        if (!this.selectedProcesses.find((process) => process.id === processId)) {
                            delete this.creationValues[processId];
                        }
                    });
            } catch (error) {
                this.processexecutionRequestState.error = error;
            }
        }
    },
    computed: {
        ...mapGetters("Modules/Login", [
            "accessToken",
            "loggedIn"
        ])
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setMode",
            "setSelectedEnsembleId"
        ]),
        ...mapActions("Modules/SimulationTool", [
            "fetchEnsembles"
        ]),
        setDefaultExecutionValues() {
            // add default values for sample size and sampling method
            for (const process of this.processDetails) {
                if (!this.creationValues?.[process.id]?.sample_size) {
                    this.updateExecutionValue(process.id, 'sample_size', 10);
                }
                if (!this.creationValues?.[process.id]?.sampling_method) {
                    this.updateExecutionValue(process.id, 'sampling_method', 'lhs');
                }

                // add default values for input parameters
                Object.keys(process.inputs).forEach((key) => {
                    const inputConfig = process.inputs[key];
                    const defaultValue = DEFAULT_VALUE_MAP[inputConfig?.schema?.type] || []
                    if (inputConfig.schema.minimum !== undefined) {
                        defaultValue[0] = inputConfig.schema.minimum;
                    }
                    if (inputConfig.schema.maximum !== undefined) {
                        defaultValue[1] = inputConfig.schema.maximum;
                    }
                    console.log(key, defaultValue);
                    this.updateExecutionValue(process.id, key, defaultValue);
                });
            }

        },
        updateExecutionValue(processId, key, value) {
            this.creationValues[processId] = this.creationValues[processId] || {};
            this.creationValues[processId][key] = value;
        },
        /**
         * Fetches a process from the simulation backend
         * @param {String} processId
         */
        async fetchProcess (processId) {
            if (!processId || this.processexecutionRequestState.error) {
                return;
            }
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }
            try {
                this.processexecutionRequestState.loading = true;
                const response = await fetch(`/api/processes/${processId}`,{
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                });
                const result = await response.json();
                if (!response.ok) {
                    this.processexecutionRequestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                    return result
                }
            } catch (error) {
                this.processexecutionRequestState.error = error;
            } finally {
                this.processexecutionRequestState.loading = false;
            }
        },
        async create (event) {
            event.preventDefault();

            const formIsValid = this.$refs.form.reportValidity();

            if (formIsValid) {
                const {
                    name,
                    description,
                    ...inputs
                } = this.creationValues;

                let additionalHeaders = {};
                if (this.loggedIn) {
                    additionalHeaders = {
                        Authorization: `Bearer ${this.accessToken}`
                    };
                }

                const scenario_configs = Object.keys(inputs).map((process_id) => {
                    const {
                        sample_size,
                        sampling_method,
                        ...parameters
                    } = inputs[process_id];
                    return {
                        process_id,
                        sample_size: Number(sample_size),
                        sampling_method,
                        parameters
                    };
                });

                try {
                    this.executionRequestState.loading = true;
                    const response = await fetch('/api/ensembles', {
                        method: "POST",
                        body: JSON.stringify({
                            name,
                            description,
                            scenario_configs
                        }),
                        headers: {
                            "Content-Type": "application/json",
                            ...additionalHeaders
                        }
                    });

                    const result = await response.json();
                    if (!response.ok) {
                        this.executionRequestState.error = result.error_message || response.status + ': unknown errror';
                    } else {
                        this.setMode("ensemble-details");
                        this.setSelectedEnsembleId(result.id);
                        this.fetchEnsembles();
                    }
                } catch (error) {
                    this.executionRequestState.error = error;
                } finally {
                    this.executionRequestState.loading = false;
                }
            }
        }
    }
};
</script>

<template>
    <div class="ensemble-creation">
        <SectionHeader
            :title="$t('additional:modules.tools.simulationTool.newEnsemble')"
            icon="bi-box-fill"
        />
        <form
            ref="form"
            class="creation-form"
        >
            <input
                id="name_input"
                class="form-control"
                type="text"
                :placeholder="$t('additional:modules.tools.simulationTool.ensembleName')"
                v-model="creationValues.name"
                required
            />
            <textarea
                id="description_input"
                class="form-control"
                :placeholder="$t('additional:modules.tools.simulationTool.ensembleDescription')"
                v-model="creationValues.description"
            ></textarea>
            <div>
                <h4 class="title-with-button">
                    <span>{{ $t('additional:modules.tools.simulationTool.includedModels')}}</span>
                    <button
                        tabindex="0"
                        class="btn btn-light"
                        type="button"
                        :title="processSelectVisible ?
                            $t('additional:modules.tools.simulationTool.close') :
                            $t('additional:modules.tools.simulationTool.addModel')"
                        @click="processSelectVisible = !processSelectVisible"
                    >
                        <i
                            class="bi-plus-circle"
                            role="img"
                            :style="{ transform: processSelectVisible ? 'rotate(45deg)' : 'rotate(0deg)' }"
                        ></i>
                    </button>
                </h4>
                <ProcessSelect
                    v-if="processSelectVisible"
                    id="process_selector"
                    v-model="selectedProcesses"
                />
            </div>
            <AsyncWrapper :asyncState="processexecutionRequestState">
                <div class="process-details-container">
                    <div
                        class="process-details"
                        v-for="process in processDetails"
                        :key="process.id"
                    >
                        <h4>{{ process.title }}</h4>
                        <p>{{ process.description }}</p>
                        <div v-if="process" class="inputs">
                            <h4>{{ $t('additional:modules.tools.simulationTool.settings') }}</h4>
                            <div class="settings">
                                <label :for="`size_input-${process.id}`">
                                    {{ $t('additional:modules.tools.simulationTool.scenarioAmount') }}:
                                </label>
                                <input
                                    :id="`size_input-${process.id}`"
                                    class="form-control"
                                    type="number"
                                    min="1"
                                    max="1000"
                                    :value="creationValues?.[process.id]?.sample_size"
                                    @change="(evt) => updateExecutionValue(process.id, 'sample_size', evt.target.value)"
                                    required
                                />
                                <label :for="`sampling_method_input-${process.id}`">
                                    {{ $t('additional:modules.tools.simulationTool.samplingMethod') }}:
                                </label>
                                <select
                                    :id="`sampling_method_input-${process.id}`"
                                    class="form-control"
                                    :value="creationValues?.[process.id]?.sampling_method"
                                    @change="(evt) => updateExecutionValue(process.id, 'sampling_method', evt.target.value)"
                                    required
                                >
                                    <option value="lhs" selected>
                                        {{ $t('additional:modules.tools.simulationTool.latinHyperCube') }}
                                    </option>
                                    <option value="uniformlhs" selected>
                                        {{ $t('additional:modules.tools.simulationTool.uniformlhs') }}
                                    </option>
                                    <option value="factorial" selected>
                                        {{ $t('additional:modules.tools.simulationTool.factorial') }}
                                    </option>
                                    <option value="montecarlo" selected>
                                        {{ $t('additional:modules.tools.simulationTool.montecarlo') }}
                                    </option>
                                </select>
                            </div>
                            <h4>{{ $t('additional:modules.tools.simulationTool.inputParameters') }}</h4>
                            <template
                                v-for="(input, key) in process.inputs"
                                :key="`label_${key}`"
                            >
                                <div class="input-wrapper">
                                    <label
                                        :title="input.description"
                                        :for="`input_${key}`"
                                    >
                                        {{ `${input.title} ${input.required || input.minOccurs > 0 ? '*' : ''}` }}
                                    </label>
                                    <EnsembleInput
                                        :id="`input_${key}`"
                                        :data="input"
                                        :modelValue="creationValues?.[process.id]?.[key]"
                                        @update:modelValue="(value) => updateExecutionValue(process.id, key, value)"
                                    />
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </AsyncWrapper>
            <button
                class="btn btn-primary btn-lg"
                type="submit"
                @click="create"
            >
                <i class="bi bi-collection-fill">&nbsp;</i>
                {{ $t('additional:modules.tools.simulationTool.createEnsemble') }}
            </button>
            <AsyncWrapper :asyncState="executionRequestState" />
        </form>
    </div>
</template>

<style lang="scss" scoped>
    .ensemble-creation {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 1rem;

        .creation-form {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            overflow: hidden;

            .title-with-button {
                display: flex;
                align-items: center;

                button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 2.5rem;
                    height: 2.5rem;
                    font-size: 1.5rem;

                    i {
                        display: flex;
                        transition: transform 0.2s;
                    }
                }
            }

            .process-list {
                width: 50%;
            }

            .process-details-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: .25rem;
                overflow: auto;
            }

            .process-details {
                display: flex;
                flex-direction: column;
                gap: .25rem;
                padding: 1rem;
                border: 1px solid #ccc;
                border-radius: 0.5rem;
            }

            .inputs, .setttings {
                display: flex;
                flex-direction: column;
                gap: .25rem;
            }

            .inputs .input-wrapper {
                display: flex;
                flex-direction: column;
                gap: .5rem;
            }

            button {
                align-self: flex-end;
            }
        }
    }
</style>

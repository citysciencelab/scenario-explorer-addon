<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import SectionHeader from "../SectionHeader.vue";
import JobExecutionInput from "./JobExecutionInput.vue";
import AsyncWrapper from "../AsyncWrapper.vue";
import ProcessSelect from "../Process/ProcessSelect.vue";

export default {
    name: "JobExecution",
    components: {
        AsyncWrapper,
        SectionHeader,
        ProcessSelect,
        JobExecutionInput
    },
    data() {
        return {
            process: null,
            executionValues: {},
            requestState: {
                loading: false,
                error: null
            },
            executionRequestState: {
                loading: false,
                error: null
            }
        };
    },
    computed: {
        ...mapGetters("Modules/SimulationTool", [
            "selectedProcessId"
        ]),
        ...mapGetters("Modules/Login", [
            "accessToken",
            "loggedIn"
        ])
    },
    mounted: function () {
        if (this.selectedProcessId) {
            this.fetchProcess(this.selectedProcessId);
        }
    },
    watch: {
        selectedProcessId: function(newProcessId) {
            if (newProcessId === null) {
                this.process = null;
                return;
            }
            this.fetchProcess(newProcessId);
        }
    },
    methods: {
        ...mapMutations("Modules/SimulationTool", [
            "setSelectedJobId",
            "setSelectedProcessId",
            "setMode"
        ]),
        ...mapActions("Modules/SimulationTool", [
            "fetchJobs"
        ]),
        /**
         * Fetches a process from the simulation backend
         * @param {String} processId
         */
        async fetchProcess (processId) {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
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
        updateExecutionValue (key, value) {
            this.executionValues[key] = value;
        },
        resetExecutionValues (newInputsConfig = this.process.inputs) {
            this.executionValues = {};
            Object.entries(newInputsConfig).forEach(([key, input]) => {
                if (input.schema.type === "array") {
                    this.executionValues[key] = [""];
                }
            });
        },
        async execute (event) {
            event.preventDefault();

            const formIsValid = this.$refs.form.reportValidity();

            if (formIsValid) {
                const {
                    job_name,
                    ...inputs
                } = this.executionValues;

                let additionalHeaders = {};
                if (this.loggedIn) {
                    additionalHeaders = {
                        Authorization: `Bearer ${this.accessToken}`
                    };
                }

                try {
                    this.executionRequestState.loading = true;
                    const response = await fetch(`/api/processes/${this.selectedProcessId}/execution`, {
                        method: "POST",
                        body: JSON.stringify({
                            job_name,
                            inputs
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
                        this.resetExecutionValues();

                        this.setMode("job-details");
                        this.setSelectedJobId(result.jobID);

                        this.fetchJobs();
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
    <div class="job-execution">
        <SectionHeader
            :title="$t('additional:modules.tools.simulationTool.newScenario')"
            icon="bi-box-fill"
        />
        <h3>{{ $t('additional:modules.tools.simulationTool.model') }}: {{ process?.title }}</h3>
        <ProcessSelect
            v-if="!process"
            @update:modelValue="(selectedProcessess) => {
                this.setSelectedProcessId(selectedProcessess[0]?.id);
            }"
        />
        <AsyncWrapper :asyncState="requestState" >
            <form
                ref="form"
                class="execution-form"
            >
                <label for="name_input">{{ $t('additional:modules.tools.simulationTool.scenarioName') }}:</label>
                <input
                    id="name_input"
                    class="form-control"
                    type="text"
                    v-model="executionValues.job_name"
                    required
                />
                <h4>{{ $t('additional:modules.tools.simulationTool.inputParameters') }}</h4>
                <div v-if="process" class="inputs">
                    <template
                        v-for="(input, key) in process.inputs"
                        :key="`label_${key}`"
                    >
                        <label
                            :title="input.description"
                            :for="`input_${key}`"
                        >
                            {{ input.title }}:
                        </label>
                        <JobExecutionInput
                            :input-key="key"
                            :data="input"
                            :value="executionValues[key]"
                            @change="updateExecutionValue(key, $event)"
                        />
                    </template>
                </div>

                <AsyncWrapper :asyncState="executionRequestState" />
                    <button
                        class="btn btn-primary btn-lg"
                        type="submit"
                        @click="execute"
                    >
                        <i class="bi bi-box-fill">&nbsp;</i>
                        {{ $t('additional:modules.tools.simulationTool.executeScenario') }}
                    </button>
            </form>
        </AsyncWrapper>
    </div>
</template>

<style lang="scss" scoped>
    .job-execution {
        max-height: 100%;
        display: flex;
        flex-direction: column;
        padding: 1rem;

        .execution-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            overflow: hidden;

            .inputs {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                overflow: auto;
            }

            button {
                align-self: flex-end;
            }
        }
    }
</style>

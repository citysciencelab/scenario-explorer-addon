const actions = {
    /**
     * Increases the count state.
     *
     * @param {Object} context actions context object.
     * @returns {void}
     */
    async fetchProcesses ({state, commit}) {
        const response = await fetch(`${state.apiUrl}/processes/`, {
                headers: {"content-type": "application/json"}
            }).then((res) => res.json()),
            layers = Radio.request("ModelList", "getModelsByAttributes", {
                isSimulationLayer: true
            });

        if (layers.length === 0) {
            throw new Error(
                "SimulationTool: no simulation layers found in config"
            );
        }

        // filter by defined layers
        const modelIdsFromLayers = layers.map(
                (layer) => layer.attributes.simModelId
            ),
            processes = response.processes.filter((process) => modelIdsFromLayers.includes(process.id)
            );

        commit("setProcesses", processes);
    },

    /**
     * Increases the count state.
     *
     * @param {Object} context actions context object.
     * @returns {void}
     */
    async fetchProcess ({state, commit}, processIndex) {
        const process = state.processes[processIndex],
            response = await fetch(
                `${state.apiUrl}/processes/${process.id}/`,
                {
                    headers: {"content-type": "application/json"}
                }
            ).then((res) => res.json());

        commit("setProcess", response);
    }
};

export default actions;

import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";

const actions = {
    /**
     * Increases the count state.
     *
     * @param {Object} context actions context object.
     * @returns {void}
     */
    async fetchProcesses ({state, commit, rootGetters}) {
        let additionalHeaders = {};
        if (rootGetters["Modules/Login/loggedIn"]) {
            additionalHeaders = {
                Authorization: `Bearer ${rootGetters["Modules/Login/accessToken"]}`
            };
        }

        const response = await fetch(`/api/processes/`, {
                headers: {
                    "content-type": "application/json",
                    ...additionalHeaders
                }
            }).then((res) => res.json()),
            layers = rawLayerList.getLayerList().filter(layer => layer.isSimulationLayer);

        if (layers.length === 0) {
            throw new Error(
                "SimulationTool: no simulation layers found in config"
            );
        }

        // filter by defined layers
        const processes = response.processes.filter((process) => {
            return layers.some(layer => layer.simModelId === process.id || layer.simModelId === '*');
        });

        commit("setProcesses", processes);
    },

    /**
     * Increases the count state.
     *
     * @param {Object} context actions context object.
     * @returns {void}
     */
    async fetchProcess ({state, commit, rootGetters}, processIndex) {
        let additionalHeaders = {};
        if (rootGetters["Modules/Login/loggedIn"]) {
            additionalHeaders = {
                Authorization: `Bearer ${rootGetters["Modules/Login/accessToken"]}`
            };
        }
        const process = state.processes[processIndex],
            response = await fetch(
                `/api/processes/${process.id}/`,
                {
                    headers: {
                        "content-type": "application/json",
                        ...additionalHeaders
                    }
                }
            ).then((res) => res.json());

        commit("setProcess", response);
    },

    async fetchJobs ({state, commit, rootGetters}) {
        let additionalHeaders = {};
        if (rootGetters["Modules/Login/loggedIn"]) {
            additionalHeaders = {
                Authorization: `Bearer ${rootGetters["Modules/Login/accessToken"]}`
            };
        }
        const response = await fetch(
            `/api/jobs/`,
            {
                headers: {
                    "content-type": "application/json",
                    ...additionalHeaders
                }
            }).then((res) => res.json());

        commit("setJobs", response.jobs);
    },
};

export default actions;

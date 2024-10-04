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

        commit("setProcessesLoading", true);

        try {
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
        } catch (error) {
            console.error(error);
        } finally {
            commit("setProcessesLoading", false);
        }

    },

    async fetchJobs ({state, commit, rootGetters}) {
        let additionalHeaders = {};
        if (rootGetters["Modules/Login/loggedIn"]) {
            additionalHeaders = {
                Authorization: `Bearer ${rootGetters["Modules/Login/accessToken"]}`
            };
        }

        commit("setJobsLoading", true);

        try {
            const response = await fetch(
                `/api/jobs/?include_ensembles`,
                {
                    headers: {
                        "content-type": "application/json",
                        ...additionalHeaders
                    }
                }).then((res) => res.json());

            commit("setJobs", response.jobs);
        } catch (error) {
            console.error(error);
        } finally {
            commit("setJobsLoading", false);
        }

    },

    async fetchEnsembles ({state, commit, rootGetters}) {
        if (!rootGetters["Modules/Login/loggedIn"]) {
            return;
        }

        commit("setEnsemblesLoading", true);

        try {
            const response = await fetch(
                `/api/ensembles/`,
                {
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${rootGetters["Modules/Login/accessToken"]}`
                    }
                }).then((res) => res.json());

            // TODO: this might changed in the backend
            commit("setEnsembles", response);
        } catch (error) {
            console.error(error);
        } finally {
            commit("setEnsemblesLoading", false);
        }

    },

    async fetchUserName({state, commit, rootGetters}, user_id) {
        if (!rootGetters["Modules/Login/loggedIn"]) {
            return null;
        }

        if (state.userNameCache[user_id]) {
            return state.userNameCache[user_id];
        }

        const newUserNameCache = {...state.userNameCache};

        const accessToken = rootGetters["Modules/Login/accessToken"];
        const response = await fetch(`/api/users/${user_id}/name`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        })
        const result = await response.json();
        if (response.ok) {
            newUserNameCache[user_id] = result;
            commit("setUserNameCache", newUserNameCache);
            return result;
        } else {
            throw new Error(result);
        }
    }
};

export default actions;

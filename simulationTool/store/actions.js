import Config from "../../../portal/simulation/config";

const actions = {
    async fetchProviders ({ commit }) {
        commit("setProvidersLoading", true);
        console.log(Config.simulationApiUrl);
        try {
            const url = new URL(`${Config.simulationApiUrl}/processes/providers`);
            const response = await fetch(url, {
                    headers: {
                        "content-type": "application/json"
                    }
                }).then((res) => res.json());
            commit("setProviders", response);
        } catch (error) {
            console.error(error);
        } finally {
            commit("setProvidersLoading", false);
        }
    },

    async fetchProcesses ({ commit, rootGetters}) {
        let additionalHeaders = {};
        if (rootGetters["Modules/Login/loggedIn"]) {
            additionalHeaders = {
                Authorization: `Bearer ${rootGetters["Modules/Login/accessToken"]}`
            };
        }

        commit("setProcessesLoading", true);
        console.log(Config.simulationApiUrl);

        try {
            const url = new URL(`${Config.simulationApiUrl}/processes/`);
            const response = await fetch(url, {
                    headers: {
                        "content-type": "application/json",
                        ...additionalHeaders
                    }
                }).then((res) => res.json());

            commit("setProcesses", response.processes);
        } catch (error) {
            console.error(error);
        } finally {
            commit("setProcessesLoading", false);
        }

    },

    async fetchJobs ({ commit, rootGetters}) {
        let additionalHeaders = {};
        if (rootGetters["Modules/Login/loggedIn"]) {
            additionalHeaders = {
                Authorization: `Bearer ${rootGetters["Modules/Login/accessToken"]}`
            };
        }

        commit("setJobsLoading", true);

        try {
            const response = await fetch(
                `${Config.simulationApiUrl}/jobs/?include_ensembles`,
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

    async fetchEnsembles ({ commit, rootGetters}) {
        if (!rootGetters["Modules/Login/loggedIn"]) {
            return;
        }

        commit("setEnsemblesLoading", true);

        try {
            const response = await fetch(
                `${Config.simulationApiUrl}/ensembles/`,
                {
                    headers: {
                        "content-type": "application/json",
                        Authorization: `Bearer ${rootGetters["Modules/Login/accessToken"]}`
                    }
                }).then((res) => res.json());
            commit("setEnsembles", response);
        } catch (error) {
            console.error(error);
        } finally {
            commit("setEnsemblesLoading", false);
        }

    },

    async deleteEnsembleById ({ commit, rootGetters}, ensembleId) {
        if (!rootGetters["Modules/Login/loggedIn"]) {
            return;
        }

        commit("setEnsemblesLoading", true);

        try {
            const url = new URL(`${Config.simulationApiUrl}/ensembles/${ensembleId}`);
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${rootGetters["Modules/Login/accessToken"]}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete ensemble");
            }

            console.log(`Ensemble ${ensembleId} successfully deleted.`);
        } catch (error) {
            console.error(error);
        } finally {
            commit("setEnsemblesLoading", false);
        }
    },

    async fetchUserDetails({ state, commit, rootGetters }, user_id) {
        if (!rootGetters["Modules/Login/loggedIn"]) {
            return null;
        }

        if (state.userDetailsCache[user_id]) {
            return state.userDetailsCache[user_id];
        }

        const fetchPromise = (async () => {
            const accessToken = rootGetters["Modules/Login/accessToken"];
            const url = new URL(`${Config.simulationApiUrl}/users/${user_id}/details`);
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result);
            }

            commit("setUserDetailsCache", {
                ...state.userDetailsCache,
                [user_id]: result
            });
            return result;
        })();

        commit("setUserDetailsCache", {
            ...state.userDetailsCache,
            [user_id]: fetchPromise
        });

        return fetchPromise
    }
};

export default actions;

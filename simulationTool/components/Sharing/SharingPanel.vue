<script>
import { mapGetters } from "vuex";
import AsyncWrapper from '../AsyncWrapper.vue';
import UserDisplay from "../UserDisplay.vue";
import Config from "../../../../portal/simulation/config";

export default {
    name: "SharingPanel",
    components: {
        AsyncWrapper,
        UserDisplay
    },
    props: {
        endPoint: {
            type: String,
            required: true
        },
        entityId: {
            type: String,
            required: true
        }
    },
    data: () => ({
        email: '',
        users: [],
        requestState: {
            loading: false,
            error: null
        }
    }),
    computed: {
        ...mapGetters("Modules/Login", ["accessToken", "loggedIn"]),
        ownUserId() {
            const decodedToken = JSON.parse(atob(this.accessToken.split('.')[1]));
            return decodedToken.sub;
        }
    },
    mounted() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }
            try {
                this.requestState.loading = true;
                const url = new URL(`${Config.simulationApiUrl}/${this.endPoint}/${this.entityId}/users`);
                const response = await fetch(url,{
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                });
                const result = await response.json();
                if (!response.ok) {
                    this.requestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                    this.users = result;
                }
            } catch (error) {
                this.requestState.error = error;
            } finally {
                this.requestState.loading = false;
            }
        },
        async addUser() {
            if (!this.loggedIn) {
                return;
            }
            try {
                this.requestState.loading = true;
                const url = new URL(`${Config.simulationApiUrl}/${this.endPoint}/${this.entityId}/share/${this.email}`);
                const response = await fetch(url,{
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`
                    }
                });
                if (!response.ok) {
                    this.requestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                    this.sharing = '';
                    this.fetchUsers();
                }
            } catch (error) {
                this.requestState.error = error;
            } finally {
                this.requestState.loading = false;
                this.email = '';
            }
        }
    }
}
</script>

<template>
    <div class="sharing-panel">
        <div>
            <span v-show="users.length">{{ $t('additional:modules.tools.simulationTool.currentlySharedWith')}}:</span>
            <AsyncWrapper :asyncState="requestState">
                <ul class="users">
                    <li
                        v-for="user in users"
                        :key="user.user_id"
                        class="user"
                    >
                        <UserDisplay :user_id="user.user_id" />
                    </li>
                </ul>
            </AsyncWrapper>
        </div>
        <form
            v-if="loggedIn"
            @submit.prevent="addUser"
        >
            <div class="input-group">
                <input
                    class="form-control form-control-sm"
                    v-model="email"
                    type="email"
                    :placeholder="$t('additional:modules.tools.simulationTool.enterUserEmail')"
                >
                <button
                    type="submit"
                    class="btn btn-primary btn-sm"
                >
                    {{ $t("additional:modules.tools.simulationTool.shareWithUser") }}
                </button>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
    .sharing-panel {
        overflow: hidden;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
        height: 100%;

        ul.users {
            display: flex;
            flex-wrap: wrap;
            list-style: none;
            padding: 0;
            margin: 0;

            li.user {
                transition: margin-left 0.2s;

                img {
                    width: 24px;
                    height: 24px;
                }

                &:not(:first-child) {
                    margin-left: -8px;
                }
            }

            &:hover {
                li.user:not(:first-child) {
                    margin-left: 2px;
                }
            }
        }

        form {
            input {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }
            button {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
        }
    }
</style>

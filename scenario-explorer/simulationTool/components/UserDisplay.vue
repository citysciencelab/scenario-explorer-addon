<script>
import { mapActions, mapGetters } from "vuex";
import LoadingMask from "./LoadingMask.vue";

export default {
    name: "UserDisplay",
    components: {
        LoadingMask
    },
    props: {
        user_id: {
            type: String,
            default: null
        }
    },
    data: () => ({
        user: null,
        requestState: {
            loading: false,
            error: null
        }
    }),
    computed: {
        ...mapGetters("Modules/Login", ["accessToken", "loggedIn"]),
    },
    mounted() {
        this.getUserName();
    },
    methods: {
        ...mapActions("Modules/SimulationTool", ["fetchUserDetails"]),
        async getUserName() {
            if (!this.loggedIn || !this.user_id) {
                return 'Anonymous*';
            }

            try {
                this.requestState.loading = true;
                this.user = await this.fetchUserDetails(this.user_id);
            } catch (error) {
                this.requestState.error = error;
            } finally {
                this.requestState.loading = false;
            }
        }
    },
    components: {
        LoadingMask
    }
}
</script>

<template>
    <div v-if="requestState.loading">
        Loading ...
    </div>
    <div
        v-else
        class="user-display"
    >
        <div
            v-if="user"
            :title="`${user.email} (${user.firstName} ${user.lastName})`"
            :alt="`${user.email} (${user.firstName} ${user.lastName})`"
        >{{ user.firstName.toUpperCase()[0] + user.lastName.toUpperCase()[0] }}</div>
        <div v-else class="user-not-found">
            User not found
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .user-display {
        display: flex;
        align-items: center;

        div {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #555;
            color: white;
            padding: 5px;
            min-width: 1em;
            border-radius: 50%;
            vertical-align: middle;
        }

        div:before {
            content: '';
            float: left;
            width: auto;
            padding-bottom: 100%;
        }
    }
</style>

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
        <img
            v-if="user"
            :src="user.gravatar_url + '?d=monsterid&s=24'"
            class="gravatar"
            :title="user.username"
            :alt="user.username + ' gravatar'"
        />
        <div v-else class="user-not-found">
            User not found
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .user-display {
        display: flex;
        align-items: center;
    }

    .gravatar {
        border-radius: 50%;
    }
</style>

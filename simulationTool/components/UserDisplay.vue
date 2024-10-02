<script>
import LoadingMask from "./LoadingMask.vue";

export default {
    name: "UserDisplay",
    components: {
        LoadingMask
    },
    props: {
        user_id: {
            type: String,
            required: true
        }
    },
    data: () => ({
        user: null,
        requestState: {
            loading: false,
            error: null
        }
    }),
    mounted() {
        this.getUser();
    },
    methods: {
        async getUser() {
          let additionalHeaders = {};
            if (this.loggedIn) {
                additionalHeaders = {
                    Authorization: `Bearer ${this.accessToken}`
                };
            }

            try {
                this.requestState.loading = true;
                const response = await fetch(`/auth/admin/realms/ump-client/users/${this.user_id}`,{
                    headers: {
                        "Content-Type": "application/json",
                        ...additionalHeaders
                    }
                })
                const result = await response.json();
                if (!response.ok) {
                    this.requestState.error = result.error_message || response.status + ': unknown errror';
                } else {
                  this.user = result;
                }
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
    <div>
        <LoadingMask v-if="requestState.loading" />
        <div v-else>
            <div v-if="requestState.error">
                <p>Error: {{ requestState.error }}</p>
            </div>
            <div v-else>
                <p>User: {{ user }}</p>
            </div>
        </div>
    </div>
</template>

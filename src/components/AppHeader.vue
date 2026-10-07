<script setup>
import { computed } from 'vue'
import { getRole, getUser, logout } from '../services/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = computed(() => getUser())
const role = computed(() => getRole())

function signOut() {
    logout()
    router.push('/login')
}
</script>

<template>
    <v-app-bar elevation="0" border color="surface">
        <v-container max-width="1200" class="d-flex align-center">
            <div class="d-flex align-center ga-3">

                <v-avatar color="primary" size="40">
                    <v-icon>
                        mdi-credit-card-outline
                    </v-icon>
                </v-avatar>

                <div>
                    <div class="text-subtitle-1 font-weight-bold">
                        Admin de Transacciones
                    </div>

                    <div class="text-caption text-medium-emphasis">
                        {{ role }}
                    </div>
                </div>

            </div>

            <v-spacer />

            <div class="d-flex align-center ga-3">

                <div class="text-right d-none d-sm-block">
                    <div class="text-body-2 font-weight-medium">
                        {{ user?.username }}
                    </div>

                    <div class="text-caption text-medium-emphasis">
                        {{ role }}
                    </div>
                </div>

                <v-btn variant="text" icon="mdi-logout" aria-label="Cerrar sesión" @click="signOut" />

            </div>
        </v-container>
    </v-app-bar>
</template>
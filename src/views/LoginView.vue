<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { saveToken, getRole } from '../services/auth'

const router = useRouter()

const username = ref('')
const password = ref('')
const visible = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

async function login() {
  error.value = ''
  success.value = ''

  if (!username.value || !password.value) {
    error.value = 'Ingresa usuario y contraseña'
    return
  }

  loading.value = true

  try {
    const response = await api.post('/login', {
      username: username.value,
      password: password.value
    })

    saveToken(response.data.token)

    success.value = 'Inicio de sesión correcto'

    const role = getRole()

    setTimeout(() => {
      if (role === 'Supervisor') {
        router.push('/supervisor')
      } else if (role === 'Operador') {
        router.push('/operator')
      } else {
        error.value = 'Rol no reconocido'
      }
    }, 500)
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      'No fue posible iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-card class="mx-auto my-auto" prepend-icon="$vuetify" subtitle="Inicia sesión para continuar" width="400">
    <template v-slot:title>
      <span class="font-weight-black">Admin de Transacciones</span>
    </template>

    <v-form @submit.prevent="login">
      <div class="pa-4">
        <v-text-field label="Usuario" v-model="username" :rules="[v => !!v || '']"
          placeholder="Ingresa tu usuario"></v-text-field>
        <v-text-field label="Contraseña" v-model="password" :rules="[v => !!v || '']"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
          placeholder="Ingresa tu contraseña" @click:append-inner="visible = !visible"></v-text-field>

        <v-alert v-if="success" density="compact" closable :text="success" type="success" variant="tonal"
          class="mb-2"></v-alert>
        <v-alert v-if="error" density="compact" closable :text="error" type="error" variant="tonal"
          class="mb-2"></v-alert>

        <v-btn type="submit" :disabled="loading" color="blue" size="large" variant="tonal" block>
          {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { saveToken, getRole } from '../services/auth'

const router = useRouter()

const username = ref('')
const password = ref('')
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
        // router.push('/supervisor')
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
  <main class="login-page">
    <section class="login-card">
      <div class="login-header">
        <h1>Admin de Transacciones</h1>
        <p>Inicia sesión para continuar</p>
      </div>

      <form @submit.prevent="login">
        <div class="form-group">
          <label>Usuario</label>
          <input
            v-model="username"
            type="text"
            placeholder="Ingresa tu usuario"
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input
            v-model="password"
            type="password"
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <div v-if="success" class="alert alert-success">
          {{ success }}
        </div>

        <button
          class="btn btn-primary btn-full"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
        </button>
      </form>
    </section>
  </main>
</template>
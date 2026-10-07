<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { getUser, logout } from '../services/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = getUser()

const transactionId = ref('')
const financialReference = ref('')
const cardNumber = ref('')
const action = ref('cancel')

const transactions = ref([])

const loading = ref(false)
const message = ref('')
const error = ref('')

async function updateTransaction() {
    loading.value = true
    message.value = ''
    error.value = ''

    try {
        const response = await api.patch(
            `/transactions/${transactionId.value}`,
            {
                action: action.value,
                financialReference: financialReference.value,
                cardNumber: cardNumber.value
            }
        )

        message.value = response.data.message
    } catch (err) {
        error.value =
            err.response?.data?.message ||
            'No fue posible procesar la operación'
    } finally {
        loading.value = false
    }
}

async function getTransactions() {
    loading.value = true

    try {
        const response = await api.get('/transactions')

        transactions.value = response.data
    } catch (err) {
        error.value =
            err.response?.data?.message ||
            'No fue posible consultar las transacciones'
    } finally {
        loading.value = false
    }
}

function signOut() {
    logout()
    router.push('/login')
}
</script>

<template>
    <div class="dashboard">
        <header class="topbar">
            <div>
                <h2>Transaction Manager</h2>
                <span>Supervisor</span>
            </div>

            <div class="user-area">
                <span>{{ user?.username }}</span>

                <button class="btn btn-secondary" @click="signOut">
                    Salir
                </button>
            </div>
        </header>

        <main class="dashboard-content">
            <section class="welcome">
                <h1>Panel de Supervisor</h1>
                <p>
                    Gestiona cancelaciones, devoluciones y consultas.
                </p>
            </section>

            <section class="card">
                <h2>Cancelar / Devolver transacción</h2>

                <form @submit.prevent="updateTransaction">

                    <div class="form-group">
                        <label>Operación</label>

                        <select v-model="action">
                            <option value="cancel">
                                Cancelación
                            </option>

                            <option value="refund">
                                Devolución
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>ID de transacción</label>

                        <input v-model="transactionId" type="text" required />
                    </div>

                    <div class="form-group">
                        <label>Referencia financiera</label>

                        <input v-model="financialReference" type="text" maxlength="8" required />
                    </div>

                    <div class="form-group">
                        <label>Número de tarjeta</label>

                        <input v-model="cardNumber" type="text" required />
                    </div>

                    <button class="btn btn-primary" :disabled="loading">
                        {{ loading ? 'Procesando...' : 'Procesar' }}
                    </button>
                </form>
                <div v-if="message" class="alert alert-success">
                    {{ message }}
                </div>

                <div v-if="error" class="alert alert-error">
                    {{ error }}
                </div>
            </section>

            <section class="card">
                <div class="card-header">
                    <div>
                        <h2>Consultar transacciones</h2>
                    </div>

                    <button class="btn btn-secondary" @click="getTransactions">
                        Consultar
                    </button>
                </div>

                <table v-if="transactions.length">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Importe</th>
                            <th>Referencia</th>
                            <th>Tarjeta</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="transaction in transactions" :key="transaction.id">
                            <td>{{ transaction.type }}</td>
                            <td>${{ transaction.amount }}</td>
                            <td>{{ transaction.financialReference }}</td>
                            <td>{{ transaction.cardNumber }}</td>
                            <td>{{ transaction.status }}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </main>
    </div>
</template>
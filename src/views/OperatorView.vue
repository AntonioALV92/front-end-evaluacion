<script setup>
import { ref } from 'vue'
import api from '../services/api'
import AppHeader from '../components/AppHeader.vue'

const amount = ref('')
const personName = ref('')
const cardNumber = ref('')
const cardExpiration = ref('')
const cardCvv = ref('')

const transactions = ref([])

const loading = ref(false)
const message = ref('')
const error = ref('')

async function createSale() {
    loading.value = true
    message.value = ''
    error.value = ''

    try {
        const response = await api.post('/transactions/sale', {
            amount: Number(amount.value),
            personName: personName.value,
            cardNumber: cardNumber.value,
            cardExpiration: cardExpiration.value,
            cardCvv: cardCvv.value
        })

        message.value = response.data.message

        amount.value = ''
        personName.value = ''
        cardNumber.value = ''
        cardExpiration.value = ''
        cardCvv.value = ''
    } catch (err) {
        error.value =
            err.response?.data?.message ||
            'No fue posible procesar la venta'
    } finally {
        loading.value = false
    }
}

async function getTransactions() {
    loading.value = true
    error.value = ''

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
</script>

<template>
    <app-header></app-header>
    <div class="dashboard">
        <main class="dashboard-content">
            <section class="welcome">
                <h1>Panel de Operador</h1>
                <p>Gestiona ventas y consulta transacciones.</p>
            </section>

            <div class="grid">
                <section class="card">
                    <h2>Nueva venta</h2>

                    <form @submit.prevent="createSale">
                        <div class="form-group">
                            <label>Nombre de la persona</label>
                            <input v-model="personName" type="text" required />
                        </div>

                        <div class="form-group">
                            <label>Importe</label>
                            <input v-model="amount" type="number" min="1" required />
                        </div>

                        <div class="form-group">
                            <label>Número de tarjeta</label>
                            <input v-model="cardNumber" type="text" maxlength="16" required />
                        </div>

                        <div class="form-group">
                            <label>Fecha de expiración</label>
                            <input v-model="cardExpiration" type="text" placeholder="MM/YY" maxlength="4" required />
                        </div>

                        <div class="form-group">
                            <label>Código de seguridad (CVV)</label>
                            <input v-model="cardCvv" type="text" maxlength="3" required />
                        </div>

                        <button class="btn btn-primary" :disabled="loading">
                            {{ loading ? 'Procesando...' : 'Realizar venta' }}
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
                            <h2>Consultas</h2>
                            <p>Transacciones aprobadas</p>
                        </div>

                        <button class="btn btn-secondary" @click="getTransactions">
                            Consultar
                        </button>
                    </div>

                    <div v-if="transactions.length">
                        <table>
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
                                    <td>
                                        <span class="status">
                                            {{ transaction.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    </div>
</template>
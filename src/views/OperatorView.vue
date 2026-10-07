<script setup>
import { ref } from 'vue'
import api from '../services/api'
import AppHeader from '../components/AppHeader.vue'
import TransactionTable from '../components/TransactionTable.vue'

const form = ref(null)
const amount = ref('')
const personName = ref('')
const cardNumber = ref('')
const cardExpiration = ref('')
const cardCvv = ref('')
const showCvv = ref(false)

const loading = ref(false)
const message = ref('')
const error = ref('')

const formatCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, '')

    value = value.slice(0, 19)

    value = value.match(/.{1,4}/g)?.join(' ') || ''

    cardNumber.value = value
}

const formatExpiry = (e) => {
    let value = e.target.value.replace(/\D/g, '')

    value = value.slice(0, 4)

    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2)
    }

    cardExpiration.value = value
}

const formatCvv = (e) => {
    if (e?.target?.value) {
        let value = e.target.value.replace(/\D/g, '')

        value = value.slice(0, 4)

        cardCvv.value = value
    }
}

const rules = {
    required: value => !!value || 'Este campo es obligatorio.',

    amount: value => {
        const number = Number(value)

        return (
            (value !== '' && value !== null && number > 0) ||
            'El importe debe ser mayor a 0.'
        )
    },

    cardNumber: value => {
        const clean = String(value || '').replace(/\s/g, '')

        return (
            (clean.length >= 13 && clean.length <= 19) ||
            'Número de tarjeta inválido.'
        )
    },

    expiry: value => {
        return (
            /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value) ||
            'Formato inválido (MM/AA).'
        )
    },

    cvv: value => {
        const clean = String(value || '')

        return (
            (clean.length === 3 || clean.length === 4) ||
            'CVV inválido (3 o 4 dígitos).'
        )
    }
}

async function createSale() {
    message.value = ''
    error.value = ''

    if (!personName.value.trim()) {
        error.value = 'El nombre de la persona es obligatorio.'
        return
    }

    if (!amount.value || Number(amount.value) <= 0) {
        error.value = 'El importe debe ser mayor a 0.'
        return
    }

    const { valid } = await form.value.validate()

    if (!valid) {
        return
    }

    loading.value = true

    try {
        const response = await api.post('/transactions/sale', {
            amount: Number(amount.value),
            personName: personName.value,
            cardNumber: cardNumber.value.replace(/\s/g, ''),
            cardExpiration: cardExpiration.value,
            cardCvv: cardCvv.value
        })

        message.value = response.data.message

        amount.value = ''
        personName.value = ''
        cardNumber.value = ''
        cardExpiration.value = ''
        cardCvv.value = ''
        showCvv.value = false

        form.value.resetValidation()
    } catch (err) {
        error.value =
            err.response?.data?.message ||
            'No fue posible procesar la venta'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <app-header></app-header>

    <v-main>
        <v-container fluid>

            <v-row align="center" justify="center">
                <v-col cols="12" class="text-center">
                    <h1 class="mb-0">Panel de Operador</h1>
                    <p class="mt-0">
                        Gestiona ventas y consulta transacciones.
                    </p>
                </v-col>
            </v-row>

            <v-row>

                <v-col cols="12" md="6">

                    <v-card>

                        <v-card-title>
                            Nueva venta
                        </v-card-title>

                        <v-card-text>

                            <v-form ref="form" @submit.prevent="createSale">

                                <v-text-field v-model="personName" label="Nombre de la persona" />

                                <v-text-field v-model="amount" label="Importe" prefix="$" type="number" min="0.01"
                                    step="0.01" inputmode="decimal" />

                                <v-text-field v-model="cardNumber" label="Número de tarjeta"
                                    placeholder="4111 1111 1111 1111" prepend-inner-icon="mdi-credit-card"
                                    :rules="[rules.required, rules.cardNumber]" maxlength="19" inputmode="numeric"
                                    @input="formatCardNumber" />

                                <div class="d-flex ga-2">

                                    <v-text-field v-model="cardExpiration" label="MM/AA" placeholder="MM/AA"
                                        prepend-inner-icon="mdi-calendar" :rules="[rules.required, rules.expiry]"
                                        maxlength="5" inputmode="numeric" @input="formatExpiry" />

                                    <v-text-field v-model="cardCvv" label="Código de seguridad (CVV)" placeholder="123"
                                        prepend-inner-icon="mdi-lock"
                                        :append-inner-icon="showCvv ? 'mdi-eye-off' : 'mdi-eye'"
                                        :type="showCvv ? 'text' : 'password'" :rules="[rules.required, rules.cvv]"
                                        maxlength="4" inputmode="numeric" @update:model-value="formatCvv"
                                        @click:append-inner="showCvv = !showCvv" />

                                </div>

                                <v-btn type="submit" :loading="loading" color="blue" size="large" variant="tonal" block>
                                    Realizar venta
                                </v-btn>

                            </v-form>

                            <v-alert v-if="message" closable :text="message" type="success" variant="tonal"
                                class="mt-2" />

                            <v-alert v-if="error" closable :text="error" type="error" variant="tonal" class="mt-2" />

                        </v-card-text>

                    </v-card>

                </v-col>

                <v-col cols="12" md="6">
                    <TransactionTable />
                </v-col>

            </v-row>

        </v-container>
    </v-main>
</template>
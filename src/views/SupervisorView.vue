```vue
<script setup>
import { ref } from 'vue'
import api from '../services/api'
import AppHeader from '../components/AppHeader.vue'
import TransactionTable from '../components/TransactionTable.vue'

const form = ref(null)

const financialReference = ref('')
const cardNumber = ref('')
const action = ref('cancel')

const loading = ref(false)
const message = ref('')
const error = ref('')

const formatFinancialReference = (value) => {
    if (value === null || value === undefined) {
        financialReference.value = String(value || '')
            .replace(/\D/g, '')
            .slice(0, 8)
    }
}

const formatCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, '')

    value = value.slice(0, 19)

    value = value.match(/.{1,4}/g)?.join(' ') || ''

    cardNumber.value = value
}

const rules = {
    required: value => !!value || 'Este campo es obligatorio.',

    financialReference: value => {
        const clean = String(value || '')

        if (!clean) {
            return 'La referencia financiera es obligatoria.'
        }

        return (
            /^\d{8}$/.test(clean) ||
            'La referencia financiera debe tener exactamente 8 dígitos.'
        )
    },

    cardNumber: value => {
        const clean = String(value || '').replace(/\s/g, '')

        return (
            (clean.length >= 13 && clean.length <= 19) ||
            'Número de tarjeta inválido.'
        )
    },
}

async function updateTransaction() {
    message.value = ''
    error.value = ''

    const result = await form.value.validate()

    if (!result.valid) {
        return
    }

    loading.value = true

    try {
        const response = await api.patch(
            `/transactions/${financialReference.value}`,
            {
                action: action.value,
                financialReference: financialReference.value,
                cardNumber: cardNumber.value.replace(/\s/g, '')
            }
        )

        message.value = response.data.message

        financialReference.value = ''
        cardNumber.value = ''

        form.value.resetValidation()
    } catch (err) {
        error.value =
            err.response?.data?.message ||
            'No fue posible procesar la operación'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <app-header />

    <v-main>
        <v-container fluid>

            <v-row align="center" justify="center">
                <v-col cols="12" class="text-center">
                    <h1 class="mb-0">
                        Panel de Supervisor
                    </h1>

                    <p class="mt-0">
                        Gestiona cancelaciones, devoluciones y consultas.
                    </p>
                </v-col>
            </v-row>

            <v-row>

                <v-col cols="12" md="6">

                    <v-card>

                        <v-card-title>
                            Cancelar / Devolver transacción
                        </v-card-title>

                        <v-card-text>

                            <v-form ref="form" @submit.prevent="updateTransaction">

                                <v-select v-model="action" :items="[
                                    {
                                        title: 'Cancelación',
                                        value: 'cancel'
                                    },
                                    {
                                        title: 'Devolución',
                                        value: 'refund'
                                    }
                                ]" label="Operación" />

                                <v-text-field v-model="financialReference" label="Referencia financiera"
                                    placeholder="12345678" maxlength="8" inputmode="numeric"
                                    :rules="[rules.required, rules.financialReference]"
                                    @update:model-value="formatFinancialReference" />

                                <v-text-field v-model="cardNumber" label="Número de tarjeta"
                                    placeholder="4111 1111 1111 1111" prepend-inner-icon="mdi-credit-card"
                                    :rules="[rules.required, rules.cardNumber]" maxlength="19" inputmode="numeric"
                                    @input="formatCardNumber" />

                                <v-btn type="submit" :loading="loading" color="blue" size="large" variant="tonal" block>
                                    Procesar
                                </v-btn>

                            </v-form>

                            <v-alert v-if="message" density="compact" closable :text="message" type="success"
                                variant="tonal" class="mt-2" />

                            <v-alert v-if="error" density="compact" closable :text="error" type="error" variant="tonal"
                                class="mt-2" />

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
```

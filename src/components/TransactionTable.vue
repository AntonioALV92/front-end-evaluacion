<script setup>
import api from '@/services/api'
import { ref } from 'vue'

const headers = [
    {
        title: 'Tipo',
        key: 'type'
    },
    {
        title: 'Importe',
        key: 'amount'
    },
    {
        title: 'Referencia',
        key: 'financialReference'
    },
    {
        title: 'Tarjeta',
        key: 'cardNumber'
    },
    {
        title: 'Estado',
        key: 'status'
    }
]

const transactions = ref([])
const loading = ref(false)
const error = ref('')

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
    <v-card>
        <v-card-title>Consultas</v-card-title>
        <v-card-text>
            <v-container class="d-flex align-center">
                <p>Transacciones aprobadas</p>
                <v-spacer />
                <v-btn @click="getTransactions">Consultar</v-btn>
            </v-container>
            <div v-if="transactions.length">
                <v-data-table :headers="headers" :items="transactions" :loading="loading" item-value="id" hover>

                    <template #item.amount="{ item }">
                        <span class="font-weight-medium">
                            ${{ item.amount }}
                        </span>
                    </template>

                    <template #item.status="{ item }">
                        <v-chip size="small" :color="item.status === 'approved'
                            ? 'success'
                            : item.status === 'cancelled'
                                ? 'error'
                                : 'warning'
                            " variant="tonal">
                            {{ item.status }}
                        </v-chip>
                    </template>

                    <template #no-data>
                        <div class="py-10 text-center">
                            <v-icon size="48" color="medium-emphasis">
                                mdi-database-off-outline
                            </v-icon>

                            <div class="text-body-1 mt-3">
                                No hay transacciones para mostrar
                            </div>
                        </div>
                    </template>

                </v-data-table>
            </div>
        </v-card-text>
    </v-card>

</template>
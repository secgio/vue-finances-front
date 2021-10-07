<!-- exibe a lista de dados -->
<template>
  <v-list-item avatar>

    <v-list-item-avatar>
      <v-icon :class="[ recordIconColor(record.type), 'lighten-1 white--text' ]">{{ recordIcon(record.type) }}</v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ record.description }}</v-list-item-title>
      <v-list-item-subtitle>{{ record.category.description }} | {{ record.account.description }}</v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-action>
      <span :class="amountColor(record.amount)">{{ formatCurrency(record.amount) }}</span>
    </v-list-item-action>

    <v-btn
      class="ml-5 mr-1"
      x-small
      fab
      color="blue darken-4"
      @click="editRecord"
    >
      <v-icon small>mode_edit</v-icon>
    </v-btn>
    <v-btn
      class="ml-1 mr-2"
      x-small
      fab
      color="pink darken-4"
      @click="showDeleteDialog = true, record"
    >
      <v-icon small>delete_outline</v-icon>
    </v-btn>

    <v-dialog
      v-model="showDeleteDialog"
      max-width="450px"
    >
      <v-card>
        <v-card-title>
          <h3 class="subheading">Deseja realmente deletar o registro?</h3>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            small
            @click="showDeleteDialog = false"
          >Não</v-btn>
          <v-btn
            flat
            small
            @click="deleteline"
          >Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-list-item>
</template>

<script>

import amountColorMixin from './../mixins/amount-color'
import formatCurrencyMixin from '@/mixins/format-currency'

import RecordsService from './../services/records-service'

export default {
  name: 'RecordsListItem',
  mixins: [
    amountColorMixin,
    formatCurrencyMixin
  ],
  props: {
    record: Object
  },
  data: () => ({
    showDeleteDialog: false
  }),
  methods: {
    // eslint-disable-next-line space-before-function-paren
    recordIcon(type) {
      return type === 'CREDIT' ? 'arrow_upward' : 'arrow_downward'
    },
    // eslint-disable-next-line space-before-function-paren
    recordIconColor(type) {
      return type === 'CREDIT' ? 'primary' : 'pink accent-3'
    },
    // eslint-disable-next-line space-before-function-paren
    async deleteline() {
      try {
        const record = await RecordsService.deleteRecord(this.record)
        console.log('Record: ', record)
        this.$router.push('/dashboard/records').catch(() => { })
        console.log('passou pelo router')
      } catch (e) {
        console.log('caiu no erro')
        console.log('Error creating Record: ', e)
      }
    },
    // eslint-disable-next-line space-before-function-paren
    editRecord(records, type, typeEntry) {
      records = this.record
      type = this.record.type
      typeEntry = 'Edit'
      this.$router.push({
        name: 'recordsAdd',
        query: { type },
        params: { records, typeEntry }
      }).catch(() => { })
    }
  }
}
</script>

<!-- Botão aereo que fica na parte de baixo do programa -->

<template>
  <v-speed-dial
    v-model="fab"
    fixed
    bottom
    right
    direction="top"
    transition="slide-y-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn
        v-model="fab"
        color="primary"
        fab
      >
        <v-icon v-if="fab">close</v-icon>
        <v-icon v-else>add</v-icon>
      </v-btn>
    </template>
    <v-btn
      fab
      small
      color="error"
      title="Nova Despesa"
      @click="addRecord('debit')"
    >
      <v-icon>remove</v-icon>
    </v-btn>
    <v-btn
      fab
      small
      color="primary"
      title="Nova Receita"
      @click="addRecord('credit')"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'AppFloatingButton',
  data: () => ({
    fab: false
  }),
  methods: {
    // eslint-disable-next-line space-before-function-paren
    addRecord(type, typeEntry) {
      typeEntry = 'Create'
      this.$router.push({
        name: 'recordsAdd',
        query: { type },
        params: { typeEntry }
      }).catch(() => { })
    }
  }
}
</script>

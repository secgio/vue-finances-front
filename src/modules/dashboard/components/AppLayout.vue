<!-- Monta os componentes do layout do dashboard  -->
<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer" />

    <v-container grid-list-md>
      <v-layout>
        <v-flex xs12>
          <slot />
        </v-flex>
      </v-layout>
    </v-container>

    <AppFloatingButton />

  </div>
</template>

<script>

import AppFloatingButton from './AppFloatingButton.vue'
import AppToolbar from './AppToolbar.vue'
import AppMenu from './AppMenu.vue'

export default {
  name: 'AppLayout',
  components: {
    AppFloatingButton,
    AppMenu,
    AppToolbar
  },
  data: () => ({
    drawer: false
  })
}
</script>

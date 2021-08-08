<template>
  <v-app>
    <v-app-bar app clipped-left clipped-right elevation="1" color="header">
      <v-btn icon to="/" exact>
        <v-icon color="#212121">{{ icons.mdiArrowLeft }}</v-icon>
      </v-btn>
      <v-toolbar-title class="title">game</v-toolbar-title>
      <v-spacer />
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
    <snackbar />
  </v-app>
</template>

<script>
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import { mdiArrowLeft } from '@mdi/js'

export default {
  name: 'game',
  data: () => ({
    icons: {
      mdiArrowLeft,
    },
  }),
}
</script>

<style>
* {
  font-display: swap;
}
.v-item-group.v-bottom-navigation .v-btn.v-size--default {
  height: inherit;
}
</style>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" lg="4" v-for="(game, i) in games" :key="i">
        <v-card :to="`/${game.creatorPlayer.uuid}`">
          <v-card-title>{{ game.creatorPlayer.name }}</v-card-title>
          <v-card-subtitle>{{ game.creatorPlayer.uuid }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      app
      fab
      bottom
      right
      fixed
      color="white"
      :to="`/${$store.state.uuid}`"
    >
      <v-icon>{{ icons.mdiPlus }}</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { mdiPlus } from '@mdi/js'

export default {
  data: () => ({
    icons: {
      mdiPlus,
    },
    webSocket: null,
    games: [],
  }),
  mounted() {
    this.webSocket = new WebSocket(`ws://${window.location.host}`)
    this.webSocket.onopen = (event) => {
      console.log('WebSocket connect success!')
    }
    this.webSocket.onerror = (event) => {
      console.error('WebSocket error:', event)
    }
    this.webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.action === 'gamesList') {
        this.games = message.data
      }
    }
  },
  methods: {},
}
</script>
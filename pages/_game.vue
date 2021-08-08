<template>
  <v-container>
    <v-sheet max-height="600px" max-width="600" class="mx-auto">
      <v-row>
        <v-col cols="12" v-if="notification.text">
          <v-alert :type="notification.type">
            {{ notification.text }}
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-row fill-height no-gutters>
            <v-col cols="4" v-for="(item, i) in game.grid" :key="i">
              <v-card
                outlined
                class="ma-1"
                @click="sendStep(i)"
                :color="game.winLine.includes(i) ? 'success' : ''"
              >
                <v-responsive :aspect-ratio="1 / 1">
                  <v-img
                    src="/img/cross.svg"
                    height="100%"
                    v-if="item === 'cross'"
                  />
                  <v-img
                    src="/img/circle.svg"
                    height="100%"
                    v-else-if="item === 'circle'"
                  />
                </v-responsive>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  layout: 'game',
  middleware: 'authenticated',
  data: () => ({
    icons: {},
    webSocket: null,
    notification: {
      type: '',
      text: '',
    },
    game: {
      grid: ['', '', '', '', '', '', '', '', ''],
      winLine: [],
      turn: false,
    },
  }),
  mounted() {
    this.webSocket = new WebSocket(`ws://${window.location.host}`)
    this.webSocket.onopen = (event) => {
      console.log('WebSocket connect success!')
      if (this.$route.params.game === this.$store.state.uuid) {
        this.webSocket.send(
          JSON.stringify({
            action: 'createGame',
            data: {
              playerData: {
                name: this.$store.state.name,
                uuid: this.$store.state.uuid,
              },
            },
          })
        )
        this.notification = {
          type: 'info',
          text: 'Ожидание опонента...',
        }
      } else {
        this.webSocket.send(
          JSON.stringify({
            action: 'connectToGame',
            data: {
              to: this.$route.params.game,
              playerData: {
                name: this.$store.state.name,
                uuid: this.$store.state.uuid,
              },
            },
          })
        )
        this.notification = {
          type: 'error',
          text: 'Ход врага!',
        }
      }
    }
    this.webSocket.onerror = (event) => {
      console.error('WebSocket error:', event)
    }
    this.webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.action === 'error') {
        this.$notifier.showMessage({
          content: message.data,
          color: 'error',
        })
      } else if (message.action === 'requestStep') {
        this.notification = {
          type: 'success',
          text: 'Ваш ход!',
        }
        this.game.turn = true
      } else if (message.action === 'updateGrid') {
        this.$set(this.game.grid, message.data.index, message.data.value)
      } else if (message.action === 'endGame') {
        this.game.turn = false
        this.game.winLine = message.data.winLine
        console.log(message.data.winLine)
        if (message.data.winUUID === this.$store.state.uuid) {
          this.$notifier.showMessage({
            content: 'Вы победили!',
            color: 'success',
          })
        } else {
          this.$notifier.showMessage({
            content: 'Вы проиграли!',
            color: 'error',
          })
        }
      }
    }
  },
  beforeDestroy() {
    this.webSocket.close()
  },
  methods: {
    sendStep(index) {
      if (this.game.turn && this.game.grid[index] === '') {
        this.game.turn = false
        this.webSocket.send(
          JSON.stringify({
            action: 'requestStep',
            data: {
              to: this.$route.params.game,
              from: this.$store.state.uuid,
              index: index,
            },
          })
        )
        this.notification = {
          type: 'error',
          text: 'Ход врага!',
        }
      }
    },
  },
}
</script>
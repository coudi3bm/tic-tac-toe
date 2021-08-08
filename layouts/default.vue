<template>
  <v-app>
    <v-app-bar app clipped-left clipped-right elevation="1" color="header">
      <v-img
        src="/favicon.svg"
        max-height="40"
        max-width="40"
        contain
        class="mr-1"
      />
      <v-toolbar-title class="title">tic-tac-toe</v-toolbar-title>
      <v-spacer />
      <v-dialog
        v-model="dialogSettings"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="icon" icon v-bind="attrs" v-on="on">
            <v-icon>{{ icons.mdiCog }}</v-icon>
          </v-btn>
        </template>
        <v-card tile>
          <v-toolbar dark color="primary">
            <v-btn icon color="white" @click="dialogSettings = false">
              <v-icon>{{ icons.mdiClose }}</v-icon>
            </v-btn>
            <v-toolbar-title>Настройки</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-sheet max-width="600" class="mx-auto pa-2">
            <v-text-field
              label="Имя"
              v-model.lazy="name"
              hide-details="auto"
              outlined
              dense
            />
          </v-sheet>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>

    <v-dialog v-model="dialogEditName" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> Введите имя </v-card-title>
        <v-card-text class="px-2 py-0">
          <v-text-field
            label="Имя"
            v-model.lazy="name"
            hide-details="auto"
            outlined
            dense
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="next" block>Продолжить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <snackbar />
  </v-app>
</template>

<script>
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import { uuidv4 } from '~/utils'
import { mdiClose, mdiCog } from '@mdi/js'

export default {
  name: 'default',
  data: () => ({
    icons: {
      mdiClose,
      mdiCog,
    },
    dialogSettings: false,
    dialogEditName: false,
  }),
  computed: {
    name: {
      get() {
        return this.$store.state.name
      },
      set(value) {
        this.$store.commit('setName', value)
      },
    },
  },
  mounted() {
    if (!this.$store.state.name) this.dialogEditName = true
  },
  methods: {
    next() {
      if (this.$store.state.name != '') {
        this.$store.commit('setUUID', uuidv4())
        this.dialogEditName = false
      }
    },
  },
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

export const state = () => ({
    name: '',
    uuid: ''
})

export const mutations = {
    setName(state, payload) {
        state.name = payload
    },
    setUUID(state, payload) {
        state.uuid = payload
    }
}

export const actions = {}
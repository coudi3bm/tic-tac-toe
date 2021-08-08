export default function ({ store, redirect }) {
    if (!store.state.name) {
        return redirect('/')
    }
}
import WebSocket from 'ws'
import { uuidv4 } from '../utils'
const wss = new WebSocket.Server({ noServer: true })
wss.broadcast = (msg) => {
    msg = JSON.stringify(msg)
    wss.clients.forEach(client => {
        client.send(msg)
    })
}
wss.sendGamesList = () => {
    wss.broadcast({
        action: 'gamesList', data: state.clearGamesList()
    })
}

function checkWin(grid, value) {
    const winGrid = [
        // Horizontal
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Vertical
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Cross
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (const line of winGrid) {
        let winCount = 0
        for (const i of line) {
            if (grid[i] === value)
                winCount++
        }
        if (winCount === 3)
            return { status: true, winLine: line }
    }
    return { status: false, winLine: [] }
}

function sendToPlayers(game, msg) {
    msg = JSON.stringify(msg)
    game.creatorPlayer.webSocket.send(msg)
    game.connectedPlayer.webSocket.send(msg)
}

const state = {
    games: [],
    clearGamesList() {
        return state.games.map(game => {
            return {
                creatorPlayer: {
                    name: game.creatorPlayer.name,
                    uuid: game.creatorPlayer.uuid
                },
                connectedPlayer: {
                    name: game.connectedPlayer.name,
                    uuid: game.connectedPlayer.uuid
                }
            }
        }).filter(game => game.connectedPlayer.name === '')
    },
    findIndex(uuid) {
        return state.games.findIndex(game => game.creatorPlayer.uuid === uuid)
    }
}

wss.on('connection', (ws) => {
    ws.on('close', () => {
        if (ws.uuid) {
            const index = state.games.findIndex(game => game.creatorPlayer.uuid === ws.uuid)
            if (index != -1) {
                state.games.splice(index, 1)
                wss.sendGamesList()
            }
        }
    })
    ws.on('message', data => {
        const message = JSON.parse(data)
        console.log(message)
        if (message.action === 'createGame') {
            if (!message.data.playerData.uuid) {
                ws.send(JSON.stringify(
                    {
                        action: 'error',
                        data: 'Пустой uuid'
                    }
                ))
                return
            }
            ws.uuid = message.data.playerData.uuid
            state.games.push({
                creatorPlayer: {
                    name: message.data.playerData.name,
                    uuid: message.data.playerData.uuid,
                    webSocket: ws
                },
                connectedPlayer: {
                    name: '',
                    uuid: '',
                    webSocket: null
                },
                state: {
                    grid: ['', '', '', '', '', '', '', '', ''],
                    turn: 'creatorPlayer'
                }
            })
            wss.sendGamesList()
        } else if (message.action === 'connectToGame') {
            const index = state.findIndex(message.data.to)
            if (index != -1) {
                state.games[index].connectedPlayer = {
                    name: message.data.playerData.name,
                    uuid: message.data.playerData.uuid,
                    webSocket: ws
                }
                state.games[index].creatorPlayer.webSocket.send(JSON.stringify(
                    {
                        action: 'requestStep',
                    }
                ))
                wss.sendGamesList()
            }
        } else if (message.action === 'requestStep') {
            const index = state.findIndex(message.data.to)
            if (index != -1) {
                let value = ''
                if (message.data.from === state.games[index].creatorPlayer.uuid) {
                    value = 'cross'
                    state.games[index].state.turn = 'connectedPlayer'
                    state.games[index].connectedPlayer.webSocket.send(JSON.stringify(
                        {
                            action: 'requestStep',
                        }
                    ))
                }
                else if (message.data.from === state.games[index].connectedPlayer.uuid) {
                    value = 'circle'
                    state.games[index].state.turn = 'creatorPlayer'
                    state.games[index].creatorPlayer.webSocket.send(JSON.stringify(
                        {
                            action: 'requestStep',
                        }
                    ))
                }
                state.games[index].state.grid[message.data.index] = value
                sendToPlayers(state.games[index], {
                    action: 'updateGrid',
                    data: {
                        index: message.data.index,
                        value: value
                    }
                })
                const win = checkWin(state.games[index].state.grid, value)
                if (win.status) {
                    console.log(`${value} Win!`)
                    sendToPlayers(state.games[index], {
                        action: 'endGame',
                        data: {
                            winUUID: value === 'cross' ? state.games[index].creatorPlayer.uuid : state.games[index].connectedPlayer.uuid,
                            winLine: win.winLine
                        }
                    })
                }
            }
        }
    })
    wss.sendGamesList()
})

export default function () {
    this.nuxt.hook('listen', server => {
        server.on('upgrade', (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, ws => {
                wss.emit('connection', ws)
            })
        })
    })
}
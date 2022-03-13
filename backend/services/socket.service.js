const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null

function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        // console.log('New socket', socket.id)
        socket.on('disconnect', () => {
            // console.log('Someone disconnected')
        })

        socket.on('enter workspace', () => {
            if (socket.workspace === 'workspace') {
                return
            };
            socket.join('workspace')
            socket.workspace = 'workspace'
        })

        socket.on('update workspace', () => {
            // console.log('Emitting workspace');
            gIo.to('workspace').emit('workspace has updated')
        })

        socket.on('enter board', boardId => {
            if (socket.board === boardId) return;
            if (socket.board) {
                socket.leave(socket.board)
            }
            socket.join(boardId)
            socket.board = boardId
        })
        socket.on('update board', boardId => {
            gIo.to(boardId).emit('board has updated', boardId)
        })
    })
}

async function broadcast({ type, data, room = null, userId }) {
    console.log('BROADCASTING', JSON.stringify(arguments));
    const excludedSocket = await _getUserSocket(userId)
    if (!excludedSocket) {
        // logger.debug('Shouldnt happen, socket not found')
        // _printSockets();
        return;
    }
    logger.debug('broadcast to all but user: ', userId)
    if (room) {
        excludedSocket.broadcast.to(room).emit(type, data)
    } else {
        excludedSocket.broadcast.emit(type, data)
    }
}


module.exports = {
    connectSockets,
}
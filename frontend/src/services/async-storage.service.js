import { utilService } from './util.service.js'

export const storageService = {
    query,
    get,
    post,
    put,
    remove,
    postMany,
    
}



function query(entityType, delay = 0) {
    var entities = JSON.parse(localStorage.getItem(entityType))
    if (!entities?.length) {
        entities = _createBoards()
        _save(entityType, entities)
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // reject('OOOOPs')
            resolve(entities)
        }, delay)
    })
    // return Promise.resolve(entities)
}

function get(entityType, entityId) {
    return query(entityType)
        .then(entities => entities.find(entity => entity._id === entityId))
}


function post(entityType, newEntity) {
    newEntity._id = _makeId()
    return query(entityType)
        .then(entities => {
            entities.push(newEntity)
            _save(entityType, entities)
            return newEntity
        })
}

function put(entityType, updatedEntity) {
    return query(entityType)
        .then(entities => {
            const idx = entities.findIndex(entity => entity._id === updatedEntity._id)
            entities.splice(idx, 1, updatedEntity)
            _save(entityType, entities)
            return updatedEntity
        })
}

function remove(entityType, entityId) {
    return query(entityType)
        .then(entities => {
            const idx = entities.findIndex(entity => entity._id === entityId)
            entities.splice(idx, 1)
            _save(entityType, entities)
        })
}


function _save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function postMany(entityType, newEntities) {
    return query(entityType)
        .then(entities => {
            newEntities = newEntities.map(entity => ({ ...entity, _id: _makeId() }))
            entities.push(...newEntities)
            _save(entityType, entities)
            return entities
        })
}

function _createBoards() {
    const boards = [
        _createBoard('TFQES', 'Bugs'),
        _createBoard('7zFUb', 'Todos'),
        _createBoard('uJSl0', 'QA')
    ]
    return boards
}

function _createBoard(_id = _makeId(), title) {
    return {
        _id,
        title,
        createdAt: 1589983468418,
        sortBy: { name: null, order: -1 },
        filterBy: {},
        createdBy: {
            _id: "u101",
            fullname: "Abi Abambi",
            imgUrl: "http://some-img"
        },
        style: {},
        statuses: [
            {
                id: "s101",
                title: "Done",
                color: "#00c875"
            },
            {
                id: "s102",
                title: "Ready for review",
                color: "#a25ddc"
            },
            {
                id: "s103",
                title: "Working on it",
                color: "#fdab3d"
            },
            {
                id: "s104",
                title: "Stuck",
                color: "#e2445c"
            },
            {
                id: "s105",
                title: "To do",
                color: "#c4c4c4"
            },
        ],
        priorities: [
            {
                id: "p101",
                title: "High",
                color: "#bb3354"
            },
            {
                id: "p102",
                title: "Medium",
                color: "#cab641"
            },
            {
                id: "p103",
                title: "Low",
                color: "#66ccff"
            },
            {
                id: "p104",
                title: "",
                color: "#c4c4c4"
            },

        ],
        members: [
            {
                _id: "u102",
                fullname: "Tal Tarablus",
                imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stoned_Fox.jpg/1200px-Stoned_Fox.jpg"
            },
            {
                _id: "u103",
                fullname: "Amitai Schapiro",
                imgUrl: "https://ca.slack-edge.com/T02BJ4W8H45-U02FR69PJG2-b5be0246d951-72"
            },
            {
                _id: "u104",
                fullname: "Omri Steinberg",
                imgUrl: "https://ca.slack-edge.com/T02BJ4W8H45-U02G1DTRWS3-d194bd058b90-512"
            },
            {
                _id: "u105",
                fullname: "Yarden Levy",
                imgUrl: "https://ca.slack-edge.com/T02BJ4W8H45-U02LCCZFQ8G-b2dbb5f8311a-512"
            },
        ],
        groups: [
            {
                id: 'g202',
                title: "Group 1",
                style: { backgroundColor: utilService.groupColorPicker() },
                stories: [
                    {
                        id: _makeId(),
                        title: "Replace logo",
                        createdAt: 123,
                        createdBy: {
                            _id: "u102",
                            fullname: "Tal Tarablus",
                            imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stoned_Fox.jpg/1200px-Stoned_Fox.jpg"
                        },
                        comments: [
                            {
                                id: 'c232',
                                txt: 'change the label',
                                imgUrl: null,
                                createdAt: 1611214354355,
                                byMember: {
                                    _id: 'u909',
                                    fullname: 'Yarden Levy',
                                    username: 'Yarden',

                                },
                                storyId: _makeId(),
                                groupId: 'g202'

                            }
                        ],
                        storyData: {
                            members: [
                                {
                                    _id: "u102",
                                    fullname: "Tal Tarablus",
                                    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stoned_Fox.jpg/1200px-Stoned_Fox.jpg"
                                }
                            ],
                            priority: {
                                id: "p104",
                                title: "",
                                color: "#c4c4c4"
                            },
                            status: {
                                id: "s101",
                                title: "Done",
                                color: "#00c875"
                            },
                            timeline: [null, null],
                            number: null,
                            link: { name: null, url: null },
                            dueDate: null,
                            file: null
                        }
                    },
                    {
                        id: _makeId(),
                        title: "Add Samples",
                        createdAt: 1234,
                        createdBy: {
                            _id: "u102",
                            fullname: "Tal Tarablus",
                            imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stoned_Fox.jpg/1200px-Stoned_Fox.jpg"
                        },
                        comments: [
                            {
                                id: 'c234',
                                txt: 'change the name',
                                imgUrl: null,
                                createdAt: 1611214354355,
                                byMember: {
                                    _id: 'u909',
                                    fullname: 'Yarden Levy',
                                    username: 'Yarden',

                                },
                                storyId: _makeId(),
                                groupId: 'g202',
                            }
                        ],
                        storyData: {
                            members: [
                                {
                                    _id: "u102",
                                    fullname: "Tal Tarablus",
                                    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stoned_Fox.jpg/1200px-Stoned_Fox.jpg"
                                }
                            ],
                            priority: {
                                id: "p101",
                                title: "High",
                                color: "#bb3354"
                            },
                            status: {
                                id: "s103",
                                title: "Working on it",
                                color: "#fdab3d"
                            },
                            timeline: [null, null],
                            number: null,
                            link: { name: null, url: null },
                            dueDate: null,
                            file: null
                        }
                    }
                ],
            },
            {
                id: 'g203',
                title: "Group 2",
                style: { backgroundColor: utilService.groupColorPicker() },
                stories: [
                    {
                        id: _makeId(),
                        title: "Replace logo",
                        createdAt: 123,
                        createdBy: {
                            _id: "u102",
                            fullname: "Tal Tarablus",
                            imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stoned_Fox.jpg/1200px-Stoned_Fox.jpg"
                        },
                        comments: [
                            {
                                id: 'c252',
                                txt: 'change the board',
                                imgUrl: null,
                                createdAt: 1611214354355,
                                byMember: {
                                    _id: 'u909',
                                    fullname: 'Yarden Levy',
                                    username: 'Yarden',

                                },
                                storyId: _makeId(),
                                groupId: 'g203'

                            }
                        ],
                        storyData: {
                            members: [
                                {
                                    _id: "u102",
                                    fullname: "Tal Tarablus",
                                    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stoned_Fox.jpg/1200px-Stoned_Fox.jpg"
                                }
                            ],
                            priority: {
                                id: "p102",
                                title: "Medium",
                                color: "#cab641"
                            },
                            status: {
                                id: "s102",
                                title: "Stuck",
                                color: "#e2445c"
                            },
                            timeline: [null, null],
                            number: null,
                            link: { name: null, url: null },
                            dueDate: null,
                            file: null
                        }
                    },
                    {
                        id: _makeId(),
                        title: "Add Samples",
                        createdAt: 1234,
                        createdBy: {
                            _id: "u102",
                            fullname: "Tal Tarablus",
                            imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stoned_Fox.jpg/1200px-Stoned_Fox.jpg"
                        },
                        comments: [
                            {
                                id: 'c235',
                                txt: 'change the game',
                                imgUrl: null,
                                createdAt: 1611214354355,
                                byMember: {
                                    _id: 'u909',
                                    fullname: 'Yarden Levy',
                                    username: 'Yarden',

                                },
                                storyId: _makeId(),
                                groupId: 'g203'

                            }
                        ],
                        storyData: {
                            members: [
                                {
                                    _id: "u102",
                                    fullname: "Tal Tarablus",
                                    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stoned_Fox.jpg/1200px-Stoned_Fox.jpg"
                                }
                            ],
                            priority: {
                                id: "p103",
                                title: "Low",
                                color: "#66ccff"
                            },
                            status: {
                                id: "s105",
                                title: "Ready for review",
                                color: "#a25ddc"
                            },
                            timeline: [null, null],
                            number: null,
                            link: { name: null, url: null },
                            dueDate: null,
                            file: null
                        }
                    }
                ],
            }
        ],
        activities: [
            {
                id: "a101",
                type: "Changed Color",
                createdAt: 154514,
                byMember: {
                    _id: "u101",
                    fullname: "Abi Abambi",
                    imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stoned_Fox.jpg/1200px-Stoned_Fox.jpg"
                },
                story: {
                    id: "c101",
                    title: "Replace Logo"
                },
                group: {
                    id: _makeId(),
                    title: 'group 1'
                }
            }
        ],
        cmpsOrder: [
            "status-picker",
            "member-picker",
            "priority-picker",
            'timeline-picker',
            'number-picker',
            'link-picker'
        ]
    }

}




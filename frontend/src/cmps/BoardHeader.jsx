import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { setStory } from '../store/board.action';

import { socketService } from '../services/socket.service';

export function _BoardHeader({ board, updateBoard, setStory }) {

    const { title, desc, members } = board
    const boardId = board._id

    const [isTitleEditOn, toggleTitleEdit] = useState(false)
    const [isDescEditOn, toggleDescEdit] = useState(false)
    const [isDescShow, toggleisDescShow] = useState(false)
    const [editBoard, setEditBoard] = useState({ title, desc: desc || '' })

    const titleRef = React.createRef()
    const decsRef = React.createRef()


    useEffect(() => {
        if (isTitleEditOn) titleRef.current.focus()
        if (isDescEditOn) decsRef.current.focus()

    }, [isTitleEditOn, isDescEditOn])


    useEffect(() => {
        setEditBoard({ title, desc })
    }, [board])


    const handleChange = ({ target }) => {
        const { name, value } = target
        if (value === ' ' || value === '\n') return
        setEditBoard({ ...editBoard, [name]: value })
    }

    const onSubmitTitle = async (ev) => {
        ev.preventDefault()
        toggleTitleEdit(false)
        const boardToUpdate = { ...board, title: editBoard.title }
        await updateBoard(boardToUpdate)
        socketService.emit('update workspace')
    }

    const onSubmitDesc = async (ev) => {
        ev.preventDefault()
        toggleDescEdit(false)
        const boardToUpdate = { ...board, desc: editBoard.desc }
        await updateBoard(boardToUpdate)
        socketService.emit('update workspace')
    }

    const onSetStory = async () => {
        const story = {
            boardId: board._id,
            groupId: 'none',
            storyId: 'none',
        };
        await setStory(story);
    };



    return (
        <div className='board-header'>

            <div className='title-and-action'>

                <div className='title-section'>
                    {!isTitleEditOn ? (
                        <h3 onClick={() => { toggleTitleEdit(true) }}>{title ? title : 'Enter title here'}</h3>
                    ) : (
                        <form onSubmit={onSubmitTitle}>
                            <input ref={titleRef} type="text" onBlur={onSubmitTitle}
                                value={editBoard.title} name="title" onChange={handleChange} />
                        </form>
                    )}
                    <div onClick={() => { toggleisDescShow(!isDescShow) }} className='fa-solid info-circle'></div>
                    <div className='fa star'></div>
                </div>

                <div className='header-actions'>
                    <div className='last-seen'>
                        Last seen
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stoned_Fox.jpg/1200px-Stoned_Fox.jpg" alt="Foxy Fox" />
                    </div>
                    <div className='invite'> <span className='fa-solid user-plus'></span> Invite / {members.length} </div>
                    <div className='activity' onClick={onSetStory}>  <span className='fa-solid chart-line'></span> Activity</div>
                    <div className='add-to-board'><span className='fa-solid plus'></span> Add to board</div>
                    <div className="options fa-solid ellipsis-h"></div>
                </div>

            </div>
            {!isDescShow &&
                <React.Fragment>
                    {!isDescEditOn ? (
                        <div className='description'
                            onClick={() => { toggleDescEdit(true) }}>{desc ? desc : 'Add description here'}</div>
                    ) : (
                        <form onSubmit={onSubmitDesc}>
                            <textarea ref={decsRef} type="text" onBlur={onSubmitDesc}
                                value={editBoard.desc} name="desc" onChange={handleChange} />
                        </form>
                    )}
                </React.Fragment>
            }
        </div>
    )
}


function mapStateToProps({ boardModule }) {
    return {
        // board: boardModule.board,
        // selectedBoard: boardModule.selectedBoard
        // users: state.userModule.users,
        // loggedInUser: state.userModule.loggedInUser
        // selectedStoryIds: boardModule.activityModalStory,
    };
}

const mapDispatchToProps = {
    setStory,
};

export const BoardHeader = connect(mapStateToProps, mapDispatchToProps)(_BoardHeader);

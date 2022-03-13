import React from 'react'
import { useState } from 'react'

import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import { utilService } from '../services/util.service';
import { socketService } from '../services/socket.service';
import { swalService } from '../services/swal.service';

export function _BoardPreview(props) {

    const { boards, board, removeBoard, addBoard, currBoard } = props

    const [anchorEl, setAnchorEl] = useState(null);
    const [isHover, toggleOnHover] = useState(false)

    const handleClick = (event) => {
        event.stopPropagation()
        toggleOnHover(true)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        if (event) event.stopPropagation()
        toggleOnHover(false)
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    const onRemove = async (ev, boardId) => {
        ev.stopPropagation()
        handleClose(null)
        const currBoardId = props.match.params.boardId
        if(currBoardId === '61f8f86b25bd9487389b2907') {
            swalService.onDeleteCoreSwal();
            return;
        }
        if (boardId === currBoardId) goToNextBoard(currBoardId)
        await removeBoard(boardId)
        socketService.emit('update workspace')
    }

    const goToNextBoard = (currBoardId) => {
        const nextBoard = boards.find(diffBoard => diffBoard._id !== currBoardId)
        props.history.push(`/board/${nextBoard?._id}/board`)
    }

    const onGoTo = () => {
        props.history.push(`/board/${board._id}/board`)
    }

    const onDuplicateBoard = async () => {
        const newBoard = { ...board }
        delete newBoard._id
        const newGroups = newBoard.groups.map(group => {
            return { ...group, id: utilService.makeId() }
        })
        newBoard.groups = newGroups
        const newStories = newGroups.map(newGroup => {
            return newGroup.stories.map(story => {
                return { ...story, id: utilService.makeId() }
            })
        })
        newBoard.groups.stories = newStories
        handleClose()
        await addBoard(newBoard)
        socketService.emit('update workspace')
    }

    return (

        <div className={currBoard?._id === board._id ?
            "board-preview curr-board" : "board-preview"}
            onClick={onGoTo}
            onMouseEnter={() => { toggleOnHover(true) }}
            onMouseOver={() => { toggleOnHover(true) }}
            onMouseLeave={() => { toggleOnHover(false) }} >
            <div>
                {/* <span className='fa-solid window'></span> */}
                <TableRowsOutlinedIcon className="board-icon" />
                <span>&nbsp;{board.title}</span>


            </div>

            <Button
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
                className={isHover ? "btn-ellipsis hover" : "btn-ellipsis"}
            >
                <span className="fa-solid ellipsis-h"></span>
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}>
                <Typography className="drop-down">
                    <span >
                        <span className="fa edit-hollow"></span>
                        <span>Rename Board</span>
                    </span>
                    <span onClick={onDuplicateBoard}>
                        <span className="fa copy"></span>
                        <span>Duplicate Board</span>
                    </span>
                    <span onClick={(ev) => { onRemove(ev, board._id) }}>
                        <span className="fa trash"></span>
                        <span>Delete</span>
                    </span>
                </Typography>

            </Popover>
        </div>


    )
}


export const BoardPreview = withRouter(_BoardPreview)




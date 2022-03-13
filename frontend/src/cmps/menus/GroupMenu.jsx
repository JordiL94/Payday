import React from 'react'
import { useState } from 'react'

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { utilService } from '../../services/util.service';
import { userService } from '../../services/user.service';
import { GroupColorMenu } from './GroupColorMenu';


export function GroupMenu({ board, group, updateBoard, groupColor }) {

    const newBoard = { ...board };
    const groupId = group.id;
    const groupIdx = board.groups.findIndex((group) => group.id === groupId);

    const currUser = userService.getMiniLoggedInUser()

    const [isOnHover, toggleHover] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    const onAddGroup = async () => {
        const newGroup = utilService.createEmptyGroup();

        if (!newBoard.groups?.length) newBoard.groups = [newGroup];
        else newBoard.groups.unshift(newGroup)

        addNewActivity('Group Added')
        await updateBoard(newBoard);
        handleClose()
    }

    const onRemoveGroup = async () => {
        newBoard.groups.splice(groupIdx, 1)
        addNewActivity('Group removed')
        await updateBoard(newBoard);
    }

    const onDuplicateGroup = async () => {
        const newGroup = {
            ...group,
            id: utilService.makeId(),
            title: group.title + ' (Copy)',
        }
        const newStories = newGroup.stories.map(story => {
            return { ...story, id: utilService.makeId() }
        })
        newGroup.stories = newStories
        newBoard.groups.unshift(newGroup)

        addNewActivity('Group duplicated')
        await updateBoard(newBoard)
        handleClose()
    }

    const addNewActivity = (type) => {
        const newActivity = {
            id: utilService.makeId(),
            type,
            createdAt: Date.now(),
            byMember: currUser,
            group: {
                id: groupId,
                title: group.title
            }
        }
        newBoard.activities.unshift(newActivity)
    }


    return (
        <div>

            <Button
                variant="contained"
                onClick={handleClick}
                className="group-menu-btn"
                onMouseEnter={() => { toggleHover(true) }}
                onMouseLeave={() => { toggleHover(false) }}
            >
                {isOnHover ? (
                    <span style={{ backgroundColor: 'white', color: groupColor, borderColor: groupColor }}
                        className="fa-solid caret-down"></span>
                ) : (
                    <span style={{ backgroundColor: groupColor, color: 'white', borderColor: groupColor }}
                        className="fa-solid caret-down"></span>
                )}

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
                <Typography className="drop-down group-drop-down-menu">
                    <span onClick={onAddGroup}>
                        <span className="fa-solid plus"></span>
                        <span>Add group</span>
                    </span>
                    <span>
                        <span className="fa edit-hollow"></span>
                        <span>Rename group</span>
                    </span>
                    <span onClick={onDuplicateGroup}>
                        <span className="fa copy"></span>
                        <span>Duplicate</span>
                    </span>
                    <GroupColorMenu board={board} group={group}
                        updateBoard={updateBoard} groupColor={groupColor}
                        closePrevMenu={handleClose} />
                    <span onClick={onRemoveGroup}>
                        <span className="fa trash"></span>
                        <span>Delete</span>
                    </span>
                </Typography>

            </Popover>
        </div>

    )
}




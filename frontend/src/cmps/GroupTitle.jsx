import React, { useState } from "react";



export function GroupTitle({ board, group, updateBoard }) {
    const { title } = group
    const groupColor = group.style.backgroundColor
    const newBoard = { ...board }
    const groupId = group.id
    const groupIdx = newBoard.groups.findIndex(group => group.id === groupId)


    const [isTitleEditOn, toggleEditTitle] = useState(false)
    const [titleInput, setTitleInput] = useState(title)


    const handleChange = ({ target }) => {
        const { value } = target
        if (value === ' ' || value === '\n') return
        setTitleInput(value)
    }

    const onSubmit = async (ev) => {
        ev.preventDefault()
        toggleEditTitle(false)
        const newGroup = { ...group, title: titleInput }
        newBoard.groups.splice(groupIdx, 1, newGroup)
        await updateBoard(newBoard)
    }

    return (
        <React.Fragment>
            {!isTitleEditOn ? (
                <h5 className="group-title" onClick={() => { toggleEditTitle(true) }} style={{ color: groupColor }}>{title}</h5>
            ) : (
                <form onSubmit={onSubmit} >
                    <input className="group-title-input" type="text" name="titleInput" value={titleInput}
                        onChange={handleChange} autoFocus
                        onBlur={onSubmit} autoComplete="off"
                        style={{ color: groupColor }} />
                </form>
            )}
        </React.Fragment>
    )
}


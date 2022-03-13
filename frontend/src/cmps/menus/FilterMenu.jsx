import React from 'react'
import { useState } from 'react'

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export function FilterMenu({ board, filterBy, setFilterBy }) {


    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const onSetFilter = (filterType, filterValueId) => {
        if (filterType === 'reset') {
            setFilterBy({})
        }
        setFilterBy({ [filterType]: filterValueId })
    }

    const { statuses, priorities, types } = board

    return (
        <React.Fragment>
            <Button
                variant="contained"
                onClick={handleClick}
                className="filter-menu-btn"
            >
                <span className="fa-solid chevron-down"></span>
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
                <Typography className="filter-drop-down">
                    <span >
                        <span>
                            <span className="type-header">Statuses</span>
                            {statuses.map(status => {
                                const { id, title, color } = status
                                return <span key={id}
                                    onClick={() => { onSetFilter('status', id) }}>
                                    <span className="color-indicator" style={{ backgroundColor: color }}></span>
                                    <span style={{ color }}>{title}</span>

                                </span>
                            })}
                        </span>
                        <span>
                            <span className="type-header">Priorities</span>
                            {priorities.map(priority => {
                                const { id, title, color } = priority
                                return <span key={id}
                                    onClick={() => { onSetFilter('priority', id) }}>
                                    <span className="color-indicator" style={{ backgroundColor: color }}></span>
                                    <span style={{ color }}>{title}</span>

                                </span>
                            })}
                        </span>
                        <span>
                            <span className="type-header">Types</span>
                            {types.map(type => {
                                const { id, title, color } = type
                                return <span key={id}
                                    onClick={() => { onSetFilter('type', id) }}>
                                    <span className="color-indicator" style={{ backgroundColor: color }}></span>
                                    <span style={{ color }}>{title}</span>

                                </span>
                            })}
                        </span>
                    </span>
                    <span onClick={() => onSetFilter('reset')}>
                        <span>
                            <span className="fa-solid undo"></span>
                            <span>Reset defualt</span>
                        </span>
                    </span>
                </Typography>

            </Popover>
        </React.Fragment>

    )
}




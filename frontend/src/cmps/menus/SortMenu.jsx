import React from 'react'
import { useState } from 'react'

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';


export function SortMenu({ onSetSort }) {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <React.Fragment>
            <Button
                variant="contained"
                onClick={handleClick}
                className="sort-menu-btn"
            >
                <SyncAltRoundedIcon className="sort-icon" />
                <span>Sort</span>
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
                <Typography className="drop-down sort-drop-down">
                    <span onClick={() => onSetSort('name')}>
                        <span className="fa-solid font"></span>
                        <span>Sort by name</span>
                    </span>
                    <span onClick={() => onSetSort('status')}>
                        <span className="fa-solid traffic-light"></span>
                        <span>Sort by status</span>
                    </span>
                    <span onClick={() => onSetSort('priority')}>
                        <span className="fa-solid align-center"></span>
                        <span>Sort by priority</span>
                    </span>
                    <span onClick={() => onSetSort(null)}>
                        <span className="fa-solid undo"></span>
                        <span>Reset defualt</span>
                    </span>
                </Typography>

            </Popover>
        </React.Fragment>

    )
}




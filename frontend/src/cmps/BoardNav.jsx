import { useState } from 'react';
import { connect } from 'react-redux'
import { NavLink, Route } from "react-router-dom";

import GmailLogo from '../assets/img/gmail-icon.png'
import AbodeLogo from '../assets/img/adobe-icon.png'

import { GroupList } from './GroupList'

// MIU icons

// import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
// import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';


function _BoardNav({ board, toggleIsDashboard }) {

    const [isAnimationOn, setAnimation] = useState(false)
    const [isInegrateHoverOn, setIntegrateHover] = useState(false)


    const onSetAnimation = () => {
        setAnimation(true)
        let timeoutId = setTimeout(() => {
            clearInterval(timeoutId)
            setAnimation(false)
        }, 1000)
    }

    return (
        <div className='board-nav'>

            <div className='navs-container'>
                <NavLink activeClassName="my-active" exact to={`/board/${board._id}/board`} onClick={() => toggleIsDashboard(false)}> <span className='fa-solid home'></span> Main Table</NavLink>
                <NavLink activeClassName="my-active" to={`/board/${board._id}/kanban`}> <span className='fa list-alt'></span> Kanban</NavLink>
                <NavLink activeClassName="my-active" to={`/board/${board._id}/dashboard`} onClick={() => toggleIsDashboard(true)}> <span className='fa chart-bar'></span> Dashboard</NavLink>
            </div>

            <div className='actions-container'>
                <div onMouseEnter={() => { setIntegrateHover(true) }}
                    onMouseLeave={() => { setIntegrateHover(false) }}
                    className={isInegrateHoverOn ? 'integrate hover' : 'integrate'}>
                    <span className='fa-solid plug'></span> <span className='txt'>Integrate</span>
                    <img src={GmailLogo} alt="Gmail Logo" />
                    <img src={AbodeLogo} alt="Abobe Logo" />
                </div>
                <div><span className='fa-solid robot'></span> Automate</div>
                <button onMouseEnter={onSetAnimation} className='btn-collapse'>
                    <span className={isAnimationOn ? 'fa-solid chevron-up animation' : 'fa-solid chevron-up'}></span></button>
            </div>
        </div>
    )

}



function mapStateToProps({ boardModule }) {
    return {
    }
}

const mapDispatchToProps = {

}



export const BoardNav = connect(mapStateToProps, mapDispatchToProps)(_BoardNav)
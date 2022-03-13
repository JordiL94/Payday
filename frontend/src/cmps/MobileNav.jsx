import { useState } from "react"
import { NavLink } from "react-router-dom"

export function MobileNav({ selectedBoard, boards, toggleIsDashboard }) {

    const [isNavOpen, toggleNav] = useState(null)


    return <nav className={`mobile-nav ${isNavOpen ? 'nav-active' : ''}`}>
        <div className="nav-logo">
            <h4>Payday</h4>
        </div>
        <ul className={`nav-links ${isNavOpen ? 'open' : ''}`}>
            <li onClick={() => {
                toggleNav(false);
                toggleIsDashboard(false)
            }} key="mnav-1">
                <NavLink className='mobile-link' exact to={'/board'}>Home</NavLink>
            </li>
            <li onClick={() => {
                toggleNav(false);
                toggleIsDashboard(false)
            }}
                key="mnav-2">
                <NavLink className='mobile-link' to={`/board/${selectedBoard._id}/kanban`}>Kanban</NavLink>
            </li>
            <li onClick={() => {
                toggleNav(false);
                toggleIsDashboard(true)
            }}
                key="mnav-3">
                <NavLink className='mobile-link' to={`/board/${selectedBoard._id}/dashboard`}>Dashboard</NavLink>
            </li>
            <span>Your boards:</span>
            {/* <li><NavLink className='mobile-link' to={`/board/${selectedBoard._id}/board`}>Current Board</NavLink></li> */}
            {boards.map((board, idx) => {
                return (
                    <li
                        onClick={() => { toggleNav(false); toggleIsDashboard(false) }} key={idx}>
                        <NavLink className='mobile-link' to={`/board/${board._id}/board`}>{board.title}</NavLink>
                    </li>)
            })}
        </ul>
        <div className={`burger ${isNavOpen ? 'toggle' : ''}`} onClick={() => toggleNav(!isNavOpen)}>
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
        </div>
    </nav>
}
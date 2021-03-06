import React, { useEffect, useState } from 'react'
import { BoardFilterItem } from './BoardFilterItem.jsx'

export const BoardFilter = (props) => {

    const [currFilterBy, setFilterBy] = useState({
        txt: '',
        membersId: [],
        priority: [],
        status: [],
    })

    useEffect(() => {
        setFilterBy(props.filterBy)
        //  eslint-disable-next-line
    }, [])

    const setFilter = (field, item) => {
        const newFilter = { ...currFilterBy }
        console.log(newFilter);
        if (field === 'status' || field === 'priority' || field === 'tag') {
            console.log(newFilter);
            if (newFilter[field].includes(item)) {
                const filteredLabels = newFilter[field].filter(field => field !== item)
                newFilter[field] = filteredLabels
                console.log(newFilter);
            }
            else newFilter[field] = [...newFilter[field], item]
            // console.log(newFilter);
        } else if (field === 'membersId') {
            if (newFilter[field].includes(item)) {
                const filteredMembers = newFilter[field].filter(memberId => memberId !== item)
                newFilter[field] = filteredMembers
            }
            else newFilter[field] = [...newFilter[field], item]
        }
        // console.log(this.props);
        setFilterBy(newFilter)
    }

    useEffect(() => {
        props.filterBoard({ ...currFilterBy })
        //  eslint-disable-next-line
    }, [currFilterBy])

    const { board, filterBy } = props
    if (!currFilterBy || !board) return <div>loading</div>
    return (
        <div className="board-filter fade-in">
            <div className="filter">
					<span className="fa-solid filter"></span>
					<span>Filter</span>
					<span className="fa-solid chevron-down"></span>
				</div>
            <div className=" filter-groups flex flex-column">
                <div className="filter-group status">
                    <h1>Status:</h1>
                    {board.statusLabels.map(status => status.title !== '' && < BoardFilterItem type='status' filterBy={filterBy.status} key={status.id} field={status} setFilter={setFilter} />)}
                </div>
                <div className="filter-group priority">
                    <h1>Priority:</h1>
                    {board.priorityLabels.map(priority => priority.title !== '' && < BoardFilterItem type='priority' filterBy={filterBy.priority} key={priority.id} field={priority} setFilter={setFilter} />)}
                </div>
                <div className="filter-group tag">
                    <h1>Tags:</h1>
                    {board.tags.map(tag => < BoardFilterItem type='tag' filterBy={filterBy.tag} key={tag.id} field={tag} setFilter={setFilter} />)}
                </div>
                <div className="filter-group member">
                    <h1>Members:</h1>
                    {board.members.map(member => < BoardFilterItem type='membersId' filterBy={filterBy.membersId} key={member._id} field={member} setFilter={setFilter} />)}
                </div>
            </div>
        </div>
    )

}
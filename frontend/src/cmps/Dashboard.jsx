import { connect } from 'react-redux'
import ListIcon from '@mui/icons-material/List';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
// import SplitscreenIcon from '@mui/icons-material/Splitscreen';
// import ChatIcon from '@mui/icons-material/Chat';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { DashboardCharts } from './DashboardCharts';



export function _Dashboard(props) {
    const board = props.selectedBoard

    const getStoriesCount = () => {
        let count = 0
        board.groups.map(group => {
            group.stories.map(story => {
                count++
            })
        })
        return count
    }

    const getStatusCount = () => {
        let count = { s101: 0, s102: 0, s103: 0, s104: 0, s105: 0 }
        board.groups.map(group => {
            return group.stories.map(story => {
                const status = story.storyData.status.id
                return count[status]++
            })
        })
        return [count.s101, count.s102, count.s103, count.s104, count.s105]
    }

    const getStoriesPerGroupCount = () => {
        const storyCount = board.groups.map(group => {
            return group.stories.length
        })
        return storyCount
    }

    const getGroupNames = () => {
        const names = board.groups.map(group => {
            return group.title
        })
        return names
    }
    const getMembersPerStory = () => {
        let members = []
        board.groups.map(group => {
            return group.stories.map(story => {
                return members.push(story.storyData.members.length)
            })
        })
        return members
    }



    const getPriorityNames = () => {
        const names = board.priorities.map(priority => {
            if (priority.title === '') return 'None'
            return priority.title
        })
        return names
    }

    const getPriorityCount = () => {
        let count = { p101: 0, p102: 0, p103: 0, p104: 0, }
        board.groups.map(group => {
            return group.stories.map(story => {
                const priority = story.storyData.priority.id
                return count[priority]++
            })
        })
        return [count.p101, count.p102, count.p103, count.p104]
    }











    return (
        <section className='dashboard-container'>

            <div className='dashboard-stats-container' >
                <div className='groups-stats'>
                    <div className='stats-icon' ><ListIcon /></div>
                    <div className='inner-stats'>
                        <div>{board.groups.length}</div>
                        <div>Groups</div>
                    </div>
                </div>
                <div className='stories-stats'>
                    <div className='stats-icon' ><HorizontalRuleIcon /></div>
                    <div className='inner-stats'>
                        <div>{getStoriesCount()}</div>
                        <div>Stories</div>
                    </div>
                </div>
                <div className='members-stats'>
                    <div className='stats-icon' ><AssignmentIndIcon /></div>
                    <div className='inner-stats'>
                        <div>{board.members.length}</div>
                        <div>Members</div>
                    </div>
                </div>
                <div className='activities-stats'>
                    <div className='stats-icon' ><MonitorHeartIcon /></div>
                    <div className='inner-stats'>
                        <div>{board.activities.length}</div>
                        <div>Activities</div>
                    </div>
                </div>
            </div>
            <DashboardCharts statusCount={getStatusCount()} storiesPerGroup={getStoriesPerGroupCount()}
                groupNames={getGroupNames()} priorityNames={getPriorityNames()} priorityCount={getPriorityCount()} membersPerStory={getMembersPerStory()} />


        </section>
    )

}



function mapStateToProps({ boardModule }) {
    return {
        // boards: boardModule.boards,
        selectedBoard: boardModule.selectedBoard,
        // selectedStoryIds: boardModule.activityModalStory
        // filterBy: state.boardModule.filterBy,
        // users: state.userModule.users,
        // loggedInUser: state.userModule.loggedInUser
    }
}

const mapDispatchToProps = {
    // setStory,
    // updateBoard
    // loadBoards,
    // getById,
}



export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(_Dashboard)


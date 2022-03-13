import { connect } from 'react-redux'
import { setStory } from '../store/board.action'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { utilService } from '../services/util.service'
import { userService } from '../services/user.service'
import { ModalUpdatePreview } from './ModalUpdatePreview'
import { cloudinaryService } from '../services/cloudinary.service'

import ActivitySvg from '../assets/img/activity-log.svg'

export function _ActivityModal(props) {

    const [isActivityShown, setActivityToggle] = useState(null)
    const [comment, setComment] = useState('')
    const [isUpdateFocused, setUpdateFocus] = useState(false)

    const { selectedStoryIds, selectedBoard } = props

    const onRemoveStory = async () => {
        const story = {
            boardId: null,
            groupId: null,
            storyId: null
        }
        await props.setStory(story)
    }

    useEffect(() => {
        if (!isUpdateFocused) setComment('')
    }, [isUpdateFocused])

    const [img, setImg] = useState({
        imgUrl: null,
        height: '40px',
        width: '100%',
        isUploading: false
    })

    const uploadImg = async (ev) => {
        setImg({ ...img, isUploading: true, height: 500, width: 500 })
        const { secure_url, height, width } = await cloudinaryService.uploadImg(ev)
        setImg({ isUploading: false, imgUrl: secure_url, height, width })
    }

    const { groupId, storyId } = selectedStoryIds


    const getStory = () => {
        if (!storyId) return null
        if (storyId === 'none') return 'none'
        const groupIdx = selectedBoard.groups.findIndex((group) => group.id === groupId)
        const storyIdx = selectedBoard.groups[groupIdx].stories.findIndex((story) => story.id === storyId)
        const story = selectedBoard.groups[groupIdx].stories[storyIdx]

        return story

    }
    let story = getStory()


    const getInitials = (fullname) => {
        const nameArr = fullname.split(' ');
        const fName = nameArr[0].split('');
        const lName = nameArr[1].split('');
        const initials = fName[0] + lName[0];
        return initials
    }

    const onAddComment = () => {
        setUpdateFocus(false)
        if (!comment && !img.imgUrl) return
        const newComment = {
            id: utilService.makeId(),
            txt: comment,
            imgUrl: img.imgUrl,
            createdAt: Date.now(),
            byMember: userService.getMiniLoggedInUser(),
            groupId: groupId,
            storyId: story.id
        }
        story.comments.unshift(newComment)
        onUpdateStory(story)
        setComment('')
        setImg({ ...img, imgUrl: null, height: '40px', width: '40px' })
    }

    const getCurrStory = (commentId) => {
        let story
        props.board.groups.forEach(group => {
            group.stories.forEach(currStory => {
                currStory.comments.forEach(comment => {
                    if (comment.id === commentId && comment.storyId === currStory.id) {
                        story = currStory
                    }
                })
            })
        })
        return story
    }

    const onRemoveComment = (comment) => {
        if (!story) {
            story = getCurrStory(comment.id)
        }
        const commentId = comment.id
        const commentIdx = story.comments.findIndex(comment => comment.id === commentId)
        story.comments.splice(commentIdx, 1)
        onUpdateStory(story, comment.groupId)
    }

    const onUpdateStory = (updatedStory, currGroupId = null) => {
        const newBoard = { ...selectedBoard }
        if (!currGroupId) currGroupId = groupId

        const groupIdx = newBoard.groups.findIndex(group => group.id === currGroupId)

        const group = newBoard.groups.find(group => group.id === currGroupId)
        const storyIdx = group.stories.findIndex(story => story.id === storyId)
        newBoard.groups[groupIdx].stories.splice(storyIdx, 1, updatedStory)
        props.updateBoard(newBoard)
    }

    const handleChange = ({ target }) => {
        const { value } = target
        if (value === ' ' || value === '\n') return
        setComment(value)
    }

    const getActivities = () => {
        if (story === 'none') return selectedBoard.activities
        return selectedBoard.activities.filter(activity => {
            if (!activity.story) return
            return activity.story.id === story.id
        })
    }


    const getIconPerActions = (activityType) => {
        const actionType = activityType.substring(activityType.indexOf(' ') + 1, activityType.length)
        switch (actionType) {
            case 'added':
                return 'fa-solid plus'
            case 'deleted':
                return 'fa trash'
            case 'removed':
                return 'fa trash'
            case 'duplicated':
                return 'fa copy'
            case 'color':
                return 'fa-solid color'
            case 'changed':
                return 'fa-solid exchange-alt'
            default:
                break
        }
    }

    const getGroupColor = (groupId) => {
        const group = selectedBoard.groups.find(group => group.id === groupId)
        const color = group?.style?.backgroundColor
        if (!color) return '#676879'
        else return color
    }

    if (!story) return <React.Fragment></React.Fragment>
    return (
        <div className={`activity-modal ${props.selectedStoryIds.storyId ? 'open' : ''}`}>
            <div className="top-section">
                <button onClick={() => { onRemoveStory() }} className="btn-close-modal fa-solid times" ></button>
                {story !== 'none' ? <div className="modal-story-name">
                    <h3>{story ? story.title : ' '}</h3>
                </div> : ''}
                <div className="update-activity-container">
                    {story !== 'none' ? <div >
                        <div onClick={() => setActivityToggle(false)} className='modal-updates'>Updates</div>
                        <div className={`modal-border-bottom ${!isActivityShown ? 'active' : ''}`} ></div>
                    </div>
                        : ''}
                    {story !== 'none' ? <div className="horiz-break-line"></div> : ''}
                    <div>
                        <div onClick={() => setActivityToggle(true)} className='modal-activity'>Activity Log</div>
                        <div className={`modal-border-bottom ${isActivityShown ? 'active' : ''}`} ></div>
                    </div>
                </div>
            </div>

            <div className="modal-break-line"></div>

            <div className="bottom-section">
                {!isActivityShown && story !== 'none' &&
                    <React.Fragment>
                        <div className="update-input">
                            {!isUpdateFocused ? (
                                <input type="text" placeholder='Write an update...' onClick={() => setUpdateFocus(true)} />
                            ) : (
                                <textarea name="update" className={isUpdateFocused ? "open" : ""} value={comment} onChange={handleChange}
                                    autoFocus={true}  >
                                </textarea>
                            )}


                            {img.imgUrl && <img src={img.imgUrl} alt="" />}
                            <div className='modal-update-btns' >
                                <div className='file-input-container'>
                                    <span className="fa-solid plus"></span>
                                    <input className='file-input' type="file" accept='img/*' onChange={uploadImg} />
                                    <span>Add file</span>
                                </div>
                                <div>
                                    <button className="btn-cancel" onClick={() => setUpdateFocus(false)}>Cancel</button>
                                    <button className="btn-update" onClick={onAddComment} >Update</button>
                                </div>
                            </div>
                        </div>
                        <div className='updates-list' >

                            {story.comments.map(comment => {
                                return <ModalUpdatePreview key={comment.id} comment={comment}
                                    onRemoveComment={onRemoveComment} getInitials={getInitials}
                                    imgUrl={comment.byMember.imgUrl} />
                            }
                            )}
                            {!story.comments.length && (
                                <div className="logo-container">
                                    <img src={ActivitySvg} alt="" />
                                    <span>No updates yet for this item</span>
                                </div>
                            )}
                        </div>
                    </React.Fragment>}
                {(story === 'none' || isActivityShown) && <div>
                    {getActivities()?.map((activity) => {
                        const icon = getIconPerActions(activity.type)
                        const groupColor = getGroupColor(activity.group.id)
                        const { imgUrl } = activity.byMember
                        return (
                            <div key={activity.id} className='activity-preview' >
                                <div className='activity-time' >
                                    <span className="fa clock"></span>
                                    <span>{moment(activity.createdAt).fromNow()}</span>
                                </div>
                                <div className='activity-member' >
                                    <div className='member-img'>
                                        {imgUrl ? <img src={imgUrl} alt="" />
                                            : getInitials(activity.byMember.fullname)}
                                    </div>
                                    <div className='story-title'>{activity.story?.title}</div>
                                </div>
                                <div className="flex align-center">
                                    <span className={icon} style={{ color: groupColor }}></span>
                                    <div>{activity.type}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>}
            </div>
        </div >
    )
}


function mapStateToProps({ boardModule }) {
    return {
        selectedStoryIds: boardModule.activityModalStory
    }
}

const mapDispatchToProps = {
    setStory,
}



export const ActivityModal = connect(mapStateToProps, mapDispatchToProps)(_ActivityModal)
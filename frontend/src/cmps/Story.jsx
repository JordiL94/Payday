import React, { useState } from 'react';
import { DynamicCmp } from './dynamicCmps/DynamicCmp';
import { connect } from 'react-redux';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';

import { setStory } from '../store/board.action';
import { boardService } from '../services/board.service';
import { utilService } from '../services/util.service';
import { userService } from '../services/user.service'

export function _Story(props) {
	const { board, group, story, updateBoard, filterBy, updateWhileFilterSort } = props;

	const currUser = userService.getMiniLoggedInUser()
	const { cmpsOrder } = board;
	const newBoard = { ...board };
	const groupId = group.id;
	const groupIdx = board.groups.findIndex((group) => group.id === groupId);
	const storyId = story.id;
	const storyIdx = group.stories.findIndex((story) => story.id === storyId);

	const [isTitleEditOn, toggleTitleEdit] = useState(false);
	const [newStoryTitle, setStoryTitle] = useState({ title: story.title });

	const handleChange = ({ target }) => {
		const { name, value } = target;
		setStoryTitle({ ...newStoryTitle, [name]: value });
	};

	const onSubmitTitle = async (ev) => {
		if(filterBy.name || filterBy.status || filterBy.priority || filterBy.members) {
			updateWhileFilterSort();
			return;
		} else if(board.sortBy.name) {
			updateWhileFilterSort();
			return;
		}
		ev.preventDefault();
		toggleTitleEdit(false);
		const storyToUpdate = { ...story, title: newStoryTitle.title };
		onUpdateBoard(storyToUpdate);
	};

	const onUpdateBoard = async (storyToUpdate) => {
		newBoard.groups[groupIdx].stories.splice(storyIdx, 1, storyToUpdate);
		await updateBoard(newBoard);
	};

	const onUpdateStory = async (dataType, data) => {
		if(filterBy.name || filterBy.status || filterBy.priority || filterBy.members) {
			updateWhileFilterSort();
			return;
		} else if(board.sortBy.name) {
			updateWhileFilterSort();
			return;
		}
		const newStory = { ...story };
		let newData;

		switch (dataType) {
			case 'CHANGE_STATUS':
				newData = await boardService.getStatusById(board._id, data);
				newStory.storyData.status = newData;
				addNewActivity('Status changed')
				break;
			case 'CHANGE_PRIORITY':
				newData = await boardService.getPriorityById(board._id, data);
				newStory.storyData.priority = newData;
				addNewActivity('Priority changed')
				break;
			case 'ADD_MEMBER':
				newData = await boardService.getMemberById(board._id, data);
				const memberIdx = newStory.storyData.members.findIndex((member) => {
					return member._id === data;
				});

				if (memberIdx >= 0) newStory.storyData.members.splice(memberIdx, 1);
				else newStory.storyData.members.push(newData);
				addNewActivity('Member added')
				break;
			case 'CHANGE_TIMELINE':
				newData = await boardService.updateTimeline(data);
				newStory.storyData.timeline = newData;
				addNewActivity('Timeline changed')
				break;
			case 'CHANGE_NUMBER':
				newStory.storyData.number = data;
				addNewActivity('Number added')
				break;
			case 'CHANGE_LINK':
				newStory.storyData.link = data;
				addNewActivity('Link changed')
				break;
			case 'CHANGE_DUE_DATE':
				newStory.storyData.dueDate = data;
				addNewActivity('Due date changed');
				break;
			case 'CHANGE_TYPE':
				newData = await boardService.getTypeById(board._id, data);
				newStory.storyData.type = newData;
				addNewActivity('Type changed')
				break;
			default:
				break;
		}
		onUpdateBoard(newStory);
	};

	const addNewActivity = (type) => {
		const newActivity = {
			id: utilService.makeId(),
			type,
			createdAt: Date.now(),
			byMember: currUser,
			story: {
				id: story.id,
				title: story.title
			},
			group: {
				id: groupId,
				title: group.title
			}
		}
		newBoard.activities.unshift(newActivity)
	}

	const onSetStory = async (boardId, groupId, storyId) => {
		const story = {
			boardId,
			groupId,
			storyId,
		};
		await props.setStory(story);
	};

	return (
		<div className="story">
			<div className="story-wrapper">
				<div className="story-txt-area">
					<div
						className="story-selector"
						style={{
							backgroundColor: group.style.backgroundColor,
						}}></div>
					<div className="story-txt">
						<div className="story-editor">
							{isTitleEditOn ? (
								<form onSubmit={onSubmitTitle}>
									<input
										autoFocus={true}
										type="text"
										onBlur={onSubmitTitle}
										value={newStoryTitle.title}
										name="title"
										onChange={handleChange}
									/>
								</form>
							) : (
								<div className="story-title" onClick={() =>toggleTitleEdit(!isTitleEditOn)} >{story.title}</div>
							)}
							{!isTitleEditOn && (
								<button
									onClick={() =>
										toggleTitleEdit(!isTitleEditOn)
									}
									className="edit-title">
									Edit
								</button>
							)}
						</div>
						<div className="story-update-icons">
							<MapsUgcOutlinedIcon
								onClick={() =>
									onSetStory(board._id, group.id, story.id)
								}
								className={`update-bubble ${story.comments?.length ? 'blue' : ''}`}
							/>
							{story.comments?.length ? (
								<div className="updates-count-bubble">
									{story.comments.length}
								</div>
							) : (
								''
							)}
						</div>
					</div>
				</div>
				{cmpsOrder.map((cmp, idx) => {
					return (
						<DynamicCmp
							key={idx}
							cmp={cmp}
							story={story}
							onUpdate={(dataType, data) =>
								onUpdateStory(dataType, data)
							}
							board={board}
							group={group}
						/>
					);
				})}
			</div>
			<div className="story-close-wrapper">
				<div className="add-col"></div>
				<div className="story-closer"></div>
			</div>
		</div>
	);
}

function mapStateToProps({ boardModule }) {
	return {
		// board: boardModule.board,
		// users: state.userModule.users,
		// loggedInUser: state.userModule.loggedInUser
		selectedStoryIds: boardModule.activityModalStory,
	};
}

const mapDispatchToProps = {
	setStory,
};

export const Story = connect(mapStateToProps, mapDispatchToProps)(_Story);

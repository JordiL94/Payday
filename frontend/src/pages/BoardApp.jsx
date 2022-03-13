import React, { useState, useEffect } from 'react';

import { Switch, Route } from 'react-router';

import { BoardNav } from '../cmps/BoardNav';
import { BoardHeader } from '../cmps/BoardHeader';
import { BoardActions } from '../cmps/BoardActions';
import { GroupList } from '../cmps/GroupList';
import { Kanban } from '../cmps/kanban/Kanban';
import { Dashboard } from '../cmps/Dashboard';
import { MobileNav } from '../cmps/MobileNav';

import { ActivityModal } from '../cmps/ActivityModal';

import { socketService } from '../services/socket.service';
import { SideBar } from '../cmps/SideBar.jsx';
import { BoardList } from '../cmps/BoardList.jsx';
import { connect } from 'react-redux';
import { loadBoards, getById, removeBoard, updateBoard, addBoard, setStory, setFilterBy, } from '../store/board.action';
import { swalService } from '../services/swal.service';


function _BoardApp({ match, loadBoards, getById, boards, selectedBoard, updateBoard, removeBoard, addBoard, setStory, selectedStoryIds, setFilterBy, filterBy }) {

	const { boardId } = match.params;
	const [filteredBoard, setFilteredBoard] = useState(null);
	const [isDashboard, toggleIsDashboard] = useState(false)


	useEffect(() => {
		async function fetchData() {
			await loadBoards();
			await getById(boardId);
		}
		fetchData()
		socketService.setup();
		socketService.on('board has updated', async (updatedBoardId) => {
			await getById(updatedBoardId);
		});
		return () => {
			socketService.terminate();
		};
	}, [boardId, getById, loadBoards]);


	useEffect(() => {
		async function fetchData() {
			await getById(boardId);
			setFilterBy({
				name: null,
				priority: null,
				status: null,
				members: null,
			});
		}
		fetchData()
		socketService.emit('enter board', boardId);
	}, [match.params, boardId, getById, loadBoards, setFilterBy]);

	useEffect(() => {
		async function fetchData() {

			const board = JSON.parse(JSON.stringify(selectedBoard));

			if (filterBy) {
				if (filterBy?.name) {
					board.groups.forEach((group, idx) => {
						const stories = group.stories.filter((story) => {
							return story.title
								.toLowerCase()
								.includes(filterBy.name);
						});
						board.groups[idx].stories = stories;
					});
				}
				if (filterBy?.priority) {
					board.groups.forEach((group, idx) => {
						const stories = group.stories.filter((story) => {
							return (
								story.storyData.priority.id === filterBy.priority
							);
						});
						board.groups[idx].stories = stories;
					});
				}
				if (filterBy?.status) {
					board.groups.forEach((group, idx) => {
						const stories = group.stories.filter((story) => {
							return story.storyData.status.id === filterBy.status;
						});
						board.groups[idx].stories = stories;
					});
				}
				if (filterBy?.type) {
					board.groups.forEach((group, idx) => {
						const stories = group.stories.filter((story) => {
							return story.storyData.type.id === filterBy.type;
						});
						board.groups[idx].stories = stories;
					});
				}
				if (filterBy?.members) {
					board.groups.forEach((group, idx) => {
						const stories = group.stories.filter((story) => {
							return story.storyData.members.some((member) => {
								return member._id === filterBy.members
							});
						});
						board.groups[idx].stories = stories;
					});
				}
			}

			setFilteredBoard(board);

		}
		fetchData()
	}, [filterBy, selectedBoard])

	const onSetSort = async (type) => {
		const newBoard = JSON.parse(JSON.stringify(selectedBoard));
		const sortBy = newBoard.sortBy;
		if (type === sortBy.name) sortBy.order *= -1;
		else {
			sortBy.name = type;
			sortBy.order = -1;
		}

		let newGroups = newBoard.groups.map((group) => {
			const newStories = group.stories.sort(function (a, b) {
				switch (sortBy.name) {
					case 'name':
						if (a.title.toLowerCase() < b.title.toLowerCase()) return sortBy.order;
						else if (a.title.toLowerCase() > b.title.toLowerCase()) return sortBy.order * -1;
						else return 0;
					case 'status':
						if (a.storyData.status.id < b.storyData.status.id) return sortBy.order;
						else if (a.storyData.status.id > b.storyData.status.id) return sortBy.order * -1;
						else return 0;
					case 'priority':
						if (a.storyData.priority.id < b.storyData.priority.id) return sortBy.order;
						else if (a.storyData.priority.id > b.storyData.priority.id) return sortBy.order * -1;
						else return 0;
					case 'people':
						if (a.storyData.members.length < b.storyData.members.length) return sortBy.order;
						else if (a.storyData.members.length > b.storyData.members.length) return sortBy.order * -1;
						else return 0;
					case 'SP':
						if (a.storyData.number < b.storyData.number) return sortBy.order;
						else if (a.storyData.number > b.storyData.number) return sortBy.order * -1;
						else return 0;
					default:
						if (a.createdAt < b.createdAt) return sortBy.order;
						else if (a.createdAt > b.createdAt) return sortBy.order * -1;
						else return 0;
				}
			});

			group.stories = newStories;
			return group;
		});

		newBoard.groups = newGroups;
		await updateBoard(newBoard);
	}

	const onSetCol = (col) => {
		const newBoard = JSON.parse(JSON.stringify(selectedBoard));
		if (newBoard.cmpsOrder.some(cmp => { return cmp === col })) {
			const filteredCmps = newBoard.cmpsOrder.filter(cmp => {
				return cmp !== col
			})
			newBoard.cmpsOrder = filteredCmps;
		} else {
			newBoard.cmpsOrder.push(col);
		}

		onUpdateBoard(newBoard);
	}


	const onUpdateBoard = async (boardToUpdate) => {
		if (filterBy.name || filterBy.status || filterBy.priority || filterBy.members) {
			updateWhileFilterSort();
			return;
		} else if (selectedBoard?.sortBy.name) {
			updateWhileFilterSort();
			return;
		}
		await updateBoard(boardToUpdate);
		socketService.emit('update board', boardId);
	};

	const onRemoveStory = async () => {
		if (filterBy.name || filterBy.status || filterBy.priority || filterBy.members) {
			updateWhileFilterSort();
			return;
		}
		const story = {
			boardId: null,
			groupId: null,
			storyId: null,
		};
		await setStory(story);
	};


	const updateWhileFilterSort = () => {
		// eslint-disable-next-line no-restricted-globals
		const isNulifyFilterSort = confirm("You can't make any changes to your board while filter or sort are on, would you like to cancel filter and sort?");
		if (isNulifyFilterSort) {
			setFilterBy({
				name: null,
				priority: null,
				status: null,
				members: null,
			});
			onSetSort(null);
		}
	};


	if (!boards?.length) return (
		<main className="main-container">
			<SideBar />
			<BoardList
				boards={boards} currBoard={selectedBoard} removeBoard={removeBoard}
				addBoard={addBoard} loadBoards={loadBoards}
			/>
			<div className="loader"></div>
		</main>
	);


	if (!selectedBoard) return <div className="loader"></div>;

	return (
		<main className="main-container">
			<SideBar />
			<BoardList
				boards={boards}
				currBoard={selectedBoard}
				loadBoards={loadBoards}
				removeBoard={removeBoard}
				addBoard={addBoard}
			/>

			<section className={`main-content ${isDashboard ? "dashboard" : ""}`}>
				<section className="main-header">
					<MobileNav selectedBoard={selectedBoard} boards={boards} toggleIsDashboard={toggleIsDashboard} />
					<BoardHeader
						board={selectedBoard}
						updateBoard={onUpdateBoard}
					/>
					<BoardNav board={selectedBoard} toggleIsDashboard={toggleIsDashboard} />
					<BoardActions
						board={selectedBoard}
						updateBoard={onUpdateBoard}
						getById={getById}
						setFilterBy={setFilterBy}
						filterBy={filterBy}
						updateWhileFilterSort={updateWhileFilterSort}
						onSetSort={onSetSort}
					/>
				</section>
				<div className="board-content">
					<Switch className="board-switch-container">
						<Route path="/board/:boardId/kanban">
							<Kanban board={filteredBoard || selectedBoard}
								filterBy={filterBy}
								updateBoard={onUpdateBoard}
								updateWhileFilterSort={updateWhileFilterSort}
							/>
						</Route>
						<Route path="/board/:boardId/dashboard">
							<Dashboard />
						</Route>
						<Route path="/board/:boardId/board">
							<GroupList
								board={filteredBoard || selectedBoard}
								filterBy={filterBy}
								updateBoard={onUpdateBoard}
								updateWhileFilterSort={updateWhileFilterSort}
								onSetCol={onSetCol}
							/>
						</Route>
					</Switch>
					<ActivityModal
						boards={boards}
						selectedBoard={selectedBoard}
						updateBoard={onUpdateBoard}
					/>
				</div>
			</section>

			<div
				onClick={() => onRemoveStory()}
				className={`darken-screen ${selectedStoryIds.storyId ? 'open' : ''
					}`}></div>
		</main>
	);
}

function mapStateToProps({ boardModule }) {
	return {
		boards: boardModule.boards,
		selectedStoryIds: boardModule.activityModalStory,
		selectedBoard: boardModule.selectedBoard,
		filterBy: boardModule.filterBy,
		// users: state.userModule.users,
		// loggedInUser: state.userModule.loggedInUser
	};
}

const mapDispatchToProps = {
	loadBoards,
	getById,
	removeBoard,
	updateBoard,
	addBoard,
	setStory,
	setFilterBy,
};

export const BoardApp = connect(mapStateToProps, mapDispatchToProps)(_BoardApp);

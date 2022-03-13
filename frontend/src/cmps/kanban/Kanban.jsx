import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { KanbanGroup } from './KanbanGroup';


export function Kanban({ board, filterBy, updateBoard, updateWhileFilterSort }) {

	const onDragEnd = async (result) => {
		if (filterBy.name || filterBy.status || filterBy.priority || filterBy.members) {
			updateWhileFilterSort();
			return;
		} else if (board.sortBy.name) {
			updateWhileFilterSort();
			return;
		}
		const { destination, source, draggableId, type } = result;
		if (!destination) return;
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		)
			return;
		if (type === 'story') {
			const sourceGroup = board.groups.find(
				(group) => group.id === source.droppableId
			);
			const destinationGroup = board.groups.find(
				(group) => group.id === destination.droppableId
			);
			const story = sourceGroup.stories.find(
				(story) => story.id === draggableId
			);
			sourceGroup.stories.splice(source.index, 1);
			destinationGroup.stories.splice(destination.index, 0, story);
		}
		if (type === 'group') {
			const sourceGroup = board.groups.find(
				(group) => group.id === draggableId
			);
			board.groups.splice(source.index, 1);
			board.groups.splice(destination.index, 0, sourceGroup);
		}

		const newBoard = { ...board };
		updateBoard(newBoard);
	};

	return (
		<DragDropContext
			onDragEnd={onDragEnd}
		>
			<Droppable droppableId="all-groups" type="group" direction="horizontal">
				{provided => (
					<div
						ref={provided.innerRef}
						className="kanban-groups-container"
						key={board._id}>
						{board.groups.map((group, index) => (
							<Draggable
								key={group.id}
								draggableId={group.id}
								index={index}
								type="group">
								{provided => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}>
										<KanbanGroup drag={provided.dragHandleProps} group={group} key={group._id} />
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	)
}
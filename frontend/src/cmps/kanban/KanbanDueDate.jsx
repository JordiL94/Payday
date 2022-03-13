export function KanbanDueDate({ story }) {
    const { dueDate } = story.storyData;
    const dueDateNew = new Date(dueDate);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const displayDate = `${monthNames[dueDateNew.getMonth()]} ${dueDateNew.getDate()}`;

    return <div className="kanban-dude-date-cmp">{displayDate}</div>;
}

import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

export function KanbanMembers({ story }) {
	const storyMems = story.storyData.members || [];

	return (
		<div className="kanban-members-cmp">
			{!storyMems.length ? (
				<div></div>
			) : storyMems.length > 5 ? (
				<div className="kanban-active-member-list">
					{storyMems[0].imgUrl ? (
						<img
							key={storyMems[0]._id}
							src={storyMems[0].imgUrl}
							alt=""
						/>
					) : (
						<span className="kanban-members-cmp-initials">
							{storyMems[0].fullname
								.split(' ')[0]
								.split('')[0] +
								storyMems[0].fullname
									.split(' ')[1]
									.split('')[0]}
						</span>
					)}{' '}
					<span className="kanban-plus-members">
						+{storyMems.length - 1}
					</span>{' '}
				</div>
			) : (
				<AvatarGroup max={5}>
					{storyMems.map((member) => {
						const nameArr = member.fullname.split(' ');
						const fName = nameArr[0].split('');
						const lName = nameArr[1].split('');
						const initials = fName[0] + lName[0];

						return member.imgUrl ? (
							<Avatar
								key={member._id}
								alt={initials}
								src={member.imgUrl}
								style={{
									width: '28px',
									height: '28px',
								}}
							/>
						) : (
							<span
								className="kanban-members-cmp-initials"
								key={member._id}>
								{initials}
							</span>
						);
					})}
				</AvatarGroup>
			)}
		</div>
	);
}

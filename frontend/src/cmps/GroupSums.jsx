import React, { Component } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';

export class GroupSum extends Component {
	DynamicGroupSum = ({ cmp, group, index }) => {
		switch (cmp) {
			case 'member-picker':
				let allMems = [];

				group.stories.map((story) => {
					const members = story.storyData.members;
					if (members.length)
						members.forEach((member) => allMems.push(member));
					return story;
				});

				allMems.sort(function (a, b) {
					if (a._id > b._id) return -1;
					else if (a._id < b._id) return 1;
					else return 0;
				});

				const filteredMems = allMems.filter((mem, idx) => {
					if (idx + 1 < allMems.length)
						return mem._id !== allMems[idx + 1]._id;
					else return mem;
				});

				return (
					<div key={'s' + index} className="members-sum">
						{!filteredMems.length ? (
							<AccountCircleOutlinedIcon className="no-members" />
						) : filteredMems.length > 2 ? (
							<div className="active-member-list">
								{filteredMems[0].imgUrl ? <img
									key={filteredMems[0]._id}
									src={filteredMems[0].imgUrl}
									alt=""
								/> : <span className="members-cmp-initials sum-initials">
									{filteredMems[0].fullname.split(' ')[0].split('')[0] + 
									filteredMems[0].fullname.split(' ')[1].split('')[0]}
								</span>}{' '}
								<span className="plus-members sum">
									+{filteredMems.length - 1}
								</span>{' '}
							</div>
						) : (
							<AvatarGroup max={2}>
								{filteredMems.map((member) => {
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
												width: '30px',
												height: '30px',
											}}
										/>
									) : (
										<span className="members-cmp-initials sum-initials" key={member._id}>
											{initials}
										</span>
									);
								})}
							</AvatarGroup>
						)}
					</div>
				);
			case 'status-picker':
				let sortedStatus = group.stories.map((story) => {
					return story.storyData.status;
				});
				sortedStatus.sort(function (a, b) {
					if (a.id < b.id) return -1;
					else if (a.id > b.id) return 1;
					else return 0;
				});
				const statusCount = {
					s101: 0,
					s102: 0,
					s103: 0,
					s104: 0,
					s105: 0,
				}
				sortedStatus.forEach(status => statusCount[status.id]++)
				return (
					<div key={'s' + index} className="status-sum">
						{sortedStatus.map((status, index) => {
							return (
								<Tooltip title={`${status.title} ${((statusCount[status.id] / sortedStatus.length) * 100).toFixed(2)}%`} arrow key={status + index}>
									<span
										key={'s2' + index}
										className="bat-fragment"
										style={{
											backgroundColor: status.color,
										}}></span>
								</Tooltip>
							);
						})}
					</div>
				);
			case 'priority-picker':
				let sortedPriority = group.stories.map((story) => {
					return story.storyData.priority;
				});
				sortedPriority.sort(function (a, b) {
					if (a.id < b.id) return -1;
					else if (a.id > b.id) return 1;
					else return 0;
				});
				const priorityCount = {
					p101: 0,
					p102: 0,
					p103: 0,
					p104: 0,
				}
				sortedPriority.forEach(priority => priorityCount[priority.id]++)
				return (

					<div key={'s' + index} className="priority-sum">
						{sortedPriority.map((priority, index) => {
							return (
								<Tooltip title={`${priority.title} ${((priorityCount[priority.id] / sortedPriority.length) * 100).toFixed(2)}%`} arrow key={priority + index}>
									<span
										key={'s2' + index}
										className="bat-fragment"
										style={{
											backgroundColor: priority.color,
										}}></span>
								</Tooltip>
							);
						})}
					</div>
				);
			case 'type-picker':
				let sortedType = group.stories.map((story) => {
					return story.storyData.type;
				});
				sortedType.sort(function (a, b) {
					if (a.id < b.id) return -1;
					else if (a.id > b.id) return 1;
					else return 0;
				});
				const typeCount = {
					t101: 0,
					t102: 0,
					t103: 0,
					t104: 0,
					t105: 0,
				}
				sortedType.forEach(type => typeCount[type.id]++)
				return (
					<div key={'s' + index} className="type-sum">
						{sortedType.map((type, index) => {
							return (
								<Tooltip title={`${type.title} ${((typeCount[type.id] / sortedType.length) * 100).toFixed(2)}%`} arrow key={type + index}>
									<span
										key={'s2' + index}
										className="bat-fragment"
										style={{
											backgroundColor: type.color,
										}}></span>
								</Tooltip>
							);
						})}
					</div>
				);
			case 'number-picker':
				let sum = 0;
				group.stories.forEach((story) => {
					sum += story.storyData.number ? +story.storyData.number : 0;
				});
				return (
					<div key={'s' + index} className="num-sum">
						<div className="sum-var">${sum}</div>
						<div className="sum-txt">sum</div>
					</div>
				);
			case 'link-picker':
				return <div key={'s' + index} className="link-sum"></div>;
			case 'timeline-picker':
				return <div key={'s' + index} className="timeline-sum"></div>;
			case 'due-date-picker':
				return <div key={'s' + index} className="due-date-sum"></div>;
			default:
				return;
		}
	};

	render() {
		const { cmpsOrder, group } = this.props;
		return (
			<div className="group-sums">
				<div className="empty-txt-area"></div>
				{cmpsOrder.map((cmp, index) => {
					return (
						<this.DynamicGroupSum
							cmp={cmp}
							group={group}
							key={index}
							index={index}
						/>
					);
				})}
			</div>
		);
	}
}

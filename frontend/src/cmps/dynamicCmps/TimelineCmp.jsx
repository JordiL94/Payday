import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function TimelineCmp({ story, group, onUpdate }) {

	const { timeline } = story.storyData;
	let initData = [];
	if (timeline.length) {
		initData.push(timeline[0]);
		initData.push(timeline[1] ? timeline[1] : null);
	} else initData = [null, null];

	const [startDate, setStartDate] = useState(initData[0]);
	const [endDate, setEndDate] = useState(initData[1]);
	const [isDateSet, setIsDateSet] = useState(false);
	const [isSettingDate, setIsSettingDate] = useState(false);
	const [isHover, setIsHover] = useState(false);
	const { backgroundColor } = group.style;
	const firstUpdate = useRef(true);

	useEffect(() => {
		setIsDateSet(!initData[0] && !initData[1] ? false : true);
		return () => {
			firstUpdate.current = true;
		};
		//  eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}
		if (!endDate) return;
		onSetTimeline();
		//  eslint-disable-next-line
	}, [endDate]);

	const setDateRange = (newRange) => {
		if (!newRange[1]) {
			setStartDate(newRange[0]);
			setEndDate(null);
			setIsSettingDate(true);
			return;
		}
		setEndDate(newRange[1]);
	};

	const onSetTimeline = async () => {
		const timeline = [startDate, endDate];
		story.timeline = timeline;
		setIsDateSet(true);
		setIsSettingDate(false);
		onUpdate('CHANGE_TIMELINE', timeline);
	};

	const onEnter = () => {
		setIsHover(true);
	};

	const onLeave = () => {
		setIsHover(false);
	};

	const onSetDatesFocus = () => {
		setIsSettingDate(true);
	};

	const onSetDatesBlur = () => {
		setIsSettingDate(false);
	};

	const getNumOfDays = () => {
		if (!startDate || !endDate) return;
		const totalDays = (endDate - startDate) / 1000 / 60 / 60 / 24;
		return totalDays;
	};

	const getPercent = () => {
		const now = Date.now();
		const totalDays = getNumOfDays();
		let milliPassed = now - startDate;
		const daysPassed = Math.floor(milliPassed / 1000 / 60 / 60 / 24);
		let percent = (daysPassed / totalDays) * 100;
		if (percent < 0) percent = 0;
		if (percent > 100) percent = 100;
		return percent;
	};


	return (
		<div className="timeline" >
			{!isDateSet ? (
				<div onMouseEnter={onEnter} onMouseLeave={onLeave}>
					<DatePicker
						placeholderText={
							isSettingDate ? '-' : isHover ? 'Set Dates' : '-'
						}

						onFocus={onSetDatesFocus}
						onBlur={onSetDatesBlur}
						popperPlacement="bottom"
						className="date-picker-cmp"
						// locale="uk"
						selectsRange={true}
						startDate={startDate}
						endDate={endDate}
						onChange={(update) => {
							setDateRange(update);
						}}
						dateFormat="MMM dd"
					/>
				</div>
			) : !isSettingDate && isHover ? (
				<div className="num-of-days" onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onLeave}>
					{getNumOfDays()}d
				</div>
			) : (
				<div className="date-picker-container" onMouseEnter={onEnter} onMouseLeave={onLeave}>
					<div
						className="progress-bar"
						style={{
							backgroundColor: backgroundColor,
							width: `${getPercent()}%`,
						}} ></div>
					<div className="grey-bck" ></div>
					<DatePicker
						className="date-picker-cmp"
						popperPlacement="bottom"
						popperClassName="date-picker-pos"
						// dateFormat="us"
						// locale="uk"
						dateFormat="MMM d"
						selectsRange={true}
						startDate={startDate}
						endDate={endDate}
						onChange={(update) => {
							setDateRange(update);
						}}
					/>
				</div>
			)}
		</div>
	);
}

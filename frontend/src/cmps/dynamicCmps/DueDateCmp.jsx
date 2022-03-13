import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function DueDateCmp({ story, onUpdate }) {
	const { dueDate } = story.storyData;
	const [startDate, setStartDate] = useState(dueDate || null);

	const setDate = (date) => {
		setStartDate(date);
		onUpdate('CHANGE_DUE_DATE', date.getTime());
	};

	return (
		<div className="due-date-container">
			<DatePicker
				selected={startDate}
				onChange={(date) => setDate(date)}
				dateFormat="MMM d">
				{Date.now() > startDate && (
					<div style={{ color: 'red' }}>Past due date!</div>
				)}
			</DatePicker>
		</div>
	);
}

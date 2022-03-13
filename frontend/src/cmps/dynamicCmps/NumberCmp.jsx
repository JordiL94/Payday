import React, { useState, useRef, useEffect } from 'react';

export function NumberCmp({ story, onUpdate }) {
	const newStory = { ...story }
	const { number } = newStory.storyData;
	const [txt, setTxt] = useState(number || '');
	const inputEl = useRef();

	const onAddNumber = async ({ target }) => {
		const value = target.value;
		if (!value) return;

		await onUpdate('CHANGE_NUMBER', value);
	};

	const handleUpdate = (ev) => {
		if (ev.key === 'Enter' || ev.type === 'blur') {
			onAddNumber(ev);
		}
	};

	useEffect(() => {
		setTxt(number || '');
	}, [story])

	const handleChange = ({ target }) => {
		const { value } = target;
		if (isNaN(value)) return;
		setTxt(value);
	};

	const onFocusInput = () => {
		inputEl.current.focus();
	};

	return (
		<div className="add-number" onClick={onFocusInput}>
			<input
				autoComplete="off"
				name="txt"
				type="text"
				onBlur={handleUpdate}
				onKeyUp={handleUpdate}
				value={txt}
				onChange={handleChange}
				ref={inputEl}
				onSubmit={(ev) => {
					handleUpdate(ev);
				}}
			/>
		</div>
	);
}

import React from 'react';

export default function TerminalText(props) {
	const ref = React.useRef(null);
	return (
		<div className='terminalText'>
			<p>{props.text}</p>
		</div>
	);
}

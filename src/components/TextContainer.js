import React from 'react';
import Terminal from './Terminal';
import TerminalText from './TerminalText';
import { nanoid } from 'nanoid';

export default function TextContainer(props) {
	let [count, setCount] = React.useState(0);
	const [terminalTexts, setTerminalTexts] = React.useState([]);

	React.useEffect(() => {
		setCount(prevCount => prevCount + 1);
		setTimeout(addTerminalText, 1000);
	}, [terminalTexts]);

	function addTerminalText() {
		console.log(`addTerminalText`);
		console.log(`count=${count}`);

		if (count > 5) return;

		const randomNumber = Math.random();

		setTerminalTexts(prevTerminalTexts => [
			...prevTerminalTexts,
			<TerminalText text={`${count} ${randomNumber}`} key={nanoid()} />,
		]);
	}

	return <div className='scroller'>{terminalTexts}</div>;
}

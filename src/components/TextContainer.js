import React from 'react';

import TerminalText from './TerminalText';
import { nanoid } from 'nanoid';

export default function TextContainer(props) {
	const [terminalTexts, setTerminalTexts] = React.useState([]);

	React.useEffect(() => {
		const timer = setTimeout(addTerminalText, 50);
		return () => clearTimeout(timer);
	}, [terminalTexts]);

	async function getMarkovText() {
		const res = await fetch('http://localhost:5000/api/v1/markovText');
		const body = await res.json();
		if (body.success === true) {
			return body.texts.items[0].txt;
		}
	}

	async function addTerminalText() {
		const markovText = await getMarkovText();
		setTerminalTexts(prevTerminalTexts => [
			...prevTerminalTexts,
			<TerminalText
				className='terminalText'
				text={`${markovText}`}
				key={nanoid()}
			/>,
		]);
		updateScroll();
	}

	function updateScroll() {
		terminalTexts.filter(terminalText => {
			console.log(terminalText.ref);
		});
	}

	return <div className='scroller'>{terminalTexts}</div>;
}

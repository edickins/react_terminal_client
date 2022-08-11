import React from 'react';
import TerminalText from './TerminalText';
import { nanoid } from 'nanoid';

export default function TextContainer(props) {
	const [terminalTexts, setTerminalTexts] = React.useState([]);

	// setTimeout to create a new terminalText element each time the terminalTexts Array is updated.
	React.useEffect(() => {
		const timer = setTimeout(createTerminalTextEl, 1000);
		return () => clearTimeout(timer);
	}, [terminalTexts]);

	// hit up the API and get some Markov Chain generated text
	async function getMarkovText() {
		const res = await fetch('http://localhost:5000/api/v1/markovText');
		const body = await res.json();
		if (body.success === true) {
			return body.texts.items[0].txt;
		}
	}

	// create a new TerminalText element
	// passing text, key and ref
	async function createTerminalTextEl() {
		const onScreenElements = getOnScreenTextElements();

		const ref = React.createRef();
		const markovText = await getMarkovText();
		setTerminalTexts([
			...onScreenElements,
			<TerminalText
				className='terminalText'
				text={`${markovText}`}
				key={nanoid()}
				ref={ref}
			/>,
		]);
	}

	// filter all terminalText elements accessed by ref
	// and return all of those reasonably still on screen
	// offsetTop value accommodates resized the browser window
	// and allows for older text elements to remain in the stack
	function getOnScreenTextElements() {
		let onScreenElements = [];
		if (terminalTexts.length > 0) {
			onScreenElements = terminalTexts.filter(el => {
				return el.ref.current.offsetTop > -500;
			});
		}
		return onScreenElements;
	}

	// render function
	return <div className='scroller'>{terminalTexts}</div>;
}

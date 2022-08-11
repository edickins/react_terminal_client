import React from 'react';
import TerminalText from './TerminalText';
import { nanoid } from 'nanoid';
import typingEffect from 'typing-effect';

export default function TextContainer(props) {
	const [terminalTexts, setTerminalTexts] = React.useState([]);
	const [count, setCount] = React.useState(0);

	// filter all terminalText elements accessed by ref
	// and return all of those reasonably still on screen
	// offsetTop value accommodates resized the browser window
	// and allows for older text elements to remain in the stack
	const getOnScreenTextElements = React.useCallback(() => {
		let onScreenElements = [];
		if (terminalTexts.length > 0) {
			onScreenElements = terminalTexts.filter(el => {
				return el.ref.current.offsetTop > -500;
			});
		}
		return onScreenElements;
	}, [terminalTexts]);

	// hit up the API and get some Markov Chain generated text
	const getMarkovText = async () => {
		const res = await fetch('http://localhost:5000/api/v1/markovText');
		const body = await res.json();
		if (body.success === true) {
			return body.texts.items[0].txt;
		}
	};

	// create a new TerminalText element
	// passing text, key and ref
	const createTerminalTextEl = React.useCallback(async () => {
		setCount(count + 1);

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
	}, [getOnScreenTextElements, count]);

	const doSomething = () => {
		console.log(`doing someting`);
	};

	// setTimeout to create a new terminalText element each time the terminalTexts Array is updated.
	React.useEffect(() => {
		if (count > 5) return;

		const timer = setTimeout(createTerminalTextEl, 1000);
		return () => clearTimeout(timer);
	}, [terminalTexts, createTerminalTextEl, count]);

	React.useEffect(() => {
		if (terminalTexts.length > 0)
			typingEffect(document.querySelector('[data-typing-effect]')).then(() =>
				doSomething()
			);
	}, [terminalTexts]);

	// render function
	return <div className='scroller'>{terminalTexts}</div>;
}

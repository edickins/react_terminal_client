import React from 'react';
import TerminalText from './TerminalText';
import { nanoid } from 'nanoid';
import typingEffect from 'typing-effect';

export default function TextContainer(props) {
	const [terminalTexts, setTerminalTexts] = React.useState([]);

	// filter all terminalText elements accessed by ref
	// and return all of those reasonably still on screen
	// offsetTop value accommodates resized the browser window
	// and allows for older text elements to remain in the stack
	const getAllTextElementsInView = React.useCallback(() => {
		let onScreenElements = [];
		if (terminalTexts.length > 0) {
			onScreenElements = terminalTexts.filter(el => {
				return el.ref.current.offsetTop > -500;
			});
		}
		return onScreenElements;
	}, [terminalTexts]);

	// hit the API and get some Markov Chain generated text
	const getMarkovText = async () => {
		const res = await fetch('http://localhost:5000/api/v1/markovText');
		const body = await res.json();
		if (body.success === true) {
			return body.texts.items[0].txt;
		}
	};

	// create a new TerminalText element
	// passing it text, key and ref props
	const createTerminalTextEl = React.useCallback(async () => {
		const onScreenElements = getAllTextElementsInView();
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
	}, [getAllTextElementsInView]);

	// set a timeout after each text animation has completed - or on initial page load
	const startTimer = () => {
		setTimeout(createTerminalTextEl, 2000);
	};

	// called once on App startup
	React.useEffect(() => {
		startTimer();
	}, []);

	// called every time the screen re-renders.
	// looks for any paragraphs that need to be animated.
	// on Promise resolution startTimer is called again.
	React.useEffect(() => {
		const textsToAnimate = document.querySelector('[data-typing-effect]');
		if (textsToAnimate !== null) {
			typingEffect(textsToAnimate).then(() => {
				startTimer();
			});
		}
	});

	// render function
	return <div className='scroller'>{terminalTexts}</div>;
}

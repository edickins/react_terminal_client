import React from 'react';
import TerminalText from './TerminalText';
import { nanoid } from 'nanoid';
import typingEffect from 'typing-effect';

export default function TextContainer(props) {
	const [terminalTexts, setTerminalTexts] = React.useState([]);
	const [multilineTexts, setMultilineTexts] = React.useState([]);

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

	// hit the API and get multiline text from the express server
	const getMultilineText = async () => {
		const res = await fetch('http://localhost:5000/api/v1/ascii');
		const body = await res.json();
		if (body.success === true) {
			console.log(`multiline texts : ${body.texts}`);
		}
	};

	// create a new TerminalText element
	// passing it text, key and ref props
	const createTerminalTextEl = React.useCallback(
		async text => {
			const onScreenElements = getAllTextElementsInView();
			const ref = React.createRef();

			setTerminalTexts([
				...onScreenElements,
				<TerminalText
					className='terminalText'
					text={`${text}`}
					key={nanoid()}
					ref={ref}
				/>,
			]);
		},
		[getAllTextElementsInView]
	);

	// set a timeout after each text animation has completed - or on initial page load
	const startTimer = async () => {
		getMultilineText();
		let text = await getText();
		setTimeout(() => {
			createTerminalTextEl(text);
		}, 2000);
	};

	const getText = async () => {
		return await getMarkovText();
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

import React from 'react';
import TerminalText from './TerminalText';
import TerminalTextPre from './TerminalTextPre';
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
		try {
			const res = await fetch(
				'https://cdn.bleepbloop.net/content/api/v1/markovText'
			);
			const body = await res.json();
			if (body.success === true) {
				return body.texts.items[0].txt;
			}
		} catch (err) {
			console.log(err);
		}
	};

	// hit the API and get multiline text from the express server
	const getMultilineText = async () => {
		try {
			const res = await fetch('http://cdn.bleepbloop.net/content/api/v1/ascii');
			const body = await res.json();
			if (body.success === true) {
				console.log(`multiline texts : ${body.texts}`);
				setMultilineTexts(body.texts.items);
			}
		} catch (err) {
			console.log(err);
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
		//if (Math.random() > 0.5 && multilineTexts.length === 0) {
		//getMultilineText();
		//}

		let text;

		if (multilineTexts.length > 0) {
			const item = multilineTexts.shift();
			text = item.txt;
		} else {
			text = await getText();
		}

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

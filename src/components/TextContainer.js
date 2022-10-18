import React from 'react';
import TerminalText from './TerminalText';
import TerminalTextPre from './TerminalTextPre';
import { nanoid } from 'nanoid';
import typingEffect from 'typing-effect';
import logoAscii from '../data/asciiBleepBloop';

export default function TextContainer(props) {
	const [startAutomatedText, setStartAutomatedText] = React.useState(false);
	const [terminalTexts, setTerminalTexts] = React.useState([]);

	async function init() {
		let texts = logoAscii;

		const textEls = texts.map(text => {
			const ref = React.createRef();
			return (
				<TerminalTextPre
					className='terminalText'
					text={`${text.txt}`}
					key={nanoid()}
					ref={ref}
				/>
			);
		});
		setTerminalTexts(prevTextEls => [...prevTextEls, ...textEls]);
		setStartAutomatedText(true);
	}
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

	// set a timeout after each text animation has completed
	const startTextTimer = React.useCallback(async () => {
		let textObj = await getText();
		setTimeout(() => {
			createTerminalTextEl({ text: `${textObj.txt}`, useTypeEffect: true });
		}, 2000);
	});

	// hit the API and get some Markov Chain generated text
	async function getMarkovText(num = 1) {
		const MARKOV_URI = `${process.env.REACT_APP_BASE_URI}/api/v1/markovText?num=${num}`;
		try {
			const res = await fetch(MARKOV_URI);
			const body = await res.json();
			if (body.success === true) {
				return body.data;
			}
		} catch (err) {
			console.log(err);
		}
	}

	const getText = React.useCallback(async (num = 1) => {
		const texts = await getMarkovText(num);
		return texts[0];
	});
	// create a new TerminalText element
	// passing it text, key and ref props
	const createTerminalTextEl = React.useCallback(async () => {
		let textObj = await getText();
		const onScreenElements = getAllTextElementsInView();
		const ref = React.createRef();

		setTerminalTexts([
			...onScreenElements,
			<TerminalText
				className='terminalText'
				text={textObj.txt}
				key={nanoid()}
				ref={ref}
				useTypeEffect={true}
			/>,
		]);
	}, [getAllTextElementsInView, getText]);

	// called once on App startup
	React.useEffect(() => {
		init();
	}, []);

	// called when init() is completed.
	React.useEffect(() => {
		if (startAutomatedText === true) {
			startTextTimer();
			setStartAutomatedText(false);
		}
	}, [startAutomatedText, startTextTimer]);

	// called every time the screen re-renders.
	// looks for any paragraphs that need to be animated.
	// on Promise resolution startTextTimer is called again.
	React.useEffect(() => {
		const textToAnimate = document.querySelector('[data-typing-effect]');
		if (textToAnimate !== null) {
			typingEffect(textToAnimate).then(() => {
				const rand = Math.random();
				if (rand > 0.05) {
					startTextTimer();
				} else {
					setStartAutomatedText(false);
					init();
				}
			});
		}
	});

	// render function
	return <div className='scroller'>{terminalTexts}</div>;
}

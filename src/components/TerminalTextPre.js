import React from 'react';

// this functional component is using forwardRef
// which exposes a ref to itself accessed through el.ref.current
const TerminalTextPre = React.forwardRef((props, ref) => (
	<div className='terminalText' ref={ref}>
		<pre data-typing-effect>{props.text}</pre>
	</div>
));

export default TerminalTextPre;

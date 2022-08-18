import React from 'react';

// this functional component is using forwardRef
// which exposes a ref to itself accessed through el.ref.current
const TerminalText = React.forwardRef((props, ref) => (
	<div className={props.className} ref={ref}>
		<p data-typing-effect>{props.text}</p>
	</div>
));

export default TerminalText;

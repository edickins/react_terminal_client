const useMarkovText = () => {
	const getMarkovText = async initObj => {
		let { uri, queryStr } = initObj;
		uri = uri + '?';

		for (const [key, value] of Object.entries(queryStr)) {
			uri = uri + `${key}=${value}&`;
		}

		try {
			const res = await fetch(uri);
			const body = await res.json();
			if (body.success === true) {
				return body.data;
			}
		} catch (err) {
			console.log(err);
		}
	};

	return [getMarkovText];
};

export default useMarkovText;

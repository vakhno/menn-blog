export const getPosts = async () => {
	const response = await fetch('http://localhost:5555/post/post-by-page', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (!response.ok) {
		throw new Error();
	}

	return response.json();
};

export const getPostById = async (id: string) => {
	const response = await fetch('http://localhost:5555/post/post-by-id', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id }),
	});

	if (!response.ok) {
		throw new Error();
	}

	return response.json();
};

import React from 'react';

type Props = {
	children: React.ReactNode;
};

const layout = ({ children }: Props) => {
	return <div className="flex justify-center items-center h-screen">{children}</div>;
};

export default layout;

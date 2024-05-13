import Header from '@/components/shared/Header/Header';

type Props = {
	children: React.ReactNode;
};

const layout = ({ children }: Props) => {
	return (
		<>
			<Header />
			<section className="max-w-[920px] m-auto p-2">{children}</section>
		</>
	);
};

export default layout;

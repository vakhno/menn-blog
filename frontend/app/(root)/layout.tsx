import Header from '@/components/shared/Header/Header';
import Footer from '@/components/shared/Footer/Footer';

type Props = {
	children: React.ReactNode;
};

const layout = ({ children }: Props) => {
	return (
		<>
			<Header />
			<section className="max-w-[920px] m-auto p-2">{children}</section>
			<Footer />
		</>
	);
};

export default layout;

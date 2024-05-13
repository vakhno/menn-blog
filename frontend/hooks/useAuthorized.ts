import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { isUserAuthorized } from '@/lib/redux/slices/authSlice';

export const useAuthorized = () => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(isUserAuthorized());
	}, []);
};

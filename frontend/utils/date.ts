export const timestampToDate = (timestamp: Date | string) => {
	if (timestamp instanceof Date || typeof timestamp === 'string') {
		try {
			const date = new Date(timestamp);
			const minutes = String(date.getMinutes());
			const hours = String(date.getHours());
			const day = String(date.getDate());
			// +1 because getMonth return number from 0 to 11 (not from 1 to 12)
			const mounth = String(date.getMonth() + 1);
			const year = String(date.getFullYear());
			return `${day}.${mounth}.${year} ${hours}:${minutes}`;
		} catch (error) {
			return '';
		}
	} else {
		return '';
	}
};

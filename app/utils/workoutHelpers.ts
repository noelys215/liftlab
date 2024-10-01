import AsyncStorage from '@react-native-async-storage/async-storage';

export const calculateWorkoutWeight = (oneRepMax: number, percentage: number, rounding: number) => {
	const weight = oneRepMax * (percentage / 100);
	return Math.round(weight / rounding) * rounding;
};

export const calculateNewMax = (
	lift: string,
	adjustment: number,
	squatMax: number | null,
	benchMax: number | null,
	deadliftMax: number | null
) => {
	let currentMax = 0;
	switch (lift) {
		case 'squat':
			currentMax = squatMax ?? 0;
			break;
		case 'benchPress':
			currentMax = benchMax ?? 0;
			break;
		case 'deadlift':
			currentMax = deadliftMax ?? 0;
			break;
	}

	return currentMax + currentMax * (adjustment / 100);
};

export const updateMaxInStorage = async (
	lift: string,
	newMax: number,
	setSquatMax: React.Dispatch<React.SetStateAction<number | null>>,
	setBenchMax: React.Dispatch<React.SetStateAction<number | null>>,
	setDeadliftMax: React.Dispatch<React.SetStateAction<number | null>>
) => {
	const roundedNewMax = Math.round(newMax);
	switch (lift) {
		case 'squat':
			setSquatMax(roundedNewMax);
			await AsyncStorage.setItem('squatMax', roundedNewMax.toString());
			break;
		case 'benchPress':
			setBenchMax(roundedNewMax);
			await AsyncStorage.setItem('benchMax', roundedNewMax.toString());
			break;
		case 'deadlift':
			setDeadliftMax(roundedNewMax);
			await AsyncStorage.setItem('deadliftMax', roundedNewMax.toString());
			break;
	}
};

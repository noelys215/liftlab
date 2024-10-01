import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useWorkoutData = (week: string) => {
	const [squatMax, setSquatMax] = useState<number | null>(null);
	const [benchMax, setBenchMax] = useState<number | null>(null);
	const [deadliftMax, setDeadliftMax] = useState<number | null>(null);
	const [rounding, setRounding] = useState<number>(5);
	const [isCompleted, setIsCompleted] = useState<{ [week: string]: { [lift: string]: boolean } }>(
		{}
	);

	useEffect(() => {
		const getUserData = async () => {
			try {
				const squat = await AsyncStorage.getItem('squatMax');
				const bench = await AsyncStorage.getItem('benchMax');
				const deadlift = await AsyncStorage.getItem('deadliftMax');
				const rounding = await AsyncStorage.getItem('rounding');
				const completion = await AsyncStorage.getItem(`completion-${week}`);

				if (squat) setSquatMax(parseInt(squat));
				if (bench) setBenchMax(parseInt(bench));
				if (deadlift) setDeadliftMax(parseInt(deadlift));
				if (rounding) setRounding(parseFloat(rounding));
				if (completion) setIsCompleted(JSON.parse(completion));
			} catch (error) {
				console.error('Error retrieving data', error);
			}
		};

		getUserData();
	}, [week]);

	return {
		squatMax,
		setSquatMax,
		benchMax,
		setBenchMax,
		deadliftMax,
		setDeadliftMax,
		rounding,
		setRounding,
		isCompleted,
		setIsCompleted,
	};
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { repAdjustments } from '@/constants/repAdjustments';
import { calculateNewMax, updateMaxInStorage } from './workoutHelpers';

type HandleCompleteParams = {
	lift: string;
	week: string;
	isCompleted: { [week: string]: { [lift: string]: boolean } };
	setIsCompleted: React.Dispatch<
		React.SetStateAction<{ [week: string]: { [lift: string]: boolean } }>
	>;
	selectedReps: { [key: string]: { row: number } };
	setPreviousMaxValues: React.Dispatch<React.SetStateAction<{ [lift: string]: number }>>;
	previousMaxValues: { [lift: string]: number };
	squatMax: number | null;
	benchMax: number | null;
	deadliftMax: number | null;
	setSquatMax: React.Dispatch<React.SetStateAction<number | null>>;
	setBenchMax: React.Dispatch<React.SetStateAction<number | null>>;
	setDeadliftMax: React.Dispatch<React.SetStateAction<number | null>>;
};

export const handleComplete = async ({
	lift,
	week,
	isCompleted,
	setIsCompleted,
	selectedReps,
	setPreviousMaxValues,
	previousMaxValues,
	squatMax,
	benchMax,
	deadliftMax,
	setSquatMax,
	setBenchMax,
	setDeadliftMax,
}: HandleCompleteParams) => {
	const currentCompletion = isCompleted[week] || {};
	const isAlreadyCompleted = currentCompletion[lift] || false;

	// Fetch the correct adjustment key from the selected index
	const adjustmentKey = Object.keys(repAdjustments)[
		selectedReps[lift].row
	] as keyof typeof repAdjustments;
	const adjustmentValue = repAdjustments[adjustmentKey];

	if (!isAlreadyCompleted) {
		// Store the current max value before adjustment for potential rollback
		if (lift === 'deadlift' && deadliftMax !== null) {
			setPreviousMaxValues((prev) => ({ ...prev, deadlift: deadliftMax }));
		} else if (lift === 'benchPress' && benchMax !== null) {
			setPreviousMaxValues((prev) => ({ ...prev, benchPress: benchMax }));
		} else if (lift === 'squat' && squatMax !== null) {
			setPreviousMaxValues((prev) => ({ ...prev, squat: squatMax }));
		}

		// Apply adjustment
		const newMaxValue = calculateNewMax(lift, adjustmentValue, squatMax, benchMax, deadliftMax);
		await updateMaxInStorage(lift, newMaxValue, setSquatMax, setBenchMax, setDeadliftMax);
	} else {
		// Revert to the previous value if marking as incomplete
		const previousValue = previousMaxValues[lift];
		if (previousValue !== undefined) {
			await updateMaxInStorage(lift, previousValue, setSquatMax, setBenchMax, setDeadliftMax);
		}
	}

	// Update completion status, whether checking or unchecking
	const updatedCompletion = {
		...isCompleted,
		[week]: { ...currentCompletion, [lift]: !isAlreadyCompleted },
	};

	setIsCompleted(updatedCompletion);
	await AsyncStorage.setItem(`completion-${week}`, JSON.stringify(updatedCompletion));
};

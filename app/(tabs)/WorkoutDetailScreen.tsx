import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Layout, Text, Icon, CheckBox, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { intensities } from '../../constants/intensities';
import { repAdjustments } from '../../constants/repAdjustments';

const WorkoutDetailScreen: React.FC = () => {
	const [squatMax, setSquatMax] = useState<number | null>(null);
	const [benchMax, setBenchMax] = useState<number | null>(null);
	const [deadliftMax, setDeadliftMax] = useState<number | null>(null);
	const [isCompleted, setIsCompleted] = useState<{ [week: string]: { [lift: string]: boolean } }>(
		{}
	);
	const [selectedReps, setSelectedReps] = useState<{ [key: string]: IndexPath }>({
		deadlift: new IndexPath(0),
		benchPress: new IndexPath(0),
		squat: new IndexPath(0),
	});
	const [rounding, setRounding] = useState<number>(5);
	const router = useRouter();
	const { week: weekParam } = useLocalSearchParams();

	const week = Array.isArray(weekParam) ? weekParam[0] : weekParam;

	const roundingOptions = [0, 1, 2, 3, 4, 5];

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

	const calculateWorkoutWeight = (oneRepMax: number, percentage: number) => {
		const weight = oneRepMax * (percentage / 100);
		return Math.round(weight / rounding) * rounding;
	};
	const [previousMaxValues, setPreviousMaxValues] = useState<{
		[lift: string]: number;
	}>({});

	// Update handleComplete function
	const handleComplete = async (lift: string) => {
		const currentCompletion = isCompleted[week] || {};
		const isAlreadyCompleted = currentCompletion[lift] || false;

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
			const adjustmentValueKey =
				`beat${selectedReps[lift].row}` as keyof typeof repAdjustments;
			const adjustmentValue = repAdjustments[adjustmentValueKey];
			const newMaxValue = calculateNewMax(lift, adjustmentValue);

			await updateMaxInStorage(lift, newMaxValue);
		} else {
			// Revert to the previous value if marking as incomplete
			const previousValue = previousMaxValues[lift];
			if (previousValue !== undefined) {
				await updateMaxInStorage(lift, previousValue);
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

	const calculateNewMax = (lift: string, adjustment: number) => {
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

	const updateMaxInStorage = async (lift: string, newMax: number) => {
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

	const goToNextWeek = () => {
		let nextWeek = parseInt(week as string) + 1;
		router.push(`./WorkoutDetailScreen?week=${nextWeek}`);
	};

	const goToPreviousWeek = () => {
		let previousWeek = parseInt(week as string) - 1;
		if (previousWeek < 1) {
			previousWeek = 1;
		}
		router.push(`./WorkoutDetailScreen?week=${previousWeek}`);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<Layout style={styles.container}>
				{/* Week Navigation */}
				<View style={styles.navigationContainer}>
					<Icon
						name="arrow-back-outline"
						onPress={goToPreviousWeek}
						style={styles.arrowIcon}
					/>
					<Text category="h1">Week {week}</Text>
					<Icon
						name="arrow-forward-outline"
						onPress={goToNextWeek}
						style={styles.arrowIcon}
					/>
				</View>

				{/* Render lifts */}
				{renderWorkoutSection('deadlift', deadliftMax, 'Deadlift')}
				{renderWorkoutSection('benchPress', benchMax, 'Bench Press')}
				{renderWorkoutSection('squat', squatMax, 'Squat')}
			</Layout>
		</SafeAreaView>
	);

	function renderWorkoutSection(lift: string, max: number | null, label: string) {
		if (max === null) return null;

		return (
			<View style={styles.workoutSection}>
				<Text category="s1" style={styles.workoutText}>
					{label}: {calculateWorkoutWeight(max, intensities[lift][parseInt(week) - 1])}{' '}
					lbs, 5 reps
				</Text>
				<Text category="s1" style={styles.workoutText}>
					Repout Target: 9 reps
				</Text>
				<Select
					label="Beat by X Reps"
					selectedIndex={selectedReps[lift]}
					onSelect={(index) =>
						setSelectedReps((prev) => ({ ...prev, [lift]: index as IndexPath }))
					}
					style={styles.picker}>
					{roundingOptions.map((val) => (
						<SelectItem key={val} title={`Reps: ${val}`} />
					))}
				</Select>
				<CheckBox
					checked={isCompleted[week]?.[lift] || false}
					onChange={() => handleComplete(lift)}
					style={styles.checkbox}>
					{isCompleted[week]?.[lift] ? 'Completed' : 'Mark as Complete'}
				</CheckBox>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fff',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	navigationContainer: {
		alignItems: 'center',
		marginVertical: 10,
		flexDirection: 'row',
	},
	arrowIcon: {
		width: 32,
		height: 32,
		marginHorizontal: 10,
	},
	workoutSection: {
		alignItems: 'center',
		marginVertical: 15,
	},
	workoutText: {
		marginBottom: 5,
		fontSize: 18,
	},
	checkbox: {
		marginTop: 10,
	},
	picker: {
		marginVertical: 10,
		width: 200,
	},
});

export default WorkoutDetailScreen;

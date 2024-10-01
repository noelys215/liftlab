import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Layout, Text, Icon, IndexPath } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { repAdjustments } from '../../constants/repAdjustments';
import WorkoutSection from '@/components/WorkoutSection';
import { useWorkoutData } from '../hooks/useWorkoutData';
import { normalRepsPerWeek, repoutTarget } from '@/constants/intensities';
import {
	calculateNewMax,
	calculateWorkoutWeight,
	updateMaxInStorage,
} from '../utils/workoutHelpers';

const WorkoutDetailScreen: React.FC = () => {
	const router = useRouter();
	const { week: weekParam } = useLocalSearchParams();
	const week = Array.isArray(weekParam) ? weekParam[0] : weekParam;

	const [selectedReps, setSelectedReps] = useState<{ [key: string]: IndexPath }>({
		deadlift: new IndexPath(0),
		benchPress: new IndexPath(0),
		squat: new IndexPath(0),
	});

	const {
		squatMax,
		setSquatMax,
		benchMax,
		setBenchMax,
		deadliftMax,
		setDeadliftMax,
		rounding,
		isCompleted,
		setIsCompleted,
	} = useWorkoutData(week);

	const [previousMaxValues, setPreviousMaxValues] = useState<{ [lift: string]: number }>({});

	const handleComplete = async (lift: string) => {
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
			const newMaxValue = calculateNewMax(
				lift,
				adjustmentValue,
				squatMax,
				benchMax,
				deadliftMax
			);
			await updateMaxInStorage(lift, newMaxValue, setSquatMax, setBenchMax, setDeadliftMax);
		} else {
			// Revert to the previous value if marking as incomplete
			const previousValue = previousMaxValues[lift];
			if (previousValue !== undefined) {
				await updateMaxInStorage(
					lift,
					previousValue,
					setSquatMax,
					setBenchMax,
					setDeadliftMax
				);
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

	const goToNextWeek = () => {
		let nextWeek = parseInt(week as string) + 1;
		if (nextWeek <= 21) {
			router.push(`./WorkoutDetailScreen?week=${nextWeek}`);
		}
	};

	const goToPreviousWeek = () => {
		let previousWeek = parseInt(week as string) - 1;
		if (previousWeek >= 1) {
			router.push(`./WorkoutDetailScreen?week=${previousWeek}`);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<Layout style={styles.container}>
				{/* Week Navigation */}
				<View style={styles.navigationContainer}>
					<Icon
						name="arrow-back-outline"
						onPress={goToPreviousWeek}
						style={[styles.arrowIcon, parseInt(week) <= 1 ? styles.disabledArrow : {}]}
						disabled={parseInt(week) <= 1}
					/>
					<Text category="h1">Week {week}</Text>
					<Icon
						name="arrow-forward-outline"
						onPress={goToNextWeek}
						style={[styles.arrowIcon, parseInt(week) >= 21 ? styles.disabledArrow : {}]}
						disabled={parseInt(week) >= 21}
					/>
				</View>

				{/* Render lifts */}
				<WorkoutSection
					lift="deadlift"
					max={deadliftMax}
					label="Deadlift"
					week={week}
					selectedReps={selectedReps.deadlift}
					setSelectedReps={setSelectedReps}
					isCompleted={isCompleted[week]?.deadlift || false}
					handleComplete={handleComplete}
					calculateWorkoutWeight={(oneRepMax, percentage) =>
						calculateWorkoutWeight(oneRepMax, percentage, rounding)
					}
					normalReps={normalRepsPerWeek.deadlift[parseInt(week) - 1]}
					repoutTarget={repoutTarget.deadlift[parseInt(week) - 1]}
				/>
				<WorkoutSection
					lift="benchPress"
					max={benchMax}
					label="Bench Press"
					week={week}
					selectedReps={selectedReps.benchPress}
					setSelectedReps={setSelectedReps}
					isCompleted={isCompleted[week]?.benchPress || false}
					handleComplete={handleComplete}
					calculateWorkoutWeight={(oneRepMax, percentage) =>
						calculateWorkoutWeight(oneRepMax, percentage, rounding)
					}
					normalReps={normalRepsPerWeek.benchPress[parseInt(week) - 1]}
					repoutTarget={repoutTarget.benchPress[parseInt(week) - 1]}
				/>
				<WorkoutSection
					lift="squat"
					max={squatMax}
					label="Squat"
					week={week}
					selectedReps={selectedReps.squat}
					setSelectedReps={setSelectedReps}
					isCompleted={isCompleted[week]?.squat || false}
					handleComplete={handleComplete}
					calculateWorkoutWeight={(oneRepMax, percentage) =>
						calculateWorkoutWeight(oneRepMax, percentage, rounding)
					}
					normalReps={normalRepsPerWeek.squat[parseInt(week) - 1]}
					repoutTarget={repoutTarget.squat[parseInt(week) - 1]}
				/>
			</Layout>
		</SafeAreaView>
	);
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
	disabledArrow: {
		opacity: 0.3, // Change opacity to indicate it's disabled
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
		width: 275,
	},
});

export default WorkoutDetailScreen;

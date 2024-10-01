import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Layout, Text, Icon, IndexPath } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import WorkoutSection from '@/components/WorkoutSection';
import { useWorkoutData } from '../hooks/useWorkoutData';
import { normalRepsPerWeek, repoutTarget } from '@/constants/intensities';
import { calculateWorkoutWeight } from '../utils/workoutHelpers';
import { handleComplete } from '../utils/workoutHandlers';

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

	const handleCompleteWrapper = async (lift: string) => {
		await handleComplete({
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
		});
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
					handleComplete={handleCompleteWrapper}
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
					handleComplete={handleCompleteWrapper}
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
					handleComplete={handleCompleteWrapper}
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
		opacity: 0.3,
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

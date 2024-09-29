import React, { useEffect, useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Layout, Text, Icon, CheckBox, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { intensities } from '../../constants/intensities';

const WorkoutDetailScreen: React.FC = () => {
	const [squatMax, setSquatMax] = useState<number | null>(null);
	const [benchMax, setBenchMax] = useState<number | null>(null);
	const [deadliftMax, setDeadliftMax] = useState<number | null>(null);
	const [isCompleted, setIsCompleted] = useState<{ [key: string]: boolean }>({});
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

				if (squat) setSquatMax(parseInt(squat));
				if (bench) setBenchMax(parseInt(bench));
				if (deadlift) setDeadliftMax(parseInt(deadlift));
				if (rounding) setRounding(parseFloat(rounding));
			} catch (error) {
				console.error('Error retrieving data', error);
			}
		};

		getUserData();
	}, []);

	const calculateWorkoutWeight = (oneRepMax: number, percentage: number) => {
		const weight = oneRepMax * (percentage / 100);
		return Math.round(weight / rounding) * rounding;
	};

	const handleComplete = async (lift: string) => {
		setIsCompleted((prev) => ({ ...prev, [lift]: !prev[lift] }));
		if (!isCompleted[lift]) {
			await AsyncStorage.setItem('lastCompletedWeek', week as string);
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

				{/* Deadlift */}
				<View style={styles.workoutSection}>
					{deadliftMax && (
						<>
							<Text category="s1" style={styles.workoutText}>
								Deadlift:{' '}
								{calculateWorkoutWeight(
									deadliftMax,
									intensities.deadlift[parseInt(week) - 1]
								)}{' '}
								lbs, 5 reps
							</Text>
							<Text category="s1" style={styles.workoutText}>
								Repout Target: 9 reps
							</Text>
						</>
					)}
					<Select
						label="Beat by X Reps"
						selectedIndex={selectedReps.deadlift}
						onSelect={(index) =>
							setSelectedReps((prev) => ({ ...prev, deadlift: index as IndexPath }))
						}
						style={styles.picker}>
						{roundingOptions.map((val) => (
							<SelectItem key={val} title={`Reps: ${val}`} />
						))}
					</Select>
					<CheckBox
						checked={isCompleted.deadlift}
						onChange={() => handleComplete('deadlift')}
						style={styles.checkbox}>
						{isCompleted.deadlift ? 'Completed' : 'Mark as Complete'}
					</CheckBox>
				</View>

				{/* Bench Press */}
				<View style={styles.workoutSection}>
					{benchMax && (
						<>
							<Text category="s1" style={styles.workoutText}>
								Bench Press:{' '}
								{calculateWorkoutWeight(
									benchMax,
									intensities.benchPress[parseInt(week) - 1]
								)}{' '}
								lbs, 5 reps
							</Text>
							<Text category="s1" style={styles.workoutText}>
								Repout Target: 9 reps
							</Text>
						</>
					)}
					<Select
						label="Beat by X Reps"
						selectedIndex={selectedReps.benchPress}
						onSelect={(index) =>
							setSelectedReps((prev) => ({ ...prev, benchPress: index as IndexPath }))
						}
						style={styles.picker}>
						{roundingOptions.map((val) => (
							<SelectItem key={val} title={`Reps: ${val}`} />
						))}
					</Select>
					<CheckBox
						checked={isCompleted.benchPress}
						onChange={() => handleComplete('benchPress')}
						style={styles.checkbox}>
						{isCompleted.benchPress ? 'Completed' : 'Mark as Complete'}
					</CheckBox>
				</View>

				{/* Squat */}
				<View style={styles.workoutSection}>
					{squatMax && (
						<>
							<Text category="s1" style={styles.workoutText}>
								Squat:{' '}
								{calculateWorkoutWeight(
									squatMax,
									intensities.squat[parseInt(week) - 1]
								)}{' '}
								lbs, 5 reps
							</Text>
							<Text category="s1" style={styles.workoutText}>
								Repout Target: 9 reps
							</Text>
						</>
					)}
					<Select
						label="Beat by X Reps"
						selectedIndex={selectedReps.squat}
						onSelect={(index) =>
							setSelectedReps((prev) => ({ ...prev, squat: index as IndexPath }))
						}
						style={styles.picker}>
						{roundingOptions.map((val) => (
							<SelectItem key={val} title={`Reps: ${val}`} />
						))}
					</Select>
					<CheckBox
						checked={isCompleted.squat}
						onChange={() => handleComplete('squat')}
						style={styles.checkbox}>
						{isCompleted.squat ? 'Completed' : 'Mark as Complete'}
					</CheckBox>
				</View>
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

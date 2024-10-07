import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {
	Layout,
	Text,
	Input,
	Button,
	Icon,
	Select,
	SelectItem,
	IndexPath,
	useTheme,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';

const SetupScreen: React.FC = () => {
	const theme = useTheme();
	const [squatMax, setSquatMax] = useState<string>('');
	const [benchMax, setBenchMax] = useState<string>('');
	const [deadliftMax, setDeadliftMax] = useState<string>('');
	const [roundingOption, setRoundingOption] = useState(new IndexPath(0));
	const router = useRouter();

	const roundingOptions = [2.5, 5];

	// Load the stored values from AsyncStorage when the component mounts or screen is focused
	const loadStoredValues = async () => {
		try {
			const storedSquatMax = await AsyncStorage.getItem('squatMax');
			const storedBenchMax = await AsyncStorage.getItem('benchMax');
			const storedDeadliftMax = await AsyncStorage.getItem('deadliftMax');
			const storedRounding = await AsyncStorage.getItem('rounding');

			if (storedSquatMax) setSquatMax(storedSquatMax);
			if (storedBenchMax) setBenchMax(storedBenchMax);
			if (storedDeadliftMax) setDeadliftMax(storedDeadliftMax);
			if (storedRounding) {
				const roundingIndex = roundingOptions.findIndex(
					(option) => option.toString() === storedRounding
				);
				if (roundingIndex !== -1) setRoundingOption(new IndexPath(roundingIndex));
			}
		} catch (error) {
			console.error('Error loading stored values', error);
		}
	};

	// Use `useFocusEffect` to load the stored values whenever the screen comes into focus
	useFocusEffect(
		useCallback(() => {
			loadStoredValues();
		}, [])
	);

	const saveMaxes = async () => {
		try {
			await AsyncStorage.setItem('squatMax', squatMax);
			await AsyncStorage.setItem('benchMax', benchMax);
			await AsyncStorage.setItem('deadliftMax', deadliftMax);
			await AsyncStorage.setItem('rounding', roundingOptions[roundingOption.row].toString());

			// Trigger update in WorkoutDetailScreen
			await AsyncStorage.setItem('storageUpdated', Date.now().toString());

			// Determine where the user should start
			const lastCompletedWeek = await AsyncStorage.getItem('lastCompletedWeek');
			const lastCompletedDay = await AsyncStorage.getItem('lastCompletedDay');

			let nextWeek = 1;
			let nextDay = 1;

			if (lastCompletedWeek && lastCompletedDay) {
				nextWeek = parseInt(lastCompletedWeek);
				nextDay = parseInt(lastCompletedDay) + 1;

				if (nextDay > 7) {
					nextDay = 1;
					nextWeek += 1;
				}
			}

			router.replace(`./WorkoutDetailScreen?week=${nextWeek}&day=${nextDay}`);
		} catch (error) {
			console.error('Error saving 1RM values', error);
		}
	};

	const resetStorage = async () => {
		Alert.alert(
			'Reset Data',
			'Are you sure you want to delete all your saved data and start over?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'OK',
					onPress: async () => {
						try {
							await AsyncStorage.clear();
							await AsyncStorage.setItem('storageUpdated', Date.now().toString());
							await AsyncStorage.setItem('reset', 'true'); // Set reset flag

							setSquatMax('');
							setBenchMax('');
							setDeadliftMax('');
							setRoundingOption(new IndexPath(0));

							Alert.alert('Success', 'All data has been reset.');
						} catch (error) {
							console.error('Error resetting storage', error);
						}
					},
				},
			],
			{ cancelable: true }
		);
	};

	const SaveIcon = (props: any) => <Icon {...props} name="save-outline" />;

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<Layout
				style={[styles.container, { backgroundColor: theme['background-basic-color-1'] }]}>
				<Text category="h1" style={[styles.header, { color: theme['text-basic-color'] }]}>
					Enter Your 1RM
				</Text>
				<Input
					style={[
						styles.input,
						{
							backgroundColor: theme['surface-color-1'],
							color: theme['text-basic-color'],
						},
					]}
					label={'Squat Max'}
					placeholder="Squat Max"
					placeholderTextColor={theme['text-hint-color']}
					keyboardType="numeric"
					value={squatMax}
					onChangeText={setSquatMax}
				/>
				<Input
					style={[
						styles.input,
						{
							backgroundColor: theme['surface-color-1'],
							color: theme['text-basic-color'],
						},
					]}
					label={'Bench Max'}
					placeholder="Bench Max"
					placeholderTextColor={theme['text-hint-color']}
					keyboardType="numeric"
					value={benchMax}
					onChangeText={setBenchMax}
				/>
				<Input
					style={[
						styles.input,
						{
							backgroundColor: theme['surface-color-1'],
							color: theme['text-basic-color'],
						},
					]}
					label={'Deadlift Max'}
					placeholder="Deadlift Max"
					placeholderTextColor={theme['text-hint-color']}
					keyboardType="numeric"
					value={deadliftMax}
					onChangeText={setDeadliftMax}
				/>

				{/* Custom Rounding Option Label */}
				<Text category="s2" style={[styles.label, { color: theme['text-basic-color'] }]}>
					Rounding Option
				</Text>
				<Select
					placeholder="Select Rounding Option"
					style={[styles.select, { backgroundColor: theme['surface-color-1'] }]}
					value={roundingOptions[roundingOption.row]}
					selectedIndex={roundingOption}
					onSelect={(index) => setRoundingOption(index as IndexPath)}>
					<SelectItem
						title="2.5 lbs"
						style={{ backgroundColor: theme['surface-color-1'] }}
					/>
					<SelectItem
						title="5 lbs"
						style={{ backgroundColor: theme['surface-color-1'] }}
					/>
				</Select>

				<Button
					style={[
						styles.button,
						{
							backgroundColor: theme['color-accent-400'],
							borderColor: theme['color-primary-600'],
						},
					]}
					onPress={saveMaxes}
					accessoryLeft={SaveIcon}>
					Save & Continue
				</Button>

				<Button
					style={[styles.resetButton, { backgroundColor: theme['color-accent-100'] }]}
					status="danger"
					onPress={resetStorage}>
					Reset Data
				</Button>

				<StatusBar style="light" />
			</Layout>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
	},
	header: {
		textAlign: 'center',
		marginBottom: 20,
		fontFamily: 'Eva',
	},
	label: {
		marginBottom: 5,
		fontSize: 16,
		fontFamily: 'Eva',
	},
	input: {
		marginBottom: 10,
		borderRadius: 5,
		width: '100%',
	},
	select: {
		marginBottom: 10,
		borderRadius: 5,
		width: '100%',
		backgroundColor: 'red',
	},
	button: {
		marginTop: 20,
	},
	resetButton: {
		marginTop: 10,
	},
});

export default SetupScreen;

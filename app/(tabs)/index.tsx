import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
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

const SetupScreen: React.FC = () => {
	const theme = useTheme();
	const [squatMax, setSquatMax] = useState<string>('');
	const [benchMax, setBenchMax] = useState<string>('');
	const [deadliftMax, setDeadliftMax] = useState<string>('');
	const [roundingOption, setRoundingOption] = useState(new IndexPath(0));
	const router = useRouter();

	const roundingOptions = [2.5, 5];

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
		<Layout style={[styles.container, { backgroundColor: theme['background-basic-color-1'] }]}>
			<Text category="h1" style={[styles.header, { color: theme['text-basic-color'] }]}>
				Enter Your One Rep Max
			</Text>
			<Input
				style={[
					styles.input,
					{ backgroundColor: theme['surface-color-1'], color: theme['text-basic-color'] },
				]}
				placeholder="Squat Max"
				placeholderTextColor={theme['text-hint-color']}
				keyboardType="numeric"
				value={squatMax}
				onChangeText={setSquatMax}
			/>
			<Input
				style={[
					styles.input,
					{ backgroundColor: theme['surface-color-1'], color: theme['text-basic-color'] },
				]}
				placeholder="Bench Max"
				placeholderTextColor={theme['text-hint-color']}
				keyboardType="numeric"
				value={benchMax}
				onChangeText={setBenchMax}
			/>
			<Input
				style={[
					styles.input,
					{ backgroundColor: theme['surface-color-1'], color: theme['text-basic-color'] },
				]}
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
				style={[styles.input, { backgroundColor: theme['surface-color-1'] }]}
				value={roundingOptions[roundingOption.row]}
				selectedIndex={roundingOption}
				onSelect={(index) => setRoundingOption(index as IndexPath)}>
				<SelectItem title="2.5 lbs" style={{ backgroundColor: theme['surface-color-1'] }} />
				<SelectItem title="5 lbs" style={{ backgroundColor: theme['surface-color-1'] }} />
			</Select>

			<Button
				style={[
					styles.button,
					{
						backgroundColor: theme['color-primary-500'],
						borderColor: theme['color-primary-600'],
					},
				]}
				onPress={saveMaxes}
				accessoryLeft={SaveIcon}>
				Save & Continue
			</Button>

			<Button
				style={[styles.resetButton, { backgroundColor: theme['color-primary-600'] }]}
				status="danger"
				onPress={resetStorage}>
				Reset Data
			</Button>

			<StatusBar style="light" />
		</Layout>
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
	},
	label: {
		marginBottom: 5,
		fontSize: 16,
	},
	input: {
		marginBottom: 10,
		borderRadius: 5,
		width: '100%',
	},
	button: {
		marginTop: 20,
	},
	resetButton: {
		marginTop: 10,
	},
});

export default SetupScreen;

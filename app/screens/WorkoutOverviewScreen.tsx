import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';

const WorkoutOverviewScreen: React.FC = ({ navigation }: any) => {
	return (
		<Layout style={styles.container}>
			<Text category="h1" style={styles.header}>
				Workout Overview
			</Text>
			<Button onPress={() => navigation.navigate('WorkoutDetail', { week: 1, day: 1 })}>
				Go to Week 1, Day 1
			</Button>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		marginBottom: 20,
	},
});

export default WorkoutOverviewScreen;

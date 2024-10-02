import React from 'react';
import { Tabs } from 'expo-router';
import { IconRegistry, ApplicationProvider, Icon } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Tab Icon Component
function TabBarIcon(props: { name: string; color: string }) {
	return (
		<Icon
			name={props.name}
			pack="eva"
			fill={props.color}
			style={{ width: 28, height: 28, marginBottom: -3 }}
		/>
	);
}

export default function TabLayout() {
	return (
		<>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider {...eva} theme={eva.dark}>
				<SafeAreaProvider>
					<SafeAreaView style={styles.safeArea}>
						<View style={styles.container}>
							<Tabs
								screenOptions={{
									tabBarLabelStyle: { fontSize: 14 },
									headerShown: false,
									tabBarActiveTintColor: '#FFD700',
									tabBarStyle: {
										backgroundColor: '#1a1a1a',
										height: 80,
										paddingBottom: 20,
										borderTopWidth: 0,
									},
								}}>
								{/* Setup Screen Tab */}
								<Tabs.Screen
									name="index"
									options={{
										title: 'Setup',
										headerShown: false,
										tabBarIcon: ({ color }) => (
											<TabBarIcon name="settings-outline" color={color} />
										),
									}}
								/>
								{/* Workout Detail Screen Tab */}
								<Tabs.Screen
									name="WorkoutDetailScreen"
									options={{
										title: 'Workout',
										headerShown: false,
										tabBarIcon: ({ color }) => (
											<TabBarIcon name="activity-outline" color={color} />
										),
									}}
								/>
							</Tabs>
						</View>
					</SafeAreaView>
				</SafeAreaProvider>
			</ApplicationProvider>
		</>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#1a1a1a', // Ensure consistent background color
	},
	container: {
		flex: 1,
	},
});

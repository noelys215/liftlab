import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { IconRegistry, ApplicationProvider, Icon } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { TouchableOpacity, View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

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
	const [theme, setTheme] = useState(eva.light);

	const toggleTheme = () => setTheme(theme === eva.light ? eva.dark : eva.light);

	// Explicit color values for light and dark modes
	const lightBackgroundColor = '#ffffff';
	const darkBackgroundColor = '#1a1a1a';
	const lightIconColor = '#000';
	const darkIconColor = '#fff';

	return (
		<>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider {...eva} theme={theme}>
				{/* SafeAreaView and Theme Wrapper */}
				<SafeAreaView
					style={{
						flex: 1,
						backgroundColor:
							theme === eva.light ? lightBackgroundColor : darkBackgroundColor,
					}}>
					{/* StatusBar using react-native */}
					<StatusBar
						barStyle={theme === eva.light ? 'dark-content' : 'light-content'}
						backgroundColor={
							theme === eva.light ? lightBackgroundColor : darkBackgroundColor
						}
						translucent={false}
					/>
					<View
						style={[
							styles.wrapper,
							{
								backgroundColor:
									theme === eva.light
										? lightBackgroundColor
										: darkBackgroundColor,
							},
						]}>
						{/* Theme Toggle Button */}
						<View style={styles.themeToggleContainer}>
							<TouchableOpacity onPress={toggleTheme}>
								<Icon
									name={theme === eva.light ? 'moon-outline' : 'sun-outline'}
									pack="eva"
									style={{ width: 32, height: 32 }}
									fill={theme === eva.light ? lightIconColor : darkIconColor}
								/>
							</TouchableOpacity>
						</View>

						<Tabs
							screenOptions={{
								tabBarActiveTintColor: theme === eva.light ? '#3366FF' : '#FFD700',
								tabBarStyle: {
									backgroundColor:
										theme === eva.light
											? lightBackgroundColor
											: darkBackgroundColor,
								},
							}}>
							{/* Setup Screen Tab */}
							<Tabs.Screen
								name="index" // Reference file by name convention (index.tsx will be used)
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
								name="WorkoutDetailScreen" // Reference by file name (WorkoutDetailScreen.tsx)
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
			</ApplicationProvider>
		</>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	themeToggleContainer: {
		position: 'absolute',
		top: 10,
		right: 20,
		zIndex: 1, // Ensure it stays above other components
	},
});

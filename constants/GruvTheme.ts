import * as eva from '@eva-design/eva';

const GruvTheme = {
	...eva.dark, // Start with eva.dark to get all the default dark properties
	// Background and Surface
	'background-basic-color-1': '#282828', // Gruvbox background color
	'surface-color-1': '#3c3836', // Surface color for cards or elevated sections

	// Primary Colors
	'color-primary-100': '#fbf1c7', // Lightest shade
	'color-primary-200': '#f9d79e',
	'color-primary-300': '#fabd2f',
	'color-primary-400': '#e6981a', // Gold-inspired Gruvbox color
	'color-primary-500': '#d79921', // Main Gruvbox yellow
	'color-primary-600': '#b57614', // Darker shade for primary buttons and accents

	// Accent Colors
	'color-accent-100': '#d3869b', // Light pink accent (based on Gruvbox)
	'color-accent-200': '#b16286', // Pink accent
	'color-accent-300': '#8f3f71',
	'color-accent-400': '#689d6a', // Green inspired by Gruvbox highlights

	// Highlights
	'color-warning-500': '#fe8019', // Bright orange, Gruvbox warning color

	// Text Colors
	'text-basic-color': '#ebdbb2', // Gruvbox light beige for main text
	'text-hint-color': '#a89984', // Gruvbox gray for hints and placeholders

	// Others
	'border-basic-color-1': '#504945', // Border color for subtle differentiation
	'color-success-500': '#b8bb26', // Bright green for completed items
};

export default GruvTheme;

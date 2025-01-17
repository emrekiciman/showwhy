/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface PageDetails {
	title: string
	icon: string
	route: string
}

export const pages: {
	model: PageDetails
	wrangle: PageDetails
	discover: PageDetails
	exposure: PageDetails
	events: PageDetails
} = {
	model: {
		title: 'Model Domain',
		icon: 'TableComputed',
		route: 'model',
	},
	wrangle: {
		title: 'Wrangle Data',
		icon: 'TableComputed',
		route: 'wrangle',
	},
	discover: {
		title: 'Causal Discovery',
		icon: 'SearchData',
		route: 'discover',
	},
	exposure: {
		title: 'Exposure Analysis',
		icon: 'TestBeaker',
		route: 'exposure',
	},
	events: {
		title: 'Event Analysis',
		icon: 'Event',
		route: 'events',
	},
}

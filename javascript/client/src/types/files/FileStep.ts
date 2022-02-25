/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StepStatus } from '~types'

export interface FileStep {
	name: string
	key: string
	value: any
	status: StepStatus
	component?: any
	question?: string
	instructions?: string
}
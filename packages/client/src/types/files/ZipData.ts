/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { BaseFile, Json } from '@data-wrangling-components/utilities'
import { RunHistory } from '~types'

export interface ZipData {
	json?: Json
	tables?: BaseFile[]
	notebooks?: BaseFile[]
	results?: {
		file?: BaseFile
		dataUri: string
	}
	name?: string
	runHistory?: RunHistory[]
}
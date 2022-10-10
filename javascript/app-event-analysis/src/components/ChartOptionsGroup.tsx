/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, Stack } from '@fluentui/react'
import { memo, useCallback } from 'react'

import type { ChartOptionsGroupProps } from './ChartOptionsGroup.types.js'

export const ChartOptionsGroup: React.FC<ChartOptionsGroupProps> = memo(
	function ChartOptionsGroup({ options, onChange, isPlaceboSimulation }) {
		const {
			renderRawData,
			showTreatmentStart,
			showSynthControl,
			applyIntercept,
			relativeIntercept,
			showGrid,
			showMeanTreatmentEffect,
		} = options

		const handleOnChange = useCallback(
			(opt: { [key: string]: boolean }) => {
				onChange({ ...options, ...opt })
			},
			[onChange, options],
		)

		return (
			<Stack tokens={{ childrenGap: 5 }}>
				<Checkbox
					label="Show synthetic control"
					checked={showSynthControl}
					onChange={(e, isChecked) =>
						handleOnChange({ showSynthControl: !!isChecked })
					}
					disabled={isPlaceboSimulation}
				/>
				<Checkbox
					label="Apply intercept offset"
					checked={applyIntercept}
					onChange={(e, isChecked) =>
						handleOnChange({ applyIntercept: !!isChecked })
					}
					disabled={isPlaceboSimulation}
				/>
				<Checkbox
					label="Relative intercept"
					checked={relativeIntercept}
					onChange={(e, isChecked) =>
						handleOnChange({ relativeIntercept: !!isChecked })
					}
					disabled={isPlaceboSimulation}
				/>
				<Checkbox
					label="Show Mean Treatment"
					checked={showMeanTreatmentEffect}
					onChange={(e, isChecked) =>
						handleOnChange({ showMeanTreatmentEffect: !!isChecked })
					}
					disabled={isPlaceboSimulation}
				/>
			</Stack>
		)
	},
)
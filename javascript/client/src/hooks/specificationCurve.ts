/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Dimensions } from '@essex-js-toolkit/hooks'
import type { Theme } from '@thematic/core'
import { useThematic } from '@thematic/react'
import { useCallback, useMemo, useState } from 'react'
import { useLoadSpecificationData } from '../pages/PerformAnalysis/ExploreSpecificationCurvePage/hooks'
import {
	useDefaultRun,
	useOnMouseOver,
	useWakeLock,
	useFailedRefutationIds,
	useVegaWindowDimensions,
} from '~hooks'
import {
	useHoverState,
	useRunHistory,
	useSetSpecificationCurveConfig,
	useSetSignificanceTests,
	useSpecificationCurveConfig,
	useExperiment,
} from '~state'
import {
	CausalityLevel,
	DecisionFeature,
	Experiment,
	RunHistory,
	Specification,
	SpecificationCurveConfig,
	NodeResponseStatus,
	Maybe,
	Handler,
} from '~types'

export function useSpecificationCurve(): {
	activeProcessing: Maybe<RunHistory>
	config: SpecificationCurveConfig
	data: Specification[]
	defaultRun: Maybe<RunHistory>
	failedRefutationIds: number[]
	failedRefutations: string[]
	handleConfidenceIntervalTicksChange: (checked: boolean) => void
	handleShapTicksChange: (checked: boolean) => void
	hovered: Maybe<number>
	isConfidenceIntervalDisabled: boolean
	isShapDisabled: boolean
	isSpecificationOn: boolean
	onMouseOver: (item: Maybe<Specification | DecisionFeature>) => void
	onSpecificationsChange: (config: SpecificationCurveConfig) => void
	onToggleRejectEstimate: Handler
	outcome: Maybe<string>
	refutationNumbers: string
	selectedSpecification: Maybe<Specification>
	setSelectedSpecification: (s: Maybe<Specification>) => void
	theme: Theme
	vegaWindowDimensions: Dimensions
} {
	const data = useLoadSpecificationData()
	const config = useSpecificationCurveConfig()
	const runHistory = useRunHistory()
	const hovered = useHoverState()
	const defaultRun = useDefaultRun()
	const onMouseOver = useOnMouseOver()
	const failedRefutationIds = useFailedRefutationIds(data)
	const vegaWindowDimensions = useVegaWindowDimensions()
	const theme = useThematic()
	const defineQuestion = useExperiment()
	const outcome = useOutcome(defineQuestion)
	useWakeLock()
	const activeProcessing = useActiveProcessing(runHistory)
	const [selectedSpecification, setSelectedSpecification] =
		useState<Maybe<Specification>>()
	const isShapDisabled = useIsShapDisabled()
	const isConfidenceIntervalDisabled = useIsConfidenceIntervalDisabled(data)
	const handleShapTicksChange = useHandleShapTicksChange(isShapDisabled)
	const handleConfidenceIntervalTicksChange =
		useHandleConfidenceIntervalTicksChange(isConfidenceIntervalDisabled)
	const onSpecificationsChange = useOnSpecificationsChange()
	const refutationKeys = useRefutationKeys(selectedSpecification)
	const failedRefutations = useFailedRefutations(
		selectedSpecification,
		refutationKeys,
	)
	const refutationNumbers = useRefutationNumbers(
		selectedSpecification,
		refutationKeys,
		failedRefutations,
	)
	const isSpecificationOn = useIsSpecificationOn(selectedSpecification)
	const onToggleRejectEstimate = useOnToggleRejectEstimateHandler(
		selectedSpecification,
		isSpecificationOn,
	)

	return {
		activeProcessing,
		config,
		data,
		defaultRun,
		failedRefutationIds,
		failedRefutations,
		handleConfidenceIntervalTicksChange,
		handleShapTicksChange,
		hovered,
		isConfidenceIntervalDisabled,
		isShapDisabled,
		isSpecificationOn,
		onMouseOver,
		onSpecificationsChange,
		onToggleRejectEstimate,
		outcome,
		refutationNumbers,
		selectedSpecification,
		setSelectedSpecification,
		theme,
		vegaWindowDimensions,
	}
}

function useOutcome(defineQuestion: Experiment) {
	return useMemo(
		() =>
			defineQuestion.outcome?.definition.find(
				d => d.level === CausalityLevel.Primary,
			)?.variable,
		[defineQuestion],
	)
}

function useActiveProcessing(runHistory: RunHistory[]): Maybe<RunHistory> {
	return useMemo(() => {
		return runHistory.find(
			x =>
				x.status?.status.toLowerCase() === NodeResponseStatus.Pending ||
				x.status?.status.toLowerCase() === NodeResponseStatus.Processing ||
				x.status?.status.toLowerCase() === NodeResponseStatus.Running,
		)
	}, [runHistory])
}

function useIsShapDisabled(): boolean {
	const defaultRun = useDefaultRun()
	return useMemo((): boolean => {
		if (!defaultRun) return false
		return defaultRun?.status?.status !== NodeResponseStatus.Completed
	}, [defaultRun])
}

function useIsConfidenceIntervalDisabled(data: Specification[]): boolean {
	const defaultRun = useDefaultRun()
	return useMemo((): boolean => {
		if (!defaultRun && data) return false
		return !defaultRun?.hasConfidenceInterval
	}, [defaultRun, data])
}

function useHandleShapTicksChange(
	isShapDisabled: boolean,
): (checked: boolean) => void {
	const config = useSpecificationCurveConfig()
	const setConfig = useSetSpecificationCurveConfig()
	return useCallback(
		checked => {
			setConfig({
				...config,
				shapTicks: isShapDisabled ? false : checked,
			})
		},
		[config, setConfig, isShapDisabled],
	)
}

function useHandleConfidenceIntervalTicksChange(
	isConfidenceIntervalDisabled: boolean,
): (checked: boolean) => void {
	const config = useSpecificationCurveConfig()
	const setConfig = useSetSpecificationCurveConfig()
	return useCallback(
		checked => {
			setConfig({
				...config,
				confidenceIntervalTicks: isConfidenceIntervalDisabled ? false : checked,
			})
		},
		[config, setConfig, isConfidenceIntervalDisabled],
	)
}

/**
 * When a specification selection change, we reset the significance test because it changes
 * based on active specifications
 */
function useOnSpecificationsChange() {
	const setConfig = useSetSpecificationCurveConfig()
	const defaultRun = useDefaultRun()

	const setSignificanceTest = useSetSignificanceTests(defaultRun?.id as string)
	return useCallback(
		(config: SpecificationCurveConfig) => {
			setConfig(config)
			setSignificanceTest(undefined)
		},
		[setConfig, setSignificanceTest],
	)
}

function useRefutationKeys(
	selectedSpecification: Maybe<Specification>,
): string[] {
	return useMemo(() => {
		if (selectedSpecification) {
			const keys = Object.keys(selectedSpecification).filter(x =>
				x.startsWith('refuter'),
			)

			const refutationRun = keys.filter(
				ref => !isNaN((selectedSpecification as any)[ref]),
			)

			return refutationRun
		}
		return []
	}, [selectedSpecification])
}

function useFailedRefutations(
	selectedSpecification: Maybe<Specification>,
	refutationKeys: string[],
): string[] {
	return useMemo(() => {
		if (selectedSpecification) {
			return (
				refutationKeys.filter(
					actualKey => (selectedSpecification as any)[actualKey] === 0,
				) || []
			)
		}
		return []
	}, [selectedSpecification, refutationKeys])
}

function useRefutationNumbers(
	selectedSpecification: Maybe<Specification>,
	refutationKeys: string[],
	failedRefutations: string[],
): string {
	return useMemo(() => {
		if (selectedSpecification) {
			return (
				refutationKeys.length -
				failedRefutations.length +
				'/' +
				refutationKeys.length
			)
		}
		return '0/0'
	}, [refutationKeys, failedRefutations, selectedSpecification])
}

function useIsSpecificationOn(
	selectedSpecification: Maybe<Specification>,
): boolean {
	const config = useSpecificationCurveConfig()
	return useMemo(() => {
		if (!selectedSpecification || !config.inactiveSpecifications) {
			return false
		}
		return !config.inactiveSpecifications.find(
			x => x === selectedSpecification?.id,
		)
	}, [config, selectedSpecification])
}

function useOnToggleRejectEstimateHandler(
	selectedSpecification: Maybe<Specification>,
	isSpecificationOn: boolean,
) {
	const config = useSpecificationCurveConfig()
	const setConfig = useSetSpecificationCurveConfig()

	return useCallback(() => {
		const { inactiveSpecifications = [] } = config
		if (selectedSpecification) {
			const newInactive = inactiveSpecifications.filter(
				s => s !== selectedSpecification?.id,
			)

			if (isSpecificationOn) {
				newInactive.push(selectedSpecification.id)
			}
			setConfig({
				...config,
				inactiveSpecifications: newInactive,
			})
		}
	}, [selectedSpecification, config, setConfig, isSpecificationOn])
}
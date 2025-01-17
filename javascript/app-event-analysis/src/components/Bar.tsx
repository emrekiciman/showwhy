/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import * as d3 from 'd3'
import { memo, useCallback, useEffect, useRef } from 'react'

import type { BarData, D3ScaleBand, D3ScaleLinear } from '../types.js'
import { BAR_TRANSPARENT, BarChartOrientation } from '../types.js'
import type { BarProps } from './Bar.types.js'

const ANIMATION_DURATION = 300
const EASING_FN = d3.easeLinear

export const Bar: React.FC<BarProps> = memo(function Bar({
	barElementClassName,
	xScale,
	yScale,
	orientation,
	width,
	widthOffset,
	height,
	color,
	data,
	animation,
	renderRotatedLabel,
	...props
}) {
	const ref = useRef<SVGGElement | null>(null)
	const theme = useThematic()
	const renderBar = useCallback(() => {
		const textColor = theme.text().fill().hex()
		if (ref.current) {
			if (orientation === BarChartOrientation.column) {
				//
				// vertical (column) bar chart
				//
				const barWidth = (xScale as D3ScaleBand).bandwidth()
				const barElement = d3
					.select<SVGGElement, BarData>(ref.current)
					.datum(data)
					.attr('transform', d => {
						const xOffset = (xScale as D3ScaleBand)(d.name) ?? 0
						const yOffset = (yScale as D3ScaleLinear)(d.value)
						return `translate(${xOffset}, ${yOffset})`
					})
				barElement.selectAll('*').remove()
				const renderedRect = barElement
					.append('rect')
					.attr('class', barElementClassName)
					.attr('stroke', 'none')
					.attr('opacity', d => d.opacity || BAR_TRANSPARENT)
				renderedRect
					.style('fill', d => d.color)
					.attr('width', barWidth)
					.attr('height', d => {
						const value = (yScale as D3ScaleLinear)(Math.abs(d.value))
						return height - value
					})
				if (animation) {
					renderedRect.transition().duration(ANIMATION_DURATION).ease(EASING_FN)
				}
				// add rotated label
				if (renderRotatedLabel) {
					barElement
						.append('text')
						.text(d => d.name ?? '')
						.attr('transform', function (d) {
							const xText = barWidth * 0.25
							return `translate(${xText}, 0) rotate(90)`
						})
						.attr('fill', textColor)
						.attr('font-size', 'x-small')
				}
			} else {
				//
				// horizontal (row) bar chart
				//
				const barHeight = (yScale as D3ScaleBand).bandwidth()
				const barElement = d3
					.select<SVGGElement, BarData>(ref.current)
					.datum(data)
					.attr('transform', d => {
						const yOffset = (yScale as D3ScaleBand)(d.name) ?? 0
						const xOffset = widthOffset
						return `translate(${xOffset}, ${yOffset})`
					})
				barElement.selectAll('*').remove()
				const renderedRect = barElement
					.append('rect')
					.attr('class', barElementClassName)
					.attr('stroke', 'none')
					.attr('opacity', BAR_TRANSPARENT)
				renderedRect
					.style('fill', d => d.color)
					.attr('width', d => (xScale as D3ScaleLinear)(d.value))
					.attr('height', barHeight)
				if (animation) {
					renderedRect.transition().duration(ANIMATION_DURATION).ease(EASING_FN)
				}
				// add rotated label
				if (renderRotatedLabel) {
					barElement
						.append('text')
						.text(d => d.name ?? '')
						.attr('transform', function (d) {
							const xText = barHeight * 0.25
							return `translate(${xText}, 0) rotate(90)`
						})
						.attr('fill', theme.text().fill().hex())
						.attr('font-size', 'x-small')
				}
			}
		}
	}, [
		theme,
		data,
		xScale,
		yScale,
		orientation,
		widthOffset,
		height,
		renderRotatedLabel,
		animation,
		barElementClassName,
	])

	useEffect(() => {
		renderBar()
	}, [
		renderBar,
		data,
		xScale,
		yScale,
		orientation,
		widthOffset,
		width,
		height,
		color,
		animation,
		renderRotatedLabel,
	])

	return <g ref={ref} {...props} />
})

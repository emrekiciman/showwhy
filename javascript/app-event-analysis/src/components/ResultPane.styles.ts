/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack } from '@fluentui/react'
import styled from 'styled-components'

export const StyledStack = styled(Stack)`
	padding: 10px 20px;
	height: 88vh;
	overflow: hidden auto;

	.italic {
		font-style: italic;
	}

	.light {
		color: dimgray;
		font-weight: 600;
	}

	.bottom-gap {
		margin-bottom: 6px;
		display: block;
	}

	.no-top-margin {
		margin-top: 0;
	}

	.last-item-margin {
		padding-bottom: 1rem;
	}

	.infoItem {
		background-color: lightgoldenrodyellow;
		margin: 4px;
	}

	.synth-control-text-margin {
		padding-bottom: 0.5rem;
	}

	.infoText {
		.negative {
			color: #991d32;
		}
		.positive {
			color: #008000;
		}
		.help-link {
			color: dodgerblue;
			cursor: help;
			position: relative;
			border-bottom: 1px dotted black;
		}
		.help-link:before {
			content: attr(data-hover);
			visibility: hidden;
			opacity: 0;
			width: 140px;
			background-color: dimgray;
			color: #fff;
			text-align: center;
			border-radius: 5px;
			transition: opacity 1s ease-in-out;
			font-weight: normal;
			position: absolute;
			z-index: 1;
			left: 0;
			top: 110%;
			padding: 5px 0;
			min-width: 300px;
			// use the following to enable dynalically resized hover text label
			// padding: 5px 5px;
			// width: max-content;
		}
		.help-link:hover:before {
			opacity: 1;
			visibility: visible;
		}
	}

	.statusMessage {
		padding-top: 2rem;
	}

	.chartContainer {
		min-height: 0;
	}

	.summary-list {
		max-height: 200px;
		overflow-y: auto;
		line-height: normal;
	}
`
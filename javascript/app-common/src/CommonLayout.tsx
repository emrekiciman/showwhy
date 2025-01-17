/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'allotment/dist/style.css'

import { Allotment } from 'allotment'
import { memo } from 'react'

import { RAIL_MAX_SIZE, RAIL_PREFERRED_SIZE } from './CommonLayout.constants.js'
import {
	Container,
	Content,
	LeftRail,
	MainArea,
	RightRail,
} from './CommonLayout.styles.js'
import type { CommonLayoutProps } from './CommonLayout.types.js'

export const CommonLayout: React.FC<CommonLayoutProps> = memo(
	function CommonLayout({ children, configRail, detailRail, menu }) {
		return (
			<Container>
				{menu}
				<MainArea>
					<Allotment>
						{configRail != null ? (
							<Allotment.Pane
								preferredSize={RAIL_PREFERRED_SIZE}
								maxSize={RAIL_MAX_SIZE}
							>
								<LeftRail>{configRail}</LeftRail>
							</Allotment.Pane>
						) : null}
						<Content>{children}</Content>
						{detailRail != null ? (
							<Allotment.Pane
								preferredSize={RAIL_PREFERRED_SIZE}
								maxSize={RAIL_MAX_SIZE}
							>
								<RightRail>{detailRail}</RightRail>
							</Allotment.Pane>
						) : null}
					</Allotment>
				</MainArea>
			</Container>
		)
	},
)

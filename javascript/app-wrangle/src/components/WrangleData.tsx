/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDataTable } from '@datashaper/app-framework'
import { CommonLayout } from '@showwhy/app-common'
import { memo } from 'react'
import styled from 'styled-components'

import { WrangleContent } from './WrangleContent.js'
import { useWrangleParameters } from './WrangleData.hooks.js'

export const WrangleData = memo(function CauseDis() {
	const { table, resource } = useWrangleParameters()
	const dataTable = useDataTable(table)
	return (
		<CommonLayout>
			<WrangleDataContainer>
				<WrangleContent dataTable={dataTable} resource={resource} />
			</WrangleDataContainer>
		</CommonLayout>
	)
})

const WrangleDataContainer = styled.div`
	height: calc(100vh - 42px);
`

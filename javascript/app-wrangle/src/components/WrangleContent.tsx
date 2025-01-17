/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CodebookEditor,
	DataSourceEditor,
	RawTableViewer,
	TableEditor,
	WorkflowEditor,
} from '@datashaper/app-framework'
import { memo } from 'react'

import type { WrangleContentProps } from './WrangleContent.types.js'

export const WrangleContent: React.FC<WrangleContentProps> = memo(
	function WrangleContent({ dataTable, resource }) {
		if (!dataTable) {
			return null
		}

		const key = `${dataTable.id}-${resource ?? 'noresource'}`
		switch (resource) {
			case 'datasource': // not modeled in enum
				return <RawTableViewer key={key} dataTable={dataTable} />
			case 'workflow':
				return <WorkflowEditor key={key} dataTable={dataTable} />
			case 'bundle': // not modeled in enum
				return <TableEditor key={key} dataTable={dataTable} />
			case 'source':
				return <DataSourceEditor key={key} dataTable={dataTable} />
			case 'codebook':
				return <CodebookEditor key={key} dataTable={dataTable} />
			default:
				return <div>unknown resource type {resource}</div>
		}
	},
)

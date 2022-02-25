/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption } from '@fluentui/react'
import { useMemo } from 'react'
import {
	useProjectFiles,
	useSelectOriginalTable,
	useTableColumns,
} from '~state'
import { ColumnRelevance } from '~types'

export function useVariableOptions(): IComboBoxOption[] {
	const projectFiles = useProjectFiles()
	const originalTableState = useSelectOriginalTable(
		projectFiles ? (projectFiles[0]?.id as string) : '',
	)
	const originalTable = originalTableState()?.table
	const columns = useTableColumns(
		projectFiles ? projectFiles[0]?.id : undefined,
	)

	return useMemo(() => {
		const removedColumns =
			columns
				?.filter(col => col.relevance === ColumnRelevance.NotCausallyRelevant)
				.map(x => x.name) || []
		const filteredColumns =
			originalTable?.columnNames().filter(x => !removedColumns?.includes(x)) ||
			[]
		const validColumns = filteredColumns.map(x => {
			return { key: x, text: x }
		})
		return validColumns || []
	}, [columns, originalTable])
}
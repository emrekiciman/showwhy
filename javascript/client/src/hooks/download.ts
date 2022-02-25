/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { downloadFile } from '~resources'
import { DownloadType, FileType, Maybe, AsyncHandler1 } from '~types'

export function useReturnResult(): AsyncHandler1<
	string,
	Maybe<{ blob: Blob; url: string }>
> {
	return useCallback((fileName: string) => downloadFile(fileName), [])
}

export function useDownloadResult(): (fileType: FileType) => void {
	const getResult = useReturnResult()
	return useCallback(
		(fileType: FileType) => {
			const fileName =
				fileType === FileType.csv ? DownloadType.csv : DownloadType.jupyter
			getResult(fileName).then(res => {
				if (!res) return
				const file = window.URL.createObjectURL(res.blob)
				const anchor = document.createElement('a')
				anchor.download = fileName
				anchor.href = file
				anchor.click()
			})
		},
		[getResult],
	)
}

export function useGetResult(): AsyncHandler1<
	Maybe<DownloadType>,
	Maybe<Blob>
> {
	return useCallback(async (type = DownloadType.csv) => {
		const result = await downloadFile(type)
		if (!result) return
		return result.blob
	}, [])
}
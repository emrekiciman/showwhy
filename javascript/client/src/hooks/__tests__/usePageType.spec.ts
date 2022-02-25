/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { usePageTypeTestable } from '../usePageType'

it('should return the page type', () => {
	const { result } = renderHook(() =>
		usePageTypeTestable('localhost:3000/prepare/columns'),
	)
	expect(result.current).toBe('columns')
})
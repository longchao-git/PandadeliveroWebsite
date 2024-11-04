// eslint-disable-next-line no-undef
import { validPhoneNum } from '../utils/regular'
import { expect } from '@jest/globals'

// eslint-disable-next-line no-undef
test('验证手机号', () => {
	// eslint-disable-next-line no-undef
	expect(validPhoneNum('17323181869')).toBe(true)
	expect(validPhoneNum('1732318186')).toBe(false)
	expect(validPhoneNum('182271195621')).toBe(false)
	expect(validPhoneNum('13668300525')).toBe(true)
})

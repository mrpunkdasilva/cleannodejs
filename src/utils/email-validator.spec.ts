import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

describe('Email Validator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValue(false)
    const isValid = sut.isValid('invalid_email')

    expect(isValid).toBe(false)
  })

  test('should returns true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValue(true)
    const isValid = sut.isValid('valid_mail@mail.com')
    expect(isValid).toBe(true)
  })
})

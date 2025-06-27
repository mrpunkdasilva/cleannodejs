import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  // classe para fazer o mock do validator para retornar um true/false
  // esse é um tipo de teste chamado stub
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    // SUT - SYSTEM UNDER TEST
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any@email',
        password: 'any_p@assw0rd',
        passwordConfirmation: 'any_p@assw0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_p@assw0rd',
        passwordConfirmation: 'any_p@assw0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any@email.com',
        name: 'any_name',
        passwordConfirmation: 'any_p@assw0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any@email.com',
        name: 'any_name',
        password: 'any_p@assw0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if no password confirmation fails', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any@email.com',
        name: 'any_name',
        password: 'any_p@assw0rd',
        passwordConfirmation: 'invalid_p@assw0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)

    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    // mocando para somente esse teste o valor do isValid
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        email: 'invalid@gmail.com',
        name: 'any_name',
        password: 'any_p@assw0rd',
        passwordConfirmation: 'any_p@assw0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct Email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid@gmail.com',
        password: 'any_p@assw0rd',
        passwordConfirmation: 'any_p@assw0rd'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('invalid@gmail.com')
  })

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    // mocando a implementação, mas a implementação é substituida para o retorno da função passada
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        email: 'anyd@gmail.com',
        name: 'any_name',
        password: 'any_p@assw0rd',
        passwordConfirmation: 'any_p@assw0rd'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})

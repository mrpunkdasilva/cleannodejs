import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { Encrypter } from '@/data/protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypterStup: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStup implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStup()
}

const makeSut = (): SutTypes => {
  const encrypterStup = makeEncrypter()
  const sut = new DbAddAccount(encrypterStup)

  return {
    sut,
    encrypterStup
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStup } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStup, 'encrypt')
    const accountData = { name: 'valid_name', password: 'valid_password', email: 'valid_email' }

    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStup } = makeSut()

    jest.spyOn(encrypterStup, 'encrypt').mockReturnValue(new Promise((resolve, reject) => reject(new Error())))

    const accountData = { name: 'valid_name', password: 'valid_password', email: 'valid_email' }

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})

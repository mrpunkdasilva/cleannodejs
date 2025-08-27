import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { Encrypter } from '@/data/protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount
  encrypterStup: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStup {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  const encrypterStup = new EncrypterStup()
  const sut = new DbAddAccount(encrypterStup)

  return {
    sut,
    encrypterStup
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStup } = await makeSut()

    const encryptSpy = jest.spyOn(encrypterStup, 'encrypt')
    const accountData = { name: 'valid_name', password: 'valid_password', email: 'valid_email' }

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})

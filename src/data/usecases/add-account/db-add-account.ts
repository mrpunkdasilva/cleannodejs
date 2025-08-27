import { AddAccountModel } from '@/domain/usecases/add-acount'
import { AccountModel } from '@/domain/models'
import { Encrypter } from '@/data/protocols/encrypter'

export class DbAddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = (await this.encrypter.encrypt(account.password))
    const newAccount: AccountModel = {
      id: 'any_id',
      name: account.name,
      email: account.email,
      password: hashedPassword
    }
    return newAccount
  }
}

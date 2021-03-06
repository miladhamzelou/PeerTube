import * as Bluebird from 'bluebird'
import { Response } from 'express'
import 'express-validator'
import * as validator from 'validator'
import { AccountModel } from '../../models/account/account'
import { isUserUsernameValid } from './users'

function isAccountNameValid (value: string) {
  return isUserUsernameValid(value)
}

function isAccountIdExist (id: number | string, res: Response) {
  let promise: Bluebird<AccountModel>

  if (validator.isInt('' + id)) {
    promise = AccountModel.load(+id)
  } else { // UUID
    promise = AccountModel.loadByUUID('' + id)
  }

  return isAccountExist(promise, res)
}

function isLocalAccountNameExist (name: string, res: Response) {
  const promise = AccountModel.loadLocalByName(name)

  return isAccountExist(promise, res)
}

async function isAccountExist (p: Bluebird<AccountModel>, res: Response) {
  const account = await p

  if (!account) {
    res.status(404)
      .send({ error: 'Account not found' })
      .end()

    return false
  }

  res.locals.account = account

  return true
}

// ---------------------------------------------------------------------------

export {
  isAccountIdExist,
  isLocalAccountNameExist,
  isAccountNameValid
}

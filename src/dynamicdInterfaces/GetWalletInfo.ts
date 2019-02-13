import { HdAccount } from "./HdAccount";

export interface GetWalletInfo {
  hdaccounts: HdAccount[]
  walletversion: number
  balance: number
  privatesend_balance: number
  unconfirmed_balance: number
  immature_balance: number
  txcount: number
  keypoololdest: number
  keypoolsize: number
  keypoolsize_hd_internal: number
  keys_left: number
  unlocked_until?: number
  paytxfee: number
  hdchainid: string
  hdaccountcount: number
}



export const currentUserKey = "CURRENT_USER";

export const apiConf = {
  login_path: 'https://identity.sparxo.com/oauth2/access_token',
  root: 'https://a.sparxo.com/1/',
  current_user: 'account/current_user',
  merchants: 'merchants',
  role_ids: {
    Admin: 2,
    Merchant: 3,
    Member: 4,
    MerchantRep: 5,
    Developer: 6
  }
}
import http from './http'

export const apiLogin = (loginid: string, userpassword: string) =>
  http.post('/api/hrm/login/checkLogin', new URLSearchParams({ loginid, userpassword }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

export const apiGetInitInfo = () => http.get('/api/OnboardMobile/getInitInfo')

export const apiGetHistoricalInformation = (selectedMethod: 'phone' | 'email', userInput: string) => {
  const bank1 = new URLSearchParams()
  bank1.append(selectedMethod === 'phone' ? 'sjh' : 'yx', userInput)
  return http.post('/api/OnboardMobile/getHistoricalInformation', bank1, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

export const apiGetRztzdXm = (sfzh: string, xm: string) =>
  http.post('/api/OnboardMobile/getRztzdXm', new URLSearchParams({ sfzh, xm }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

export const apiGetRztzdSjh = (sfzh: string, sjh: string) =>
  http.post('/api/OnboardMobile/getRztzdSjh', new URLSearchParams({ sfzh, sjh }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

export const apiGetRztzdStatus = (sfzh: string) =>
  http.post('/api/OnboardMobile/getRztzdStatus', new URLSearchParams({ sfzh }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

export const apiGetDefaultBankInfo = (gsdm: string, bg01?: string) =>
  http.post('/api/OnboardMobile/getDefaultBankInfo', new URLSearchParams({ gsdm, bg: bg01 || '' }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

export const apiGetBankInfo = (bankNmae: string, bankNameLike: string, province: string, city: string) => {
  const params = new URLSearchParams()
  params.append('bankNmae', bankNmae)
  params.append('bankNameLike', bankNameLike)
  params.append('province', province)
  params.append('city', city)
  return http.post('/api/OnboardMobile/getBankInfo', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

export const apiSaveUserInfo = (payload: any) =>
  http.post('/api/OnboardMobile/saveUserInfo', new URLSearchParams({ userInfo: JSON.stringify(payload) }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

export const apiGetCardBin = (bin: string) =>
  http.post(
    '/api/base/getListByMoreProperty',
    new URLSearchParams({ tableName: 'uf_card_bin', columnName: 'bin,status', columnValue: `${bin},有效` }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )

export const apiGetRztzdXx = (sfzh: string) =>
  http.post('/api/OnboardMobile/getRztzdXx', new URLSearchParams({ sfzh }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

// Login related
export const apiConfirmPhoneCode = (phone: string) =>
  http.post('/beyondsoft/rest/loginService/ConfirmPhoneCode', new URLSearchParams({ sjh: phone }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

export const apiConfirmEmailCode = (email: string) =>
  http.post('/beyondsoft/rest/loginService/ConfirmEmailCode', new URLSearchParams({ yx: email }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

export const apiVerifyCode = (verificationCode: string, code: string, timestamp: string) => {
  const params = new URLSearchParams()
  params.append('verificationCode', verificationCode)
  params.append('code', code)
  params.append('timestamp', timestamp)
  return http.post('/beyondsoft/rest/loginService/VerificationCode', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}



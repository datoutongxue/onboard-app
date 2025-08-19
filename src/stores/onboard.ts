import { defineStore } from 'pinia'

export type SelectOption = { text: string; value: string }

export interface UserInfoFormState {
  // 基本信息
  name: string
  pinyin?: string
  sex?: string
  mobile: string
  contactTel?: string
  email: string
  companyText: string
  company: string
  // 证件信息
  countryText: string
  country: string | number | undefined
  showNation: boolean
  showIdType: boolean
  idTypeText: string
  idType: string
  idNumber: string
  idNumberStartDate: string
  idNumberEndDate: string
  idNumberStartDateRequired: boolean
  idNumberEndDateRequired: boolean
  birthday: string
  polityText: string
  polity: string
  nationText: string
  nation: string
  // 学历等
  degreeText?: string
  degree?: string
  school?: string
  profession?: string
  xlzsbh?: string
  xwzsbh?: string
  // 来源信息
  bg?: string
  bg01?: string
  bu?: string
  // 银行信息
  otherBank: boolean
  bankTypeText: string
  bankType: string
  bankType2?: string
  provinceTypeText: string
  provinceType: string[]
  bankNameText: string
  bankName: string
  bankCard: string
  bankCardConfirm: string
  // 弹窗/选择器
  showPickerCompany: boolean
  showPickerProvinceType: boolean
  showPickerKhh: boolean | number
  pickerKhhLoading: boolean
  showPickerBankType: boolean
  // 数据列表
  studyData: any[]
  workData: any[]
  familyData: any[]
  certData: any[]
  // 户口与地址
  showHukou: boolean
  currentAddress?: string
  familyAddress?: string
  addressTypeText?: string
  addressType?: string
  selectedPlaces1Text: string
  selectedPlaces1: string[]
  selectedPlaces2Text: string
  selectedPlaces2: string[]
  selectedPlaces3Text: string
  selectedPlaces3: string[]
  accountTypeText: string
  accountType: string
  // 首次工作时间
  firstWork: string
  // 上传附件
  sfzzmsmjhzzy: any[]
  sfzzmsmjhzzyId?: string | null
  sfzfmsmj: any[]
  sfzfmsmjId?: string | null
  lzzmsmj: any[]
  lzzmsmjId?: string | null
  sfylzzm?: string | null
  sfylzzmid?: string | null
}

export const useOnboardStore = defineStore('onboard', {
  state: () => ({
    userInfoForm: {
      name: '',
      pinyin: '',
      sex: '',
      mobile: '',
      contactTel: '',
      email: '',
      companyText: '',
      company: '',
      countryText: '',
      country: undefined,
      showNation: false,
      showIdType: false,
      idTypeText: '',
      idType: '',
      idNumber: '',
      idNumberStartDate: '',
      idNumberEndDate: '',
      idNumberStartDateRequired: false,
      idNumberEndDateRequired: false,
      birthday: '',
      polityText: '',
      polity: '',
      nationText: '',
      nation: '',
      degreeText: '',
      degree: '',
      school: '',
      profession: '',
      xlzsbh: '',
      xwzsbh: '',
      bg: '',
      bg01: '',
      bu: '',
      otherBank: false,
      bankTypeText: '',
      bankType: '',
      bankType2: '',
      provinceTypeText: '',
      provinceType: [] as string[],
      bankNameText: '',
      bankName: '',
      bankCard: '',
      bankCardConfirm: '',
      showPickerCompany: false,
      showPickerProvinceType: false,
      showPickerKhh: false as boolean | number,
      pickerKhhLoading: false,
      showPickerBankType: false,
      studyData: [] as any[],
      workData: [] as any[],
      familyData: [] as any[],
      certData: [] as any[],
      showHukou: false,
      currentAddress: '',
      familyAddress: '',
      addressTypeText: '',
      addressType: '',
      selectedPlaces1Text: '',
      selectedPlaces1: [] as string[],
      selectedPlaces2Text: '',
      selectedPlaces2: [] as string[],
      selectedPlaces3Text: '',
      selectedPlaces3: [] as string[],
      accountTypeText: '',
      accountType: '',
      firstWork: '',
      sfzzmsmjhzzy: [],
      sfzfmsmj: [],
      lzzmsmj: [],
      sfylzzm: null,
      sfylzzmid: null,
    } as UserInfoFormState,
  }),
  persist: true,
})

declare module 'sub-vn' {
  export interface Province {
    name: string
    code: string
    districts: District[]
  }

  export interface District {
    name: string
    code: string
    wards: Ward[]
  }

  export interface Ward {
    name: string
    code: string
  }

  export function getProvinces(): Province[]
  export function getDistricts(provinceCode: string): District[]
  export function getWards(districtCode: string): Ward[]
}
export interface GHNAddressData {
  province: string
  district: string
  ward: string
  provinceCode: string
  districtCode: string
  districtId: string
  wardCode: string
  provinceName: string
}

interface GHNAddressSelectorProps {
  onAddressChange: (address: GHNAddressData) => void
}

export const GHNAddressSelector = ({ onAddressChange }: GHNAddressSelectorProps) => {
  return <div>GHN Address Selector</div>
}
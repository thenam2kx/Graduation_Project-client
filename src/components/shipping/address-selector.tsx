export interface AddressData {
  province: string
  district: string
  ward: string
  provinceCode?: string
  districtCode?: string
  wardCode?: string
  fullName?: string
  phone?: string
  provinceName?: string
  districtName?: string
  wardName?: string
  address?: string
  fullNameCode?: string
  phoneCode?: string
  streetAddressCode?: string
}

interface AddressSelectorProps {
  onAddressChange: (address: AddressData) => void
}

export const AddressSelector = ({ onAddressChange }: AddressSelectorProps) => {
  return <div>Address Selector</div>
}
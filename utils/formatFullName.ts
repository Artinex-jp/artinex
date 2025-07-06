type NameInput = {
  nationality?: string
  lastName: string
  firstName: string
  middleName?: string
}

export function formatFullName({
  nationality,
  lastName,
  firstName,
  middleName,
}: NameInput): string {
  const normalized = nationality?.trim().toLowerCase()

  // 姓を先にする国（姓 名形式） - 半角スペース区切り
  const surnameFirstCountries = new Set([
    'jp', 'japan', '日本',
    'cn', 'china', '中国',
    'kr', 'korea', '대한민국', '韓国',
    'vn', 'vietnam', 'ベトナム',
    'hu', 'hungary', 'ハンガリー'
  ])

  if (normalized && surnameFirstCountries.has(normalized)) {
    return `${lastName} ${firstName}${middleName ? ` ${middleName}` : ''}`
  }

  // 名→ミドル→姓（英語式）→ 姓, 名 ミドル
  return `${lastName}, ${firstName}${middleName ? ` ${middleName}` : ''}`
}
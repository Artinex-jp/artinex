const toCamel = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

export const toCamelCase = (input: any): any => {
  if (Array.isArray(input)) {
    return input.map(toCamelCase)
  }

  if (input !== null && typeof input === 'object' && !Array.isArray(input)) {
    return Object.entries(input).reduce((acc, [key, value]) => {
      const camelKey = toCamel(key)
      acc[camelKey] = toCamelCase(value)
      return acc
    }, {} as Record<string, any>)
  }

  return input
}

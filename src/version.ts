const pat = /([0-9]+)\.([0-9]+)\.([0-9]+)/

export interface Version {
  year: number
  month: number
  build: number
}

export function parseVersion(v: string): Version | null {
  const match = pat.exec(v)
  if (match === null) {
    return null
  }
  return {
    year: parseInt(match[1], 10),
    month: parseInt(match[2], 10),
    build: parseInt(match[3], 10),
  }
}

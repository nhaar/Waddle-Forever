export function isFlag(item: number) {
  return (
    (item >= 500 && item <= 548) ||
    (item >= 7095 && item <= 7096) ||
    (item === 7148) ||
    (item >= 7182 && item <= 7189)
  )
}
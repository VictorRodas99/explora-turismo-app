export const getTableAttrBasedOn = ({ type }: { type: string }) => {
  if (type !== 'distrito' && type !== 'punto') {
    throw new Error(`Given type is invalid, for "${type}"`)
  }

  const isDistrict = type === 'distrito'
  const table = isDistrict ? 'distrito_favoritos' : 'punto_interes_favoritos'
  const idAttr = isDistrict ? 'distrito_id' : 'punto_de_interes_id'

  return {
    table,
    idAttr
  } as const
}

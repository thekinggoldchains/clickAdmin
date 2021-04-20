import React, { FC, Fragment } from 'react'

const formatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
})

type Props = {
  cents: string | number
}

const Real: FC<Props> = ({ cents }) => {
  const parsedCents = typeof cents === 'string' ? parseInt(cents, 10) : cents

  return <Fragment>{formatter.format(parsedCents / 100)}</Fragment>
}

export default Real

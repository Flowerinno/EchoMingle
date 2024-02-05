import React from 'react'

type Props<T> = {
  of: T[]
  render: (item: T, index: number) => React.ReactNode
}

type Each = <T>(props: Props<T>) => React.ReactNode

export const Each: Each = ({ of, render }) =>
  React.Children.toArray(of.map((item, index) => render(item, index)))

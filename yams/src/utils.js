import { curry } from 'ramda/es'
import * as Maybe from './maybe'

export const mapNonNull = curry((f, value) =>
  Maybe.of(value)
    .map(f)
    .value(() => value),
)

export const renameKey = curry((from, to, { [from]: value, ...obj }) => ({
  ...obj,
  [to]: value,
}))

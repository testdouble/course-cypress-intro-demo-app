class Just {
  #value

  constructor(value) {
    this.#value = value
  }

  map(f) {
    return new Just(f(this.#value))
  }

  map2(maybe, f) {
    return maybe.andThen(otherValue => this.map(value => f(value, otherValue)))
  }

  andThen(f) {
    return f(this.#value)
  }

  value() {
    return this.#value
  }
}

const Nothing = {
  map() {
    return this
  },

  map2() {
    return this
  },

  andThen() {
    return this
  },

  value(f) {
    return f()
  },
}

export const of = value => (value == null ? Nothing : new Just(value))

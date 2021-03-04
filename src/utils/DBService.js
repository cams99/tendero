import { openDB } from 'idb';

const create = openDB('tendero.v2', 1, {
  upgrade(db) {
   db.createObjectStore('products', { autoIncrement: true, })
   db.createObjectStore('clients', { autoIncrement: true, })
   db.createObjectStore('paymentMethods', { autoIncrement: true, })
   db.createObjectStore('sells', { autoIncrement: true, })
   db.createObjectStore('turn', { autoIncrement: true, })
  },
})

const add = (data, store) => {
  create.then(db => {
    db.clear(store)
    const tx = db.transaction(store, 'readwrite')
    data.map(d => tx.store.add(d))
  })
}

const addOne = (data, store) => {
  create.then(db => {
    db.add(store, data)
  })
}

const getAll = store => {
  return create.then(db => {
    return db.getAll(store)
  })
}

const deleteAll = store => {
  create.then(db => {
    db.clear(store)
  })
}

export default {
  add,
  addOne,
  getAll,
  deleteAll,
} 
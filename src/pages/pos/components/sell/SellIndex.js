import React, { useState, useContext } from 'react'
import { Button, Col, Divider, Row, message } from 'antd'
import SellProductsList from './SellProductsList'
import PosPayment from '../PosPayment'
import PosSrc from '../../PosSrc'
import DBService from '../../../../utils/DBService'

// Context
import { Context } from '../../../../context'

function SellIndex(props) {
  const [{ auth }, dispatch] = useContext(Context)
  const [productsList, setProductsList] = useState([])
  const [addProducts, setAddProducts] = useState(true)
  const [total, setTotal] = useState(0)
  const [edit, setEdit] = useState(false)
  const [saveSell, setSaveSell] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sellCancelled, setSellCancelled] = useState(false)

  const getProductsList = data => {
    let amount = 0
    data.map(p => (amount += p.total))
    setTotal(amount)
    setProductsList(data)
  }

  const cancelSell = () => {
    setAddProducts(true)
    props.closeTab('5')
    setSellCancelled(true)
  }

  const finishSell = () => {
    setSaveSell(true)
  }

  const closeSell = (data, save) => {
    if (save) {
      setLoading(true)
      DBService.getAll('sells').then(sells => {
        if (sells.length > 0) {
          saveOfflineSells(sells)
        }
      })
      PosSrc.saveSell(data)
        .then(response => {
          if (!response) {
            DBService.addOne(data, 'sells')
          }
          message.success('Se ha guardado la venta')
          getCash(response.store_id)
        })
        .catch(err => {
          console.log(err)
          message.error('Error al guardar la venta')
          return false
        })
    }
    setSaveSell(false)
  }

  const getCash = id => {
    PosSrc.getStoreCash(id).then(response => {
      dispatch({
        type: 'TURN CASH',
        payload: response.data[0],
      })
      setLoading(false)
      cancelSell()
    })
  }

  const saveOfflineSells = data => {
    let _data = {
      store_id: data[0].store_id,
      sells: data.map(d => ({
        seller_id: auth.id,
        store_turn_id: d.store_turn_id,
        payment_method_id: d.payment_method_id,
        description: d.description,
        name: d.name,
        nit: d.nit,
        phone: d.phone,
        email: d.email,
        items: d.items,
      })),
    }
    PosSrc.saveOfflineSells(_data)
      .then(response => {
        if (response) {
          DBService.deleteAll('sells')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const onChangeView = status => {
    let validate = false
    productsList.map(product => (product.total > 0 ? (validate = true) : (validate = false)))
    if (validate) {
      setAddProducts(status)
      setEdit(status)
    } else {
      message.warning('Todos los campos son obligatorios')
    }
  }

  return (
    <>
      <Row gutter={16} className={'sell-row'}>
        <Col xs={24} sm={24} md={24} lg={24}>
          {addProducts ? (
            <SellProductsList
              products={getProductsList}
              productsList={productsList}
              edit={edit}
              store={props.store}
              turn={props.turn}
              isSellCancelled={sellCancelled}
              uncancellSell={_ => setSellCancelled(false)}
            />
          ) : (
            <PosPayment
              total={total}
              sellUnsaved={_ => setSaveSell(false)}
              saveSell={saveSell}
              productsList={productsList}
              closeSell={closeSell}
              store={props.store}
              turn={props.turn}
            />
          )}
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} className={'footer-sell'}>
          <Row gutter={16} justify="space-between" align="middle">
            <Divider className={'divider-custom-margins-users'} />
            <Col xs={4} sm={4} md={4} lg={4}>
              <Button type={'link'} className="cancel-button" onClick={cancelSell}>
                Cancelar venta
              </Button>
            </Col>
            <Col xs={20} sm={20} md={20} lg={20}>
              {addProducts ? (
                <>
                  <div className="next-button">
                    <div>
                      TOTAL <span>Q {Number(total).toFixed(2)}</span>
                    </div>
                    <Button htmlType="submit" className="title-tendero new-button" onClick={() => onChangeView(false)}>
                      Cobrar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="next-button">
                    <Button htmlType="submit" className="title-tendero new-button back-button" onClick={() => onChangeView(true)}>
                      &#60; Regresar
                    </Button>
                    <Button loading={loading} htmlType="submit" className="title-tendero new-button" onClick={finishSell}>
                      Finalizar venta
                    </Button>
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default SellIndex

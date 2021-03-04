//libraries
import React, { useState, useEffect } from 'react'

//components
import EnterpriseTable from '../enterprises/components/enterpriseTable'
import HeaderPage from '../../components/HeaderPage'
import EnterpriseDrawer from './components/enterpriseDrawer'
import LoadMoreButton from '../../components/LoadMoreButton'
//service
import enterpriseSrc from './enterpriseSrc'
import { message } from 'antd'

function Enterprises() {
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [companies, setCompanies] = useState([])
  const [nextPage, setNextPage] = useState('')
  const [existMoreInfo, setExistMoreInfo] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setVisible(false)
    setLoading(true)
    enterpriseSrc
      .read('', 5)
      .then(companies => {
        if (companies === 'Unauthenticated.') {
          throw new Error('Unauthenticated')
        }
        setCompanies(getCompanies(companies))
        setExistMoreInfo(companies.data.next_page_url !== null)
        setNextPage(companies.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar la informacion.')
      })
  }, [])

  const loadData = () => {
    setVisible(false)
    setLoading(true)
    enterpriseSrc
      .read('', 5)
      .then(companies => {
        if (companies === 'Unauthenticated.') {
          throw new Error('Unauthenticated')
        }
        setCompanies(getCompanies(companies))
        setExistMoreInfo(companies.data.next_page_url !== null)
        setNextPage(companies.data.next_page_url)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        message.error('No se ha podido cargar la informacion.')
      })
  }
  const showDrawer = () => {
    setVisible(true)
    setEditMode(false)
  }

  const onClose = () => {
    setVisible(false)
  }

  const handlerMoreButton = () => {
    setExistMoreInfo(false)
    if (existMoreInfo) {
      setLoading(true)
      enterpriseSrc.enterpriseNextPage(nextPage).then(response => {
        setCompanies(companies.concat(getCompanies(response)))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
    }
  }

  const getCompanies = companies => {
    if (companies !== 'Too Many Attempts.') {
      let _companies = companies.data.data || []

      return _companies.map((d, i) => ({
        key: i,
        company_id: d.id,
        name: d.name,
        regime: d.regime,
        nit: d.nit,
        phone: d.phone,
        pais: d.country !== null && typeof d.country.name !== undefined ? d.country.name : null,
        pais_id: d.country !== null ? d.country_id : null,
        currency_id: d.currency !== null ? d.currency_id : null,
        currency_name: d.currency !== null && d.currency.name !== undefined ? d.currency.name : null,
        address: d.address,
        reason: d.reason,
        allow_add_products: d.allow_add_products,
        allow_add_stores: d.allow_add_stores,
        is_electronic_invoice: d.is_electronic_invoice,
        uses_fel: d.uses_fel,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const searchText = data => {
    setLoading(true)
    enterpriseSrc
      .read(data, 5)
      .then(response => {
        setCompanies(getCompanies(response))
        setExistMoreInfo(response.data.next_page_url !== null)
        setNextPage(response.data.next_page_url)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('Error en la busqueda')
      })
  }

  const EditRow = data => {
    setEditDataDrawer(data)
    setVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => {
    enterpriseSrc
      .enterpriseDelete(data.company_id)
      .then(response => {
        message.success(`${response.name} se ha elminado.`)
        loadData()
      })
      .catch(e => {
        console.log(e)
        message.error('Error al eliminar elemento.')
      })
  }

  const onCancelButton = () => {
    setVisible(false)
  }

  const checkErrors = res => {
    Object.keys(res.errors).map(key => {
      switch (key) {
        case 'phone':
          message.error(res.errors[key][0].replace('phone', 'Telefono'))
          break
        case 'nit':
          message.error(res.errors[key][0].replace('nit', 'NIT'))
          break
        default:
          message.error(res.errors[key])
          break
      }
      return null
    })
  }

  const onSaveButton = (data, method) => {
    setLoading(true)
    switch (method) {
      case true:
        enterpriseSrc
          .updateCompany(data, data.company_id)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              checkErrors(res)
              setLoading(false)
            } else {
              message.success('Informacion actualizada.')
              setVisible(false)
              loadData()
            }
          })
          .catch(e => {
            console.log(e)
            message.error('Error al actualizar la informacion.')
          })
        break
      case false:
        enterpriseSrc
          .saveCompany(data)
          .then(res => {
            if (res.errors && Object.keys(res.errors)?.length > 0) {
              checkErrors(res)
              setLoading(false)
            } else {
              message.success('Informacion creada.')
              setVisible(false)
              loadData()
            }
          })
          .catch(e => {
            console.log(e)
            message.error('Error al actualizar la informacion.')
            loadData()
          })
        break
      default:
        break
    }
  }

  return (
    <div>
      <HeaderPage titleButton={'Nueva empresa'} title={'Empresas'} showDrawer={showDrawer} permissions={2} />
      <EnterpriseTable
        dataSource={companies}
        loading={loading}
        handlerTextSearch={searchText}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
      />
      <LoadMoreButton handlerButton={handlerMoreButton} moreInfo={existMoreInfo} />
      <EnterpriseDrawer
        closable={onClose}
        visible={visible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onCancelButton}
        saveButton={onSaveButton}
      />
    </div>
  )
}

export default Enterprises

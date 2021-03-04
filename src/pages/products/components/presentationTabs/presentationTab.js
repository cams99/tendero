import React, { useEffect, useState, useContext } from 'react'
import PresentationDrawer from './presentationDrawer'
import GeneralTable from '../../../../components/Table'
import { message } from 'antd'
import Utils from '../../../../utils/Utils'
import presentationSrc from './presentationSrc'
import PresentationAssignDrawer from './presentationAssignDrawer'
import LoadMoreButton from '../../../../components/LoadMoreButton'

// Context
import { Context } from '../../../../context'

function PresentationTab(props) {
  const [{ auth }] = useContext(Context)
  const [dataSource, setDataSource] = useState([])
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [nextPage, setNextPage] = useState('')
  const [assignData, setAssignData] = useState({})

  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [visibleAssign, setVisibleAssign] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    if (props.keyTab === '2') {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.keyTab])

  const columns = [
    {
      title: 'Descripción',
      dataIndex: 'description', // Field that is goint to be rendered
      key: 'description',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Producto al que pertenece',
      dataIndex: 'product_name', // Field that is goint to be rendered
      key: 'product_name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Es agrupacion de la expresion minima del producto?',
      dataIndex: 'is_grouping', // Field that is goint to be rendered
      key: 'is_grouping',
      render: text => <span>{text === 1 ? 'Sí' : 'No'}</span>,
    },
    {
      title: 'Numero de unidades de la expresion minima del producto',
      dataIndex: 'units', // Field that is goint to be rendered
      key: 'units',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Precio sugerido',
      dataIndex: 'price', // Field that is goint to be rendered
      key: 'price',
      render: text => <span>{text}</span>,
    },
  ]

  const loadData = () => {
    setVisible(false)
    setVisibleAssign(false)
    setLoading(true)
    presentationSrc
      .getPresentations('', 5)
      .then(response => {
        setDataSource(getPresentationData(response))
        setNextPage(response.data.next_page_url)
        setExistMoreInfo(response.data.next_page_url !== null)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se ha podido cargar la informacion')
      })
  }

  const getPresentationData = dataSrc => {
    if (dataSrc !== 'Too Many Attempts.') {
      let _dataSrc = dataSrc.data.data || []
      return _dataSrc.map((d, i) => ({
        key: i,
        id: d.id,
        company_id: d.company_id,
        description: d.description,
        product_id: d.product !== null && d.product.id !== undefined ? d.product_id : null,
        product_name: d.product !== null ? d.product.description : null,
        price: d.price,
        is_grouping: d.is_grouping,
        units: d.units,
      }))
    } else {
      message.error('Se excedio el limte de peticiones, espera y recarga la aplicacion')
    }
  }

  const searchText = value => {
    setLoading(true)
    presentationSrc.getPresentations(value, 5).then(response => {
      setDataSource(getPresentationData(response))
      setNextPage(response.data.next_page_url)
      setExistMoreInfo(response.data.next_page_url !== null)
      setLoading(false)
    })
  }
  const EditRow = data => {
    setEditDataDrawer(data)
    setEditMode(true)
    setVisible(true)
  }
  const DeleteRow = data => {
    setLoading(true)
    setVisible(false)
    setVisibleAssign(false)
    presentationSrc
      .removePresentations(data.id)
      .then(response => {
        message.success(`${response.description} se ha elminado.`)
        loadData()
      })
      .catch(e => {
        console.log(e)
        message.error('Error al eliminar elemento.')
      })
  }
  const handlerShowDrawer = () => {
    setVisible(true)
    setEditMode(false)
  }
  const moreInfo = () => {
    if (existMoreInfo) {
      setLoading(true)
      Utils.getNextPage(nextPage)
        .then(response => {
          setDataSource(dataSource.concat(getPresentationData(response)))
          setNextPage(response.data.next_page_url)
          setExistMoreInfo(response.data.next_page_url !== null)
          setLoading(false)
        })
        .catch(err => {
          console.log(err)
          message.error('No se ha podido cargar la informacion')
        })
    }
  }
  const onClose = () => {
    setVisible(false)
  }
  const onSaveButton = (method, data, id) => {
    setVisible(false)
    setVisibleAssign(false)
    setLoading(true)
    switch (method) {
      case true:
        presentationSrc
          .editPresentations(id, data)
          .then(response => {
            if (typeof response !== 'object' && response === 'The given data was invalid.') {
              return message.info('No se ha podido actualizar la unidad de medida.')
            } else {
              message.success('Informacion actualizada.')
              loadData()
            }
          })
          .catch(e => {
            console.log(e)
            message.error('Error al actualizar la informacion.')
          })
        break
      case false:
        presentationSrc
          .newPresentations(data)
          .then(response => {
            if (typeof response !== 'object' && response === 'The given data was invalid.') {
              return message.info('No se ha podido crear la unidad de medida.')
            } else {
              message.success('Informacion creada.')
              loadData()
            }
          })
          .catch(e => {
            console.log(e)
            message.error('Error al crear la informacion.')
          })
        break
      default:
        break
    }
  }

  const handlerAssignRow = data => {
    setVisibleAssign(true)
    setAssignData(data)
  }

  return (
    <>
      <GeneralTable
        columns={columns}
        dataSource={dataSource}
        handlerTextSearch={searchText}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
        handlerShowDrawer={handlerShowDrawer}
        loading={loading}
        create={auth.company?.allow_add_products}
        createPermissions={22}
        editPermissions={23}
        deletePermissions={24}
        companyPermissions={true}
        assign={true}
        handlerAssignRow={handlerAssignRow}
      />
      <LoadMoreButton handlerButton={moreInfo} moreInfo={existMoreInfo} />
      <PresentationDrawer
        closable={onClose}
        visible={visible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onClose}
        saveButton={onSaveButton}
      />
      <PresentationAssignDrawer closable={() => setVisibleAssign(false)} visible={visibleAssign} cancelButton={onClose} data={assignData} />
    </>
  )
}

export default PresentationTab

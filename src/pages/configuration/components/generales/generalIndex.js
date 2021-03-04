import React from 'react'

//General
import Departamento from './departamento/departamentoIndex'
import Municipio from './municipio/municipioIndex'
import Pais from './pais/paisIndex'
import Region from './region/regionIndex'
import SocioEconomic from './socioeconomico/socioeconomicoIndex'
import Zona from './zona/zonaIndex'

//Tienda
import Bandera from '../tienda/bandera/banderaIndex'
import Cadena from '../tienda/cadena/cadenaIndex'
import FormatoTienda from '../tienda/formatoTienda/formatoTiendaIndex'
import MetodoPago from '../tienda/metodoPago/metodoPagoIndex'
import TipoNegocio from '../tienda/tipoNegocio/tipoNegocioIndex'
import TipoUbicacion from '../tienda/tipoUbicacion/tipoUbicacionIndex'

function GeneralIndex(props) {
  const switchSectionOption = option => {
    switch (props.option) {
      case 'departamento':
        return <Departamento />
      case 'municipio':
        return <Municipio />
      case 'paises':
        return <Pais />
      case 'regiones':
        return <Region />
      case 'nivelsocioeconomico':
        return <SocioEconomic />
      case 'zona':
        return <Zona />
      case 'bandera':
        return <Bandera />
      case 'cadena':
        return <Cadena />
      case 'formatotienda':
        return <FormatoTienda />
      case 'metodopago':
        return <MetodoPago />
      case 'tiponegocio':
        return <TipoNegocio />
      case 'tipoubicacion':
        return <TipoUbicacion />
      default:
        return <></>
    }
  }

  return <>{switchSectionOption(props.option)}</>
}

export default GeneralIndex

import React from 'react'

import Makers from './makers/makerIndex'
import Uoms from './uoms/uomsIndex'
import Brands from './brands/brandsIndex'
import Providers from './providers/providersIndex'
import ProductDepartament from './productDepartament/productDepartamentIndex'
import ProductCategory from './productCategory/productCategoryIndex'
import ProductSubCategory from './productSubCategory/productSubCategoryIndex'

function ProductIndex(props) {
  const switchSectionOption = option => {
    switch (option) {
      case 'categoriaproducto':
        return <ProductCategory />
      case 'departamentoproducto':
        return <ProductDepartament />
      case 'fabricanteproducto':
        return <Makers />
      case 'marcaproducto':
        return <Brands />
      case 'proveedorproducto':
        return <Providers />
      case 'subcategoriaproducto':
        return <ProductSubCategory />
      case 'unidaddemedidaproducto':
        return <Uoms />
      default:
        return <></>
    }
  }

  return <>{switchSectionOption(props.option)}</>
}

export default ProductIndex

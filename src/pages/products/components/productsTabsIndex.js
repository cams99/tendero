import React, { useState } from 'react'
import { Tabs } from 'antd'
import ProductTab from './productTabs/productTab'
import PresentationTab from './presentationTabs/presentationTab'
import SkuTab from './skuTabs/skuTab'
import ComboTab from './comboTabs/comboTab'
const { TabPane } = Tabs

function ProductsTabsIndex() {
  const [key, setKey] = useState('1')

  const onChangeTab = key => {
    setKey(key)
  }

  return (
    <>
      <Tabs id={'tenderoShopTabs'} defaultActiveKey="1" onTabClick={onChangeTab}>
        <TabPane tab="Productos" key="1">
          <ProductTab keyTab={key} />
        </TabPane>
        <TabPane tab="Presentaciones" key="2">
          <PresentationTab keyTab={key} />
        </TabPane>
        <TabPane tab="SKUs" key="3">
          <SkuTab keyTab={key} />
        </TabPane>
        <TabPane tab="Combos" key="4">
          <ComboTab keyTab={key} />
        </TabPane>
      </Tabs>
    </>
  )
}
export default ProductsTabsIndex

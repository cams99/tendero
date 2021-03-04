import React from 'react'
import { Layout } from 'antd'
const { Content, Footer } = Layout

function TenderoLayout(props) {
  return (
    <div>
      <Layout className='site-layout-background' >
        {props.children}
      </Layout>
      <Content>
        <Footer className='center-flex-div'>
          Tendero ©2020 - V {process.env.REACT_APP_VERSION}
        </Footer>
      </Content>
    </div>
  )
}

export default TenderoLayout
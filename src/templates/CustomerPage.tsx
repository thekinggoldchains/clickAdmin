import React, { FC } from 'react'
import { Layout } from 'antd'

const { Header, Content, Footer } = Layout

const AdminPage: FC = ({ children }) => {
  return (
    <Layout>
      <Header className="flex justify-center tc" style={{ padding: 0 }}>
        Espetinho do Lucis
      </Header>
      <Content style={{ margin: '24px 16px 0' }}>{children}</Content>
      <Footer style={{ textAlign: 'center' }}>
        Click Entregas ©2021 Covilhã - CB
      </Footer>
    </Layout>
  )
}

export default AdminPage

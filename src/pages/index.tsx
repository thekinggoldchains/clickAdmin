import React, { FC, Fragment, useCallback, useState } from 'react'
import { navigate } from 'gatsby'
import { RouteComponentProps } from '@reach/router'
import { GoogleLoginButton } from 'react-social-login-buttons'
import { Layout, Button, Divider } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import logo from '../assets/Logo-site.png'
import intro from '../assets/intro.png'
import SEO from '../components/SEO'

const { Header, Content, Footer } = Layout

const HomePage: FC<RouteComponentProps> = () => {
  const [loginLoading, setLoginLoading] = useState(false)

  const redirectToLogin = useCallback(() => {
    setLoginLoading(true)
    setTimeout(() => {
      navigate('/app/login')
    }, 500)
  }, [setLoginLoading])

  return (
    <Fragment>
      <SEO />
      <Layout>
        <Header
          style={{
            position: 'fixed',
            zIndex: 1,
            width: '100%',
            padding: '0 10px',
            backgroundColor: '#72E298',
          }}
          className="flex justify-between tc mb3"
        >
          <div style={{ flex: 1 }} />
          <div>
            <img
              src={logo}
              alt="Alt Zap"
              className="pa2"
              style={{ maxHeight: '100px', marginTop: -15 }}
            />
          </div>
          <div style={{ flex: 1 }} className="flex justify-end">
            <button
              onClick={() => {
                redirectToLogin()
              }}
              onKeyPress={() => {
                redirectToLogin()
              }}
              tabIndex={0}
              className="f5 f4-l white fw2 bg-transparent bn pointer dim"
            >
              {loginLoading ? (
                <LoadingOutlined style={{ fontSize: 24 }} spin />
              ) : (
                'Login'
              )}
            </button>
          </div>
        </Header>
        <Content className="flex justify-center" style={{ marginTop: '80px' }}>
          <div className="w-100 w-60-l">
            <div className="flex flex-column">
              <span className="black f3 f1-l fw2 ph2 pt3 mt2 mb3 pb2 pa4 tc">
                Compartilhe seus produtos e receba pedidos pelo Whatsapp
              </span>
              <div className="flex justify-center" />
              <div className="flex justify-center pt3 mt3">
                <img className="w-80 w-50-l h-auto" src={intro} alt="Alt Zap" />
              </div>
              <div className="flex mt4 mb1 pl2">
                <span className="f4 fw3">Feito para:</span>
              </div>
              <div className="flex flex-wrap ml1">
                {[
                  'HAMBURGUERIAS',
                  'LOJAS DE ROUPA',
                  'PIZZARIAS',
                  'DOCERIAS',
                  'O QUE VOCÊ QUISER',
                ].map((text, i) => (
                  <span
                    key={i}
                    style={{
                      color: i === 4 ? '#1890FF' : '#000',
                      whiteSpace: 'nowrap',
                    }}
                    className="bg-light-gray shadow-1 pv1 ph2 b ma2 mh1 br4 f7"
                  >
                    {text}
                  </span>
                ))}
              </div>
              <div className="flex flex-column items-center mt4">
                <span className="f3 fw3 mb3">Como funciona</span>
                <ol>
                  <li>
                    Você configura seu <b>catálogo de produtos</b> no nosso
                    sistema. Dá pra colocar nome, imagem e descrição.
                  </li>
                  <Divider />
                  <li>
                    Você configura os <b>meios de pagamento</b> que você aceita,
                    podendo fornecer informações para pagamento (PicPay,
                    Nuconta...).
                  </li>
                  <Divider />
                  <li>
                    Após isso, iremos{' '}
                    <b>gerar um link único para o seu negócio.</b> Se parece com
                    algo assim: <i>click.app/alguma-coisa</i>.
                  </li>
                  <Divider />
                  <li>
                    Você compartilha esse link com seus clientes nas redes
                    sociais, e eles poderão{' '}
                    <b> selecionar os produtos e o endereço de entrega.</b>
                  </li>
                  <Divider />
                  <li>
                    No final, encaminhamos o cliente para o Whatsapp{' '}
                    <b>com o pedido pronto para enviar até você.</b>
                  </li>
                </ol>
              </div>
              <div className="flex flex-column items-center mt4 ph1">
                <span className="f3 fw3 mb3">Funcionalidades</span>
                <ul>
                  <li>
                    Preenchimento automático de endereço por Codigo postal ou
                    localização -- Falta implementar
                  </li>
                  <li>
                    Produtos cadastrados podem ser desabilitados temporariamente
                  </li>
                  <li>Meios de Pagamento com descrição e imagem</li>
                </ul>
              </div>
              <div className="flex flex-column items-center mt4">
                <Button
                  type="primary"
                  size="large"
                  className="br2 pt2 mt2"
                  onClick={() => navigate('/refazenda')}
                >
                  Veja um modelo!
                </Button>
              </div>
              <div className="flex justify-center">
                <GoogleLoginButton
                  text="Entre com o Google"
                  style={{
                    maxWidth: '300px',
                  }}
                  onClick={() => {
                    navigate('/app/login')
                  }}
                />
              </div>
            </div>
          </div>
        </Content>
        <Footer className="tc">Click Entregas ©2021</Footer>
      </Layout>
    </Fragment>
  )
}

export default HomePage

import React, { useState, useEffect, useRef } from 'react'
import { Grid, Card, Image, Container, Header } from 'semantic-ui-react'
import './css/NewsItem.css'
import get_id from './hooks/GetId'
import { useNavigate, createSearchParams } from 'react-router-dom'
import axios from 'axios'

export default function NewsItemDesktop ({ article, mobile }) {
  const navigate = useNavigate()
  const [max_scroll, setMaxScroll] = useState(0)
  const maxScrollRef = useRef(0)
  const [sent, setSent] = useState(false)

  const handleOnPop = () => {
    const API = process.env.REACT_APP_NEWSAPP_API
    const params = {
      id: get_id(),
      article_id: get_article_id(),
      title: article.title,
      condition: get_article_condition(),
      previous_scroll_rate: maxScrollRef.current.toString(),
      pop_state: 'yes',
    }
    if (params.article_id === new URLSearchParams(window.location.search).get('article_id')) {
      axios.get(`${API == null ? 'http://localhost:5000' : API}/logSelection`, {
        params: params,
      })
    }
  }

  useEffect(() => {
    const handlePopstate = (event) => {
      if (!sent) {
        handleOnPop()
        setSent(true)
      }
    }

    window.addEventListener('popstate', handlePopstate)

    return () => {
      handlePopstate()
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [])

  const handleScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    const relativePosition = winScroll / height
    if (relativePosition > maxScrollRef.current) {
      maxScrollRef.current = parseFloat(relativePosition.toFixed(2))
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [max_scroll])

  const get_article_id = () => {
    return article.id
  }

  const get_article_condition = () => {
    return new URLSearchParams(window.location.search).get('condition')
  }

  const id = get_article_id()
  const image_id = require(`./images/i${id}.png`)

  const navigateToArticle = () => {
    const API = process.env.REACT_APP_NEWSAPP_API
    const params = {
      id: get_id(),
      article_id: get_article_id(),
      title: article.title,
      condition: get_article_condition(),
      previous_scroll_rate: maxScrollRef.current.toString(),
      pop_state: 'no',
    }
    axios.get(`${API == null ? 'http://localhost:5000' : API}/logSelection`, {
      params: params,
    })
      .then(response => {
        // Once the selection has been successfully logged, navigate to '/recommendations' with the parameters
        navigate({
          pathname: '/article',
          search: `?${createSearchParams(params)}`,
        })
      })
      .catch(error => {
        console.error('Error while logging selection:', error)
        // Handle any error that occurred during the logging request if necessary
      })
  }

  return mobile ? (
    <>
      <div centered style={{ width: '100%' }} onClick={navigateToArticle}>
        <div className="newsfeed_padding">
          <Grid>
            <Grid.Row width={3}>
              <Image fluid centered className="newsfeed_image_mobile" src={image_id}/>
            </Grid.Row>
            <Grid.Row width={13}>
              <Container fluid className="newsfeed_container_mobile">
                <Header className="newsfeed_title_mobile">{article.title}</Header>
                <p className="newsfeed_teaser_mobile">{article.teaser}</p>
              </Container>
            </Grid.Row>
          </Grid>
        </div>
      </div>
      <hr style={{ border: '.5px solid lightgrey' }}/>
    </>
  ) : (
    <Card centered className="newsfeed_card_desktop" onClick={navigateToArticle}>
      <div className="newsfeed_padding">
        <Grid stretched>
          <Grid.Column width={5}>
            <Container fluid className="newsfeed_container_desktop" style={{ 'marginLeft': 0 }}>
              <Image fluid className="newsfeed_image_desktop" src={image_id}/>
            </Container>
          </Grid.Column>
          <Grid.Column width={11}>
            <Container fluid className="newsfeed_container">
              <Header className="newsfeed_title_desktop">{article.title}</Header>
              <p className="newsfeed_teaser_desktop">{article.teaser}</p>
            </Container>
          </Grid.Column>
        </Grid>
      </div>
    </Card>
  )
}

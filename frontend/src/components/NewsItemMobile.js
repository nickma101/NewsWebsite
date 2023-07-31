import React, { useState, useEffect } from 'react'
import { Grid, Card, Image, Container, Header } from 'semantic-ui-react'
import './css/NewsItem.css'
import get_id from './hooks/GetId'
import { useNavigate, createSearchParams } from 'react-router-dom'
import useWindowDimensions from './hooks/UseWindowDimensions'
import axios from 'axios'

export default function NewsItemMobile ({ article }) {
  const { width } = useWindowDimensions()
  const navigate = useNavigate()
  const [max_scroll, setMaxScroll] = useState(0)

  const handleScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    const relativePosition = winScroll / height
    if (relativePosition > max_scroll) {
      setMaxScroll(parseFloat(relativePosition.toFixed(2)))
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
      previous_scroll_rate: max_scroll.toString(),
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

  return (
    <Card centered style={{ width: width }} onClick={navigateToArticle}>
      <div className="newsfeed_padding">
        <Grid>
          <Grid.Column width={3}>
            <Image fluid centered className="newsfeed_image_mobile" src={image_id}/>
          </Grid.Column>
          <Grid.Column width={13}>
            <Container fluid className="newsfeed_container_mobile">
              <Header className="newsfeed_title_mobile">{article.title}</Header>
              <p className="newsfeed_teaser_mobile">{article.teaser}</p>
            </Container>
          </Grid.Column>
        </Grid>
      </div>
    </Card>
  )
}

import React, { useState, useEffect } from 'react'
import { Grid, Card, Image, Container, Header } from 'semantic-ui-react'
import './css/NewsItem.css'
import get_id from './hooks/GetId'
import { useNavigate, createSearchParams } from 'react-router-dom'
import useWindowDimensions from './hooks/UseWindowDimensions'

export default function NewsItemMobile ({ article }) {
  const navigate = useNavigate()
  const { width } = useWindowDimensions()
  const [max_scroll, setMaxScroll] = useState(0)

  const handleScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    const relativePosition = winScroll / height
    if (relativePosition > max_scroll) {
      setMaxScroll(relativePosition)
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

  const get_article_title = () => {
    return article.title
  }

  const get_article_condition = () => {
    return new URLSearchParams(window.location.search).get('condition')
  }

  const id = get_article_id()
  const image_id = require(`./images/i${id}.png`)

  const navigateToArticle = () => {
    const params = {
      id: get_id(),
      article_id: get_article_id(),
      title: get_article_title(),
      condition: get_article_condition(),
      previous_scroll_rate: new URLSearchParams(window.location.search).get('previous_scroll_rate'),
    }
    navigate({
      pathname: '/article/',
      search: `?${createSearchParams(params)}`,
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

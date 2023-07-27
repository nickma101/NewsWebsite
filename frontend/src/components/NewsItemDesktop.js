import React, { useState, useEffect } from 'react'
import { Grid, Card, Image, Container, Header } from 'semantic-ui-react'
import './css/NewsItem.css'
import get_id from './hooks/GetId'
import { useNavigate, createSearchParams } from 'react-router-dom'

export default function NewsItemDesktop ({ article }) {
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
      console.log('NI:', max_scroll)
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
    const params = {
      id: get_id(),
      article_id: get_article_id(),
      title: article.title,
      condition: get_article_condition(),
      previous_scroll_rate: max_scroll.toString(),
    }
    navigate({
      pathname: '/article/',
      search: `?${createSearchParams(params)}`,
    })
  }

  return (
    <Card centered className="newsfeed_card_desktop" onClick={navigateToArticle}>
      <div className="newsfeed_padding">
        <Grid stretched>
          <Grid.Column width={5}>
            <Container fluid className="newsfeed_container_desktop" style={{ 'marginLeft': 0 }}>
              <Card fluid>
                <Image fluid className="newsfeed_image_desktop" src={image_id}/>
              </Card>
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

import React, { useState, useEffect } from 'react'
import { Grid, Card, Image, Container, Header } from 'semantic-ui-react'
import './css/NewsItem.css'
import get_id from './hooks/GetId'
import { useNavigate, createSearchParams } from 'react-router-dom'
import useWindowDimensions from './hooks/UseWindowDimensions'

export default function NewsItem ({ article }) {
  const navigate = useNavigate()
  const [data, setData] = useState({})
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

  //function to determine css styling dependent on screen size
  function determineClassName () {
    if (width > 500) {
      return [
        'newsfeed_title_desktop ',
        'newsfeed_teaser_desktop ',
        'newsfeed_image_desktop',
        5,
        11,
        'newsfeed_card_desktop ',
        'newsfeed_container_desktop',
      ]
    } else {
      return [
        'newsfeed_title_mobile',
        'newsfeed_teaser_mobile',
        'newsfeed_image_mobile',
        6,
        10,
        'newsfeed_card_mobile',
        'newsfeed_container_mobile',
      ]
    }
  }

  const title = determineClassName()[0]
  const teaser = determineClassName()[1]
  const image = determineClassName()[2]
  const image_width = determineClassName()[3]
  const text_width = determineClassName()[4]
  const card = determineClassName()[5]
  const container = determineClassName()[6]

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
    <Card centered className={card} onClick={navigateToArticle}>
      <div className="newsfeed_padding">
        <Grid stretched>
          <Grid.Column width={image_width}>
            <Container fluid className={container} style={{ 'margin-left': 0 }}>
              <Card fluid>
                <Image fluid className={image} src={image_id}/>
              </Card>
            </Container>
          </Grid.Column>
          <Grid.Column width={text_width}>
            <Container fluid className="newsfeed_container">
              <Header className={title}>{article.title}</Header>
              <p className={teaser}>{article.teaser}</p>
            </Container>
          </Grid.Column>
        </Grid>
      </div>
    </Card>
  )
}

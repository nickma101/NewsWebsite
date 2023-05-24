/*
    Article  component that fetches the article a user selected and displays it to the user
*/
import React, { useState, useEffect } from 'react'
import {
  Container,
  Card,
  Image,
  Menu,
  MenuItem,
  Header,
} from 'semantic-ui-react'
import axios from 'axios'
import './css/ArticleView.css'
import { useNavigate, createSearchParams } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser'
import useWindowDimensions from './hooks/UseWindowDimensions'
import get_id from './hooks/GetId'
import get_article_id from './hooks/GetArticleId'

export default function Article ({ navigation }) {
  const [data, setData] = useState({})
  const article = data
  const { width } = useWindowDimensions()

  //function to determine css styling dependent on screen size
  function determineClassName () {
    if (width > 500) {
      return [
        'title_custom_desktop',
        'articleteaser_desktop',
        'articletext_desktop',
      ]
    } else {
      return [
        'title_custom_mobile',
        'articleteaser_mobile',
        'articletext_mobile',
      ]
    }
  }

  const title = determineClassName()[0]
  const teaser = determineClassName()[1]
  const text = determineClassName()[2]

  //retrieving an individual article from API
  useEffect(() => {
    const user_id = new URLSearchParams(window.location.search).get('id')
    const article_id = new URLSearchParams(window.location.search).get(
      'article_id'
    )
    const condition = new URLSearchParams(window.location.search).get(
      'condition'
    )
    const title = new URLSearchParams(window.location.search).get('title')
    const API = process.env.REACT_APP_NEWSAPP_API
    axios
      .get(`${API == null ? 'http://localhost:5000' : API}/article`, {
        params: { user_id, article_id, condition, title },
      })
      .then((res) => setData(res.data[0]))
  }, [])

  const id = get_article_id()
  const image_id = require(`./images/i${id}.png`)

  //on-click function for navigating to the next set of recommendations
  const navigate = useNavigate()

  const navigateToNewsfeed = () => {
    const params = {
      id: get_id(),
      article_id: get_article_id(),
      condition: new URLSearchParams(window.location.search).get('condition'),
      title: new URLSearchParams(window.location.search).get('title'),
    }
    navigate({
      pathname: '/recommendations',
      search: `?${createSearchParams(params)}`,
    })
  }

  //article display
  return (
    <div>
      <div style={{ width: width - 10 }}>
        <Menu size="massive">
          <MenuItem header>Nieuwslijstje.nl</MenuItem>
          <MenuItem
            className="article_menu"
            name="Terug naar de Homepage"
            icon="home"
            onClick={navigateToNewsfeed}
          ></MenuItem>
        </Menu>
      </div>
      <div style={{ padding: 10 }}>
        <Container centered fluid>
          <Card centered fluid className="custom_card_article">
            <Card.Content>
              <Header textAlign="center" className={title}>
                {article.title}
              </Header>
              <div>
                <Image className="img_desktop" centered src={image_id}/>
              </div>
              <Card.Content className={teaser}>{article.teaser}</Card.Content>
            </Card.Content>
            <Card.Content className={text}>
              {ReactHtmlParser(article.text)}
            </Card.Content>
          </Card>
        </Container>
        <Menu secondary borderless size="massive" fixed="bottom">
          <MenuItem
            className="article_menu"
            name="Terug naar de Homepage"
            position="right"
            icon="home"
            onClick={navigateToNewsfeed}
          ></MenuItem>
        </Menu>
      </div>
    </div>
  )
}

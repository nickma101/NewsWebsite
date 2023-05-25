/*
    Article List component that returns the list of articles for the recommender class
*/

import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import { Container, Grid, MenuItem, Menu } from 'semantic-ui-react'
import useWindowDimensions from './hooks/UseWindowDimensions'
import { useNavigate } from 'react-router-dom'
import get_id from './hooks/GetId'
import get_article_id from './hooks/GetArticleId'
import axios from 'axios'

export default function ArticleList (props) {
  const { height, width } = useWindowDimensions()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('ok')

  useEffect(() => {
    setInterval(() => {
      const user_id = get_id()
      const time = Date.now()
      const API = process.env.REACT_APP_NEWSAPP_API
      axios
        .get(`${API == null ? 'http://localhost:5000' : API}/timer`, {
          params: { user_id },
        })
        .then((res) => {
          setStatus(res.data)
        })
    }, 10000)
  }, [])

  const isItemDisabled = () => {
    if (status === 'ok') {
      return false
    } else {
      return true
    }
  }

  //function to determine css styling dependent on screen size
  function determineClassName () {
    if (width > 500) {
      return 'massive'
    } else {
      return 'large'
    }
  }

  const size = determineClassName()
  const disabled = isItemDisabled()
  console.log(disabled)

  return (
    <Container
      fluid
      className="custom_container"
      style={{ 'margin-bottom': '3%' }}
    >
      <Menu size={size}>
        <MenuItem header>Nieuwslijstje.nl</MenuItem>
        {disabled ? (
          <MenuItem id="qualtricsLink" position="right"
          > Klik hier als je klaar
            bent
            met lezen (minimum is 2 min)</MenuItem>) : (<MenuItem id="qualtricsLink" position="right"
                                                                  onClick={() => { window.location.href = 'https://nickma101.github.io/'}}> Klik
          hier als je klaar
          bent met lezen (minimum is 2 min)</MenuItem>)}
      </Menu>
      <Grid divided>
        {props.articles.map((article) => (
          //For a 2 column grid change width from 16 to 8
          <Grid.Column width={16}>
            <NewsItem article={article} key={article.id}/>
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  )
}

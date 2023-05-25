/*
    Article List component that returns the list of articles for the recommender class
*/

import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import { Container, Grid, MenuItem, Menu } from 'semantic-ui-react'
import useWindowDimensions from './hooks/UseWindowDimensions'
import get_id from './hooks/GetId'
import axios from 'axios'

export default function ArticleList (props) {
  const { height, width } = useWindowDimensions()
  const [status, setStatus] = useState('ok')

  useEffect(() => {
    setInterval(() => {
      const user_id = get_id()
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
    return status !== 'ok'
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

  return (
    <Container
      fluid
      className="custom_container"
      style={{ 'marginBottom': '3%' }}
    >
      <Menu size={size}>
        <MenuItem header>Nieuwslijstje.nl</MenuItem>
        {disabled ? (
          <MenuItem id="qualtricsLink" position="right"
          >Klik hier om af te sluiten (link wordt geactiveerd na x min)</MenuItem>) : (
          <MenuItem id="qualtricsLink" position="right"
                    onClick={() => { window.location.href = 'https://nickma101.github.io/'}}> Klik
            hier om af te sluiten (link wordt geactiveerd na x min.)</MenuItem>)}
      </Menu>
      <Grid divided>
        {props.articles.map((article) => (
          //For a 2 column grid change width from 16 to 8
          <Grid.Column width={16}>
            <NewsItem key={article.id} article={article}/>
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  )
}

/*
    Article List component that returns the list of articles for the recommender class
*/

import React, { useEffect, useState } from 'react'
import NewsItemDesktop from './NewsItemDesktop'
import NewsItemMobile from './NewsItemMobile'
import { Container, Grid, MenuItem, Menu } from 'semantic-ui-react'
import useWindowDimensions from './hooks/UseWindowDimensions'
import get_id from './hooks/GetId'
import axios from 'axios'

export default function ArticleList (props) {
  const { height, width } = useWindowDimensions()
  const [status, setStatus] = useState('not ok')
  const [modality, setModality] = useState('')

  const fetchTimerData = () => {
    const user_id = get_id()
    const API = process.env.REACT_APP_NEWSAPP_API
    axios
      .get(`${API == null ? 'http://localhost:5000' : API}/timer`, {
        params: { user_id },
      })
      .then((res) => {
        setStatus(res.data)
      })
  }

  useEffect(() => {
    fetchTimerData()
    setInterval(() => {
      fetchTimerData()
    }, 10000)
  }, [])

  const isItemDisabled = () => {
    return status !== 'ok'
  }

  const isDesktop = () => {
    return modality !== 'mobile'
  }
  const checkIfDesktop = () => {
    if (width > 500) {
      setModality('desktop')
    } else {
      setModality('mobile')
    }
  }

  useEffect(() => {
    checkIfDesktop()
  }, [])

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
  const desktop = isDesktop()

  return (
    <Container
      fluid
      style={{ 'marginBottom': '3%' }}
    >
      <Menu size={size}>
        <MenuItem header>Nieuwslijstje.nl</MenuItem>
        {disabled ? (
          <MenuItem id="qualtricsLink" position="right"
          >Code: Wacht nog even</MenuItem>) : (
          <MenuItem id="qualtricsLink" position="right" style={{ 'userSelect': 'auto' }}
            //onClick={() => { window.location.href = 'https://nickma101.github.io/'}}
          >
            Code: 123546798123 </MenuItem>)}
      </Menu>
      <Grid divided>
        {props.articles.map((article) => (
          //For a 2 column grid change width from 16 to 8
          <Grid.Column width={16}>
            {desktop ? (
              <NewsItemDesktop key={article.id} article={article}/>) : (
              <NewsItemMobile key={article.id} article={article}/>
            )}
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  )
}

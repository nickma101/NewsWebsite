/*
    Article List component that returns the list of articles for the recommender class
*/

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Container, Menu, MenuItem, Grid } from 'semantic-ui-react'
import useWindowDimensions from './hooks/UseWindowDimensions'
import get_id from './hooks/GetId'
import NewsItem from './NewsItem'
import get_article_id from './hooks/GetArticleId'

const ArticleList = (props) => {
  const { height, width } = useWindowDimensions()
  const [status, setStatus] = useState('not ok')
  const [modality, setModality] = useState('')
  const [visibleArticleIds, setVisibleArticleIds] = useState([])
  const myRef = useRef()
  const [data, setData] = useState({})

  const updateVisibleArticleIds = (id) => {
    if (!visibleArticleIds.includes(id)) {
      setVisibleArticleIds((prevIds) => [...prevIds, id])
      const API = process.env.REACT_APP_NEWSAPP_API
      const params = {
        id: get_id(),
        article_id: id,
        condition: new URLSearchParams(window.location.search).get('condition'),
      }
      // Make a GET request to the '/log_reads' API endpoint
      axios.get(`${API == null ? 'http://localhost:5000' : API}/logView`, {
        params: params,
      }).then((res) => setData(res.data[0]))
    }
  }

  const fetchTimerData = () => {
    const user_id = get_id()
    const API = process.env.REACT_APP_NEWSAPP_API || 'http://localhost:5000'
    axios
      .get(`${API}/timer`, {
        params: { user_id },
      })
      .then((res) => {
        setStatus(res.data)
      })
      .catch((error) => {
        console.error('Error fetching timer data:', error)
      })
  }

  useEffect(() => {
    fetchTimerData()
    const timerInterval = setInterval(fetchTimerData, 15000)
    return () => clearInterval(timerInterval)
  }, [])

  const isItemDisabled = () => {
    return status !== 'ok'
  }

  const isDesktop = () => {
    return modality !== 'mobile'
  }

  useEffect(() => {
    const checkIfDesktop = () => {
      if (width > 500) {
        setModality('desktop')
      } else {
        setModality('mobile')
      }
    }
    checkIfDesktop()
  }, [width])

  // Function to determine css styling dependent on screen size
  const determineClassName = () => {
    return width > 500 ? 'massive' : 'large'
  }

  const size = determineClassName()
  const disabled = isItemDisabled()
  const desktop = isDesktop()

  return (
    <Container fluid style={{ marginBottom: '3%' }}>
      <Menu size={size}>
        <MenuItem header>Nieuwslijstje.nl</MenuItem>
        {disabled ? (
          <MenuItem id="qualtricsLink" position="right"
          >Code : Wacht nog even</MenuItem>) : (
          <MenuItem id="qualtricsLink" position="right" style={{ 'userSelect': 'auto' }}
          > Code:123546798123
          </MenuItem>)}
      </Menu>
      <Grid divided>
        {props.articles.map((article) => (
          <Grid.Column key={article.id} width={16}>
            <div data-article-id={article.id} ref={myRef}>
              <NewsItem article={article} mobile={!desktop} data-article-id={article.id}
                        updateVisibleArticleIds={updateVisibleArticleIds} myRef={myRef}/>
            </div>
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  )
}

export default ArticleList

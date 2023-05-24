/*
    Article List component that returns the list of articles for the recommender class
*/

import React, { useEffect } from 'react'
import NewsItem from './NewsItem'
import { Container, Grid, MenuItem, Menu } from 'semantic-ui-react'
import useWindowDimensions from './hooks/UseWindowDimensions'

export default function ArticleList (props) {
  const { height, width } = useWindowDimensions()
  const handleScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    const relativePosition = winScroll / height
    console.log('scrolled to', { relativePosition })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
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

  return (
    <Container
      fluid
      className="custom_container"
      style={{ 'margin-bottom': '3%' }}
    >
      <Menu size={size}>
        <MenuItem header>Nieuwslijstje.nl</MenuItem>
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

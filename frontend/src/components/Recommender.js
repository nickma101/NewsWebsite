/*
    Recommender component that fetches articles from the backend and displays them to the user using the preferred
    layout

    Layout options are as follows:
    - ArticleList is the default and presents all articles as a list in either a one- or two-column grid
      (see ArticleList.js) for details
    - Homepage is a customisable alternative that emulates a news websites' homepage (see ArticleHomepage.js)
*/

import React, { Component } from 'react'
import axios from 'axios'
import ArticleList from './ArticleList'

class Recommender extends Component {
  state = {
    articles: [],
    loading: true,
    error: false,
  }

  componentDidMount () {
    // Retrieve query parameters from the URL
    const params = new URLSearchParams(window.location.search)
    const user_id = params.get('id')
    const article_id = params.get('article_id')
    const condition = params.get('condition')
    const maxScroll = params.get('maxScroll')
    const title = params.get('title')

    const API = process.env.REACT_APP_NEWSAPP_API || 'http://localhost:5000'

    // Fetch recommended articles from the backend based on the query parameters
    axios
      .get(`${API}/recommendations`, {
        params: { user_id, article_id, condition, maxScroll, title },
      })
      .then((res) => {
        const articles = res.data
        this.setState({ articles, loading: false, error: false })
      })
      .catch((error) => {
        console.error('Error fetching articles:', error)
        this.setState({ loading: false, error: true })
      })
  }

  componentWillUnmount () {
    // Remove the event listener when the component is unmounted to prevent memory leaks
    window.removeEventListener('beforeunload', this.onUnload)
  }

  onUnload = (event) => {
    // Display a warning message before leaving the page if the data fetching is not completed
    if (this.state.loading) {
      event.preventDefault()
      event.returnValue = 'Data is still loading. Are you sure you want to leave?'
    }
  }

  render () {
    const id = new URLSearchParams(window.location.search).get('id')

    if (!id) {
      return <div>Please provide an id here</div>
    }

    const { articles, loading, error } = this.state

    if (loading) {
      return <div>Loading...</div>
    }

    if (error) {
      return <div>Error occurred while fetching articles. Please try again later.</div>
    }

    return <ArticleList articles={articles}/>
  }
}

export default Recommender

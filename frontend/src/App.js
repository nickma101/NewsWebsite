import React from 'react'
import Recommender from './components/Recommender'
import NewsItem from './components/NewsItem'
import ArticleDesktop from './components/ArticleView'
import Homepage from './components/Homepage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App () {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewsItem/>}/>
        <Route path="/recommendations" element={<Recommender/>}/>
        <Route path="/article" element={<ArticleDesktop/>}/>
        <Route path="/home" element={<Homepage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

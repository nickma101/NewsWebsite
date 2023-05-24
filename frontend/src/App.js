import React, { useState } from 'react'
import Recommender from './components/Recommender'
import NewsItem from './components/NewsItem'
import ArticleDesktop from './components/ArticleView'
import Homepage from './components/Homepage'
import Finish from './components/Finish'
import useWindowDimensions from './components/hooks/UseWindowDimensions'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App () {
  const { width, height } = useWindowDimensions()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewsItem/>}/>
        <Route path="/recommendations" element={<Recommender/>}/>
        <Route path="/article" element={<ArticleDesktop/>}/>
        <Route path="/finish" element={<Finish/>}/>
        / <Route path="/home" element={<Homepage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

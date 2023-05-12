/*
    Newsfeed component that returns the list of articles for the recommender class
*/

import React from "react";
import ArticleDisplayMobile from "./ArticleDisplay_Card_Mobile";
import ArticleDisplayDesktop from "./ArticleDisplay_Card_Desktop";
import { Container } from "semantic-ui-react";
import useWindowDimensions from "../hooks/UseWindowDimensions";

export default function ArticleList(props) {
  const { height, width } = useWindowDimensions();
  const articles = props.articles.map((article) => {
    if (width < 700) {
      return <ArticleDisplayMobile article={article} key={article.id} />;
    }
    return <ArticleDisplayDesktop article={article} key={article.id} />;
  });

  return <Container fluid>{articles}</Container>;
}

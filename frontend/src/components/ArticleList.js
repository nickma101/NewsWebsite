/*
    Article List component that returns the list of articles for the recommender class
*/

import React from "react";
import NewsItem from "./NewsItem";
import { Container, MenuItem, Menu } from "semantic-ui-react";
import useWindowDimensions from "./hooks/UseWindowDimensions";

export default function ArticleList(props) {
  const { height, width } = useWindowDimensions();

  //function to determine css styling dependent on screen size
  function determineClassName() {
    if (width > 500) {
      return "massive";
    } else {
      return "large";
    }
  }

  const size = determineClassName();

  const articles = props.articles.map((article) => {
    return <NewsItem article={article} key={article.id} />;
  });

  return (
    <Container
      fluid
      className="custom_container"
      style={{ "margin-bottom": "3%" }}
    >
      <Menu size={size}>
        <MenuItem header>Nieuwslijstje.nl</MenuItem>
      </Menu>
      {articles}
    </Container>
  );
}

/*
    Article Display component that fetches nudge_id from backend and determines the layout of the individual cards
    that are displayed in the Article List
*/
import { React, useState, useEffect } from "react";
import { Image, Card } from "semantic-ui-react";
import "./ArticleDisplayDesktop.css";
import { useNavigate, createSearchParams } from "react-router-dom";
import useWindowDimensions from "../hooks/UseWindowDimensions";
import get_id from "../hooks/GetId";

export default function ArticleDisplay({ article }) {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const get_article_id = () => {
    return article.id;
  };

  const id = get_article_id();
  const image_id = require(`./images/i${id}.png`);

  const get_article_title = () => {
    return article.title;
  };

  //on-click function to navigate to a selected article
  const navigateToArticle = (article) => {
    const params = {
      id: get_id(),
      article_id: get_article_id(),
      title: get_article_title(),
    };
    navigate({
      pathname: "/article/",
      search: `?${createSearchParams(params)}`,
    });
  };

  const { width } = useWindowDimensions();

  return (
    <div style={{ width: width }}>
      <Card centered onClick={navigateToArticle}>
        <Card.Header className="title_custom_newsfeed_desktop">
          {article.title}
        </Card.Header>
        <Card.Description className="date_newsfeed_desktop" textAlign="left">
          vandaag gepubliceerd
        </Card.Description>
        <Card.Content className="text_newsfeed_desktop">
          <Image
            size="big"
            centered
            src={image_id}
            style={{ marginBottom: 20 }}
          />
          <Card.Description
            className="teaser_newsfeed_desktop"
            textAlign="left"
          >
            {article.teaser}
          </Card.Description>
        </Card.Content>
      </Card>
    </div>
  );
}

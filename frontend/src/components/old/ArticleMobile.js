/*
    Article  component that fetches the article a user selected and displays it to the user
*/
import React, { useState, useEffect } from "react";
import { Container, Card, Image, Menu, MenuItem } from "semantic-ui-react";
import axios from "axios";
import "../css/ArticleDesktop.css";
import { useNavigate, createSearchParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import useWindowDimensions from "../hooks/UseWindowDimensions";
import get_id from "../hooks/GetId";
import get_article_id from "../hooks/GetArticleId";

export default function Article({ navigation }) {
  const [data, setData] = useState({});
  let [open, setOpen] = useState(false);
  const article = data;

  function closeModal() {
    setOpen(false);
  }

  //retrieving an individual article from API
  useEffect(() => {
    const user_id = new URLSearchParams(window.location.search).get("id");
    const article_id = new URLSearchParams(window.location.search).get(
      "article_id"
    );
    const condition = new URLSearchParams(window.location.search).get(
      "condition"
    );
    const title = new URLSearchParams(window.location.search).get("title");
    const API = process.env.REACT_APP_NEWSAPP_API;
    axios
      .get(`${API == null ? "http://localhost:5000" : API}/article`, {
        params: { user_id, article_id, condition, title },
      })
      .then((res) => setData(res.data[0]));
  }, []);

  const id = get_article_id();
  const image_id = require(`./images/i${id}.png`);

  //on-click function for navigating to the next set of recommendations
  const navigate = useNavigate();

  const { width } = useWindowDimensions();

  const navigateToNewsfeed = () => {
    const params = {
      id: get_id(),
      article_id: get_article_id(),
      condition: new URLSearchParams(window.location.search).get("condition"),
      title: new URLSearchParams(window.location.search).get("title"),
    };
    navigate({
      pathname: "/recommendations",
      search: `?${createSearchParams(params)}`,
    });
  };

  //article display
  return (
    <div style={{ width: width }}>
      <Menu size="massive">
        <MenuItem header>Nieuwslijstje.nl</MenuItem>
        <MenuItem
          className="article_menu"
          name="Terug naar de Homepage"
          icon="home"
          onClick={navigateToNewsfeed}
        ></MenuItem>
      </Menu>
      <Container fluid>
        <Card centered fluid>
          <Card.Content>
            <Card.Header textAlign="center" className="title_custom_desktop">
              {article.title}
            </Card.Header>
            <Image
              className="img_desktop"
              size="massive"
              centered
              src={image_id}
            />
            <Card.Content className="articleteaser_desktop">
              {article.teaser}
            </Card.Content>
          </Card.Content>
          <Card.Content className="articletext_desktop">
            {ReactHtmlParser(article.text)}
          </Card.Content>
        </Card>
      </Container>
      <Menu secondary borderless size="massive" fixed="bottom">
        <MenuItem
          className="article_menu"
          name="Terug naar de Homepage"
          position="right"
          icon="home"
          onClick={navigateToNewsfeed}
        ></MenuItem>
      </Menu>
    </div>
  );
}

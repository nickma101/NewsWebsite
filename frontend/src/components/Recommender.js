/*
    Recommender component that fetches articles from the backend and displays them to the user using the ArticleList
    and Article Display Card
*/

import React from "react";
import ArticleList from "./ArticleList";
import axios from "axios";

class Recommender extends React.Component {
  state = { articles: [] };

  //retrieve recommended articles from backend and warn users before leaving the page with this.onload
  componentDidMount() {
    window.addEventListener("beforeunload", this.onUnload);
    const user_id = new URLSearchParams(window.location.search).get("id");
    const article_id = new URLSearchParams(window.location.search).get(
      "article_id"
    );
    const condition = new URLSearchParams(window.location.search).get(
      "condition"
    );
    const API = process.env.REACT_APP_NEWSAPP_API;
    axios
      .get(`${API == null ? "http://localhost:5000" : API}/recommendations`, {
        params: { user_id, article_id, condition },
      })
      .then((res) => {
        const articles = res.data;
        this.setState({ articles });
      })
      .catch((error) => console.log(error));
  }

  render() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id == null) return <div>Please provide an id here</div>;
    return <ArticleList articles={this.state.articles} />;
  }
}

export default Recommender;

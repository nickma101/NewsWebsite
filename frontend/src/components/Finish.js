/*
    Finish component that takes the user back to the qualtrics survey
*/
import React, { useEffect, useState } from 'react'
import { Container, Header, Button, Segment } from 'semantic-ui-react'
import axios from 'axios'
import './css/Finish.css'
import get_id from './hooks/GetId'
import get_pid from './hooks/GetPid'
import get_cid from './hooks/GetCid'
import get_article_id from './hooks/GetArticleId'

export default function Finish () {
  const [data, setData] = useState({})

  useEffect(() => {
    const user_id = get_id()
    const pid = get_pid()
    const cid = get_cid()
    const article_id = get_article_id()
    const API = process.env.REACT_APP_NEWSAPP_API
    const rating = new URLSearchParams(window.location.search).get('rating')
    axios
      .get(`${API == null ? 'http://localhost:5000' : API}/last_rating`, {
        params: { user_id, article_id, rating, pid, cid },
      })
      .then((res) => setData(res.data[0]))
  }, [])

  //on-click function that takes the user back to the 2nd qualtrics survey
  function handleClick () {
    const user_id = get_id()
    const pid = get_pid()
    const cid = get_cid()
    const href1 = 'https://vuass.eu.qualtrics.com'
    const href2 = `/jfe/form/SV_3CB4AtxbiyNgSgK?user_id=${user_id}&cid=${cid}&pid=${pid}`
    const link = href1 + href2
    window.location = link
  }

  return (
    <Container text>
      <div>
        <Header className="title_custom2">Je bent bijna klaar!</Header>
      </div>
      <div div className="text">
        <p>
          Je hebt met succes het testen van verschillende nieuwsaanbieders
          afgerond. Bedankt voor je deelname tot nu toe.
        </p>
        <p className="text">
          Klik hieronder om terug te keren naar de enquête. Er zijn nog maar een
          paar vragen.
        </p>
        <Segment basic textAlign={'left'}>
          <Button
            textAlign="center"
            content="Terug naar de enquête"
            color="instagram"
            size="big"
            onClick={handleClick}
          ></Button>
        </Segment>
      </div>
    </Container>
  )
}

import React, { useState, useEffect } from "react";
import useInfiniteScroll from "./useInfiniteScroll";
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const AllUsers = () => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);

  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

  const loadData = () =>{
    let url = "http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/0/20";
    axios.get(url).then(res => {
      const chunkSize = 4;
      const chunkList = []
      for (let i = 0; i < res.data.list.length; i += chunkSize) {
          const chunk = res.data.list.slice(i, i + chunkSize);
          chunkList.push(chunk)
      }
      setData(chunkList);
    });
  }

  function fetchMoreListItems() {
    setTimeout(() => {
      let url = `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${page}/20`;
      axios.get(url).then(res => {
        const chunkSize = 4;
        const chunkList = []
        for (let i = 0; i < res.data.list.length; i += chunkSize) {
            const chunk = res.data.list.slice(i, i + chunkSize);
            chunkList.push(chunk)
        }
        setData([...data, ...chunkList]);
        setPage(page+1)
        setIsFetching(false)
      });
    }, 1000);
  }

  useEffect(()=>{
    loadData()
  }, [])

  return (

    <>
      <Container>
        {data.map((chunk, chunkKey) => (
            <Row>
                {chunk.map((user, key) => (
                  <Col style={{border: "1px solid silver", padding: 0, margin: "10px"}}>
                    <a style={{ textDecoration: 'None', color: "black" }} href={`SingleUser/${user.id}`}>
                      <img width="100%" src={user.imageUrl.concat(user.id)} ></img>
                      <b>{user.prefix} {user.name} {user.lastName}</b>
                      <p>{user.title}</p>
                    </a>
                  </Col>
              ))}
            </Row>
          ))}
      </Container>
    {isFetching && <p> Loading...... </p>}
    </>

  );
};

export default AllUsers;

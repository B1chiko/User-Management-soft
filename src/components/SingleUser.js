
import React, { useState, useEffect } from "react";
import useInfiniteScroll from "./useInfiniteScroll";
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from 'react-router-dom';

const SingleUser = () => {
    const { userId } = useParams();
    const [page, setPage] = useState(0);
    const [friendsData, setFriendsData] = useState([]);
    const [singleUserData, setSingleUserData] = useState([]);

    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

    const loadData = () =>{
      let singleUserUrl = `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${userId}`;
      axios.get(singleUserUrl).then(res => {
        setSingleUserData(res.data);
      });

      let url = `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${userId}/friends/0/20`;
      axios.get(url).then(res => {
        const chunkSize = 4;
        const chunkList = []
        for (let i = 0; i < res.data.list.length; i += chunkSize) {
            const chunk = res.data.list.slice(i, i + chunkSize);
            chunkList.push(chunk)
        }
        setFriendsData(chunkList);
      });
    }

    function fetchMoreListItems() {
      setTimeout(() => {
        let url = `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${userId}/friends/${page}/20`;
        axios.get(url).then(res => {
            const chunkSize = 4;
            const chunkList = []
            for (let i = 0; i < res.data.list.length; i += chunkSize) {
                const chunk = res.data.list.slice(i, i + chunkSize);
                chunkList.push(chunk)
            }
            setFriendsData([...friendsData, ...chunkList]);
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
        <Container style={{border: "1px solid silver", padding: "10px"}}>
            <Row>
                <Col md={3} xs={12}>
                    <img width="100%" src={`${singleUserData.imageUrl}`}></img>
                </Col>
                <Col md={7} xs={12} style={{lineHeight: "60%", border: "1px solid silver"}}>
                  <fieldset style={{ position:"relative", paddingTop: "18px"}}>
                    <legend style={{position:"absolute", top:'-8px', background:"white", width:"60px", textAlign:"center"}}>Info</legend>
                    <p>{singleUserData.prefix} {singleUserData.name} {singleUserData.lastName}</p>
                    <p>{singleUserData.title}</p>
                    <p>{singleUserData.email}</p>
                    <p>{singleUserData.ip}</p>
                    <p>{singleUserData.ip}</p>
                    <p>{singleUserData.jobArea}</p>
                    <p>{singleUserData.jobType}</p>
                  </fieldset>
                </Col>
                <Col md={2} xs={12} style={{lineHeight: "80%", border: "1px solid silver"}}>
                  <fieldset style={{ position:"relative", paddingTop: "18px"}}>
                    <legend style={{position:"absolute", top:'-8px', background:"white", width:"90px", textAlign:"center"}}>Address</legend>
                    <p><b>{singleUserData.company ? singleUserData.company.name : ""} {singleUserData.company ? singleUserData.company.suffix : ""}</b></p>
                    <p> <span style={{textDecoration: "underline"}}>City:</span> {singleUserData.address ? singleUserData.address.city : ""}</p>
                    <p><span style={{textDecoration: "underline"}}>Country:</span> {singleUserData.address ? singleUserData.address.country: ""}</p>
                    <p><span style={{textDecoration: "underline"}}>State: </span>{singleUserData.address ? singleUserData.address.state: ""}</p>
                    <p><span style={{textDecoration: "underline"}}>Address: </span>{singleUserData.address ? singleUserData.address.streetAddress: ""}</p>
                    <p><span style={{textDecoration: "underline"}}>Zip: </span>{singleUserData.address ? singleUserData.address.zipCode: ""}</p>
                  </fieldset>
                </Col>
            </Row>
            <Row>
              <Col>
              <h4>Friends:</h4>
              </Col>
            </Row>
            {friendsData.map((chunk, chunkKey) => (
                <Row>
                    {chunk.map((user, key) => (
                      <Col style={{border: "1px solid silver", padding: 0, margin: "10px"}}>
                        <a style={{ textDecoration: 'None', color: "black" }} href={`/SingleUser/${user.id}`}>
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

  export default SingleUser;
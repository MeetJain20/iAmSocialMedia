import React, { useState, useEffect } from "react";
import "./Postdetails.css";
import Comment from "./Comment";

import { useRequest } from "../../hooks/request-hook";
import { Link } from "react-router-dom";

const Postdetails = (props) => {
  let {
    postMongoid,
    sendName,
    time,
    description,
    imageUrl,
    likes,
    comments,
    comment,
    postid,
    likeArr,
    setCha,
  } = props;
  // console.log("heloooooo", postMongoid);
  const [count, setCount] = useState(comments);
  const [likecounter, setLikecounter] = useState(likes);
  const [lvalue, setLvalue] = useState(0);

  let [likecolor, setLikecolor] = useState("dark");
  let [dispcomment, setDispcomment] = useState("none");
  const [disabled, setDisabled] = useState(false);
  const { sendRequest } = useRequest();
  const [likeA, setLikeA] = useState(likeArr);
  useEffect(() => {
    if (likeA.includes(localStorage.getItem("user"))) {
      setLikecolor("primary");
    } else {
      setLikecolor("dark");
    }
  }, [likeA]);
  function timeSince(date) {
    let splitted = date.split("/");
    let time = new Date(
      splitted[2],
      splitted[1] - 1,
      splitted[0],
      splitted[3],
      splitted[4],
      splitted[5]
    );
    let seconds = Math.floor((new Date() - time) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }
  let k = 0;
  let m = 0;
  const [picture1, setPicture1] = useState("");
  const [name1, setName1] = useState("");
  const [picture, setPicture] = useState("");
  const [name, setName] = useState("");
  const [added, setAdded] = useState(false);

  const likeHandler = async () => {
    if (!disabled) {
      if (likeA.includes(localStorage.getItem("user"))) {
        setDisabled(true);
        const responseData = await sendRequest(
          "https://backend-afak.onrender.com/posts/likeupdate",
          "POST",
          JSON.stringify({
            postMongoid: postMongoid,
            userid: localStorage.getItem("user"),
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setLikeA(responseData.likeArr);
        console.log("like removed");
        setLikecolor("dark");
        setLikecounter((prev) => prev - 1);
        setDisabled(false);
        // setKvalue(0);
      } else {
        setDisabled(true);
        const responseData = await sendRequest(
          "https://backend-afak.onrender.com/posts/likeupdate",
          "POST",
          JSON.stringify({
            postMongoid: postMongoid,
            userid: localStorage.getItem("user"),
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log("Like added");
        setLikeA(responseData.likeArr);
        setLikecolor("primary");
        setLikecounter((prev) => prev + 1);
        setDisabled(false);
        // setKvalue(1);
      }
      setDisabled(false);
    }
  };
  const commentHandler = () => {
    if (lvalue === 0) {
      setLvalue(1);
      setDispcomment("block");
    } else {
      setLvalue(0);
      setDispcomment("none");
    }
  };
  const [comm, setComm] = useState("");
  const [commarr, setCommarr] = useState(comment);
  const handleOnChangeComment = (event) => {
    setComm(event.target.value);
  };
  const [newComm, setNewComm] = useState({
    id: localStorage.getItem("user"),
    content: "",
  });
  const addcommenthandler = async () => {
    setCount(count + 1);
    setNewComm((prevState) => ({
      ...prevState,
      content: comm,
    }));
  };

  const deletePostHandler = async () => {
    if (localStorage.hasOwnProperty("user")) {
      // setPost((prevState) => {
      //   return [...prevState, data];
      // });
      try {
        console.log(localStorage.getItem("user"), postMongoid);
        const responseData = await sendRequest(
          "https://backend-afak.onrender.com/posts/deletePost",
          "DELETE",
          JSON.stringify({
            userid: localStorage.getItem("user"),
            postid: postMongoid,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setTimeout(() => {
          setAdded(true);
        }, 250);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (newComm.content !== "") {
      setCommarr((prevstate) => {
        let newState = [...prevstate, newComm];
        return newState;
      });
    }
  }, [newComm]);
  useEffect(() => {
    // console.log("111 ", commarr);
    const fetchItems = async (req, res, next) => {
      try {
        const response = await sendRequest(
          "https://backend-afak.onrender.com/posts/updatepostscomment",
          "POST",
          JSON.stringify({
            userid: postid,
            comment: [...commarr],
            comments: count,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setCha((prev) => !prev);
        setComm("");
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, [commarr, added]);

  useEffect(() => {
    if (likeA.includes(localStorage.getItem("user"))) {
      setLikecolor("primary");
    } else {
      setLikecolor("dark");
    }
  }, [likeA]);

  useEffect(() => {
    const fetchItems = async (req, res, next) => {
      try {
        const responseData = await sendRequest(
          "https://backend-afak.onrender.com/profile/getprof",
          "POST",
          JSON.stringify({
            userid: postid,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setName(responseData[0].name);
        setPicture(responseData[0].profilePicture);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchItems2 = async (req, res, next) => {
      try {
        const responseData = await sendRequest(
          "https://backend-afak.onrender.com/profile/getprof",
          "POST",
          JSON.stringify({
            userid: localStorage.getItem("user"),
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setName1(responseData[0].name);
        setPicture1(responseData[0].profilePicture);
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
    fetchItems2();
  }, [sendRequest]);
  let timeago = timeSince(time);
  return (
    <div className="postcontainer">
      <div className="posttopbar">
      <Link to={`/profile/${postid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="toppppleftbarr">
          <div className="postleftsidetop">
            <img src={picture} alt="Loading" className="postimageleft" />
          </div>
          <div className="postrightsidetop">
            <p className="nameuser fw-bold">{sendName}</p>
          </div>
          <div className="postrighttime">
          <p className="text-muted">{timeago} ago</p>
          </div>
          </div>
          </Link>
        <div className="topppprightbarr">
          {localStorage.getItem("user") === postid ? (
            <div className="postrightdelete" onClick={deletePostHandler}>
              <i className="fa-sharp fa-regular fa-trash"></i>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <div className="postdescription my-3">
        <p className="postdesc">{description}</p>
      </div>
      <div className="postimage">
        <img src={imageUrl} alt="Loading" className="postimagecon" />
      </div>
      <div className="containasset">
        <div className="postbottombar">
          <div
            className={`postleftsidetop text-${likecolor}`}
            onClick={likeHandler}
          >
            <i className="fa-regular fa-thumbs-up"></i>
          </div>
          <div className="likerighttime">
            <p className="text-muted">{likecounter} people liked it</p>
          </div>
        </div>
        <div className="comment">
          <div className="postleftsidetop commenttop" onClick={commentHandler}>
            <i className="fa-regular fa-comment"></i>
          </div>
          <div className="likerighttime commentpost">
            <p className="text-muted">{count} Comments</p>
          </div>
        </div>
      </div>
      <div className={`commentboxx my-2 d-${dispcomment}`}>
        <ul className="displaycomment">
          <div className="addcomment">
            <img src={picture1} alt="Loading" className="profimgcomment" />
            <span className="commentitemsname">{name1}</span>
          </div>
          <div className="addcommenthere">
            <div className="hereee">
              <input
                type="text"
                placeholder="Write a comment... "
                className="adcom"
                value={comm}
                onChange={handleOnChangeComment}
              />
              <span className="commentitemsname">
                <button className="addcombutt" onClick={addcommenthandler}>
                  Post
                </button>
              </span>
            </div>
          </div>
          {comment.map((element) => {
            return (
              <li className="commentitems">
                <Comment
                  comdescrip={comment[k++].content}
                  userId={comment[m++].id}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default Postdetails;

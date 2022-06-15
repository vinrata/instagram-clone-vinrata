import React,  { useState, useEffect } from 'react';
import './Post.css'
import { Avatar } from '@mui/material'
import { database } from './firebase';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';



function Post({ postId, user,  username, caption, imageUrl, key }) {
    const [comments, setComments] = useState([]);

    const [comment, setComment] = useState([])
useEffect(() => {
    let unsubscribe;
    if (postId) {
        unsubscribe = database
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
    });
}

    return () => {
        unsubscribe();
    };

},[postId]);


    const postComment = (event) => {
            event.preventDefault();
            database.collection("posts").doc(postId).collection("comments").add({
                text: comment, 
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            setComment('');
    }


  return (
    <div className='post' >
        <div className='post__header' > 



{/* display username, profile picture */}
        <Avatar 
        className='post__avatar'
        alt="Vinrata"
        src=""
        />
        <h3>{username}</h3>
        </div>


{/* display  post's image*/}
        <img  className='post__image' 
        src={imageUrl}
        alt="rainforest" />
        
{/* display username and post's descrption*/}
        <h4 className='post__text' > <strong>{username} </strong>{caption}</h4>


    <div className='post__comments'>
        {comments.map((comment) => (
    <p> 
        <strong>{comment.username} </strong>{comment.text}
    </p>
    ))}
    </div>

{user && (
    <form className='post__commentBox' >
    <input
    className='post__input'
    type="text"
    
    placeholder='Add a comment...'
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    >
    </input>

<button
    className='post__button'
    disabled={!comment}
    type="submit"
    onClick={postComment}
    >Post
    </button> 
</form>

)}



    </div>
  )
}

export default Post
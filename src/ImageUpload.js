import React, { useState } from 'react'
import { Button } from '@mui/material/';
import { storage, database } from './firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './ImageUpload.css'

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    // const [url, setUrl] = useState("");

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progess bar 
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            }, 
            (error) => {
                //error function
                console.log(error);
                alert(error.message);
            },
            () => {
                //complete function
                //once it uploads it makes a download url and we are getting it
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //post image in database
                    database.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption, 
                        imageUrl: url,
                        username: username
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
            });
            }
        );
    };


  return (
    <div className='imageupload' > 
              { /* caption input, file picker, post button   */}
                <progress className='imageupload__progress' value={progress} max="100" />

              <input type="text" 
              placeholder='Enter a description...' 
              onChange={event => setCaption(event.target.value)}/>

              <input 
              type="file" 
              onChange={handleChange} />

              <Button onClick ={handleUpload}>
                Upload
              </Button>

        
        
        



    </div>
  )
}

export default ImageUpload
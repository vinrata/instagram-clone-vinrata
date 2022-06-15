import './App.css';
import Post from './Post';
import React,  { useState, useEffect } from 'react';
import {  auth, database }   from './firebase'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {  Input } from '@mui/material/';
import { Button } from '@mui/material/';

import ImageUpload from './ImageUpload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
};





function App() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
 
  const [open, setOpen] = React.useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openUpload, setOpenUpload] = React.useState(false);

  //adding variables with a hook (state) 
  const [posts, setPosts] = useState([]);

  const [user, setUser] = useState(null)

      useEffect(() => {
          const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
              console.log(authUser);
              setUser(authUser);
              //user logs in
            } else {
              setUser(null);
              //user logs out
            }
          })

          return () => {
            //cleanup
            unsubscribe();
          }
      }, [user, username]);

      const signUp = (event) => {
          event.preventDefault();
          auth
          .createUserWithEmailAndPassword(email, password)
          .then((authUser) => {
            return authUser.user.updateProfile({
              displayName: username
            })
            .then((authUser) =>{
              setUser(authUser);
            })
          })
          .catch((error) => alert(error.message));
        setOpen(false);
      }

  //snapshot is a powerful listener, it takes a -snapshot- of the database everytime a change happens
useEffect(() => {
  database.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    //this fire everytime a new post is added
    setPosts(snapshot.docs.map(doc => ({
      id: doc.id,
      post: doc.data()
    })));
  })
}, []);


const signIn = (event) => {
  event.preventDefault();
  auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
}


  return (
    
    <div className="App">

       
<Modal
            open={openUpload}
            onClose={() => setOpenUpload(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
              <form className='app__signup' >
                <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            <center> 
              <img className='app__headerImage2'
                    src = "https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2016-1536x436.png"
                    alt='instagram'></img>
                    <div>

                    {user?.displayName ? (
            <ImageUpload username={user.displayName} />
          ): (
            <h3>login to upload</h3>
          )}

              </div>
                      </center>
            </Typography>
            </Box>
            </form>
</Modal>



        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
              <form className='app__signup' >
                <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            <center> 
              <img className='app__headerImage2'
                    src = "https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2016-1536x436.png"
                    alt='instagram'></img>
                    <br></br>
                      <Input 
                      type="text"
                      placeholder='username'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      > </Input><br></br></center>
                    <center>
                      <Input placeholder='email'
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      > </Input>
                    </center>
                    <center>   
                      <Input placeholder='password'
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      > </Input>
                        <br></br>
                      <Button type="submit" onClick={signUp} > Sign Up</Button>
                      
                      </center>
            </Typography>
            </Box>
            </form>
</Modal>

<Modal

    open={openSignIn}
    onClose={() => setOpenSignIn(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
      <form className='app__signup' >
        <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
    <center> 
      <img className='app__headerImage2'
            src = "https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2016-1536x436.png"
            alt='instagram'></img>
            <br></br>
            </center>
            <center>
              <Input placeholder='email'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              > </Input>
            </center>
            <center>   
              <Input placeholder='password'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              > </Input>
                <br></br>
                
              <Button type="submit" onClick={signIn} > Sign In</Button>
              
              </center>
    </Typography>
    </Box>
    </form>
</Modal>


      <div className='app__header'>
     { /* <BasicModal /> */}



        <img className='app__headerImage'
        src = "https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2016-1536x436.png"
        alt='instagram'></img>
      {user ? (
        <div>
        <Button onClick={() => setOpenUpload(true)}>Upload</Button>
      <Button onClick={() => auth.signOut()}>Logout</Button>
      </div>
      ): (
      <div className='app__loginContainer' >
      
      <Button onClick={() => setOpenSignIn(true)}>Log In</Button>
      <Button onClick={() => setOpen(true)}>Sign Up</Button>
      </div>
      )}

      </div>


<div className='app__post' >
{
        posts.map(({id, post}) => (
        <Post  key={id} postId={id}  user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}  />
          
        ))
      }

</div>

      <h1> </h1>

   
 

    </div>
  );
}

export default App;

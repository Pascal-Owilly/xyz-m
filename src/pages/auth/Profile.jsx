import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Card, Modal, Button } from 'react-bootstrap';
import './Profile.css';
const Profile = () => {
const navigate = useNavigate()
  const authToken = Cookies.get('authToken');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [editedProfilePic, setEditedProfilePic] = useState(null);
  const [editedProfile, setEditedProfile] = useState({
    profile_pic: null,
    current_city: '',
    bio: '',
    first_name: '',
    last_name: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);

  const baseUrl = 'http://127.0.0.1:8000';
  const handleEditProfilePic = (file) => {
    resizeAndSetProfilePic(file);
  };

  const resizeAndSetProfilePic = (file, quality) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; // Define your desired maximum width here
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
  
        ctx.drawImage(img, 0.6, 0.8, canvas.width, canvas.height);
  
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], 'profile_pic.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
  
          setEditedProfilePic(resizedFile);
        }, 'image/jpeg', quality); // Adjust quality (e.g., quality between 0 and 1)
      };
    };
  
    reader.readAsDataURL(file);
  };
  
  const saveProfileChanges = async () => {
    try {
      const formData = new FormData();

      if (editedProfilePic) {
        formData.append('profile_pic', editedProfilePic);
      }

      formData.append('user', user.pk);
      formData.append('current_city', editedProfile.current_city);
      formData.append('bio', editedProfile.bio);
      formData.append('first_name', editedProfile.first_name);
      formData.append('last_name', editedProfile.last_name);

      const response = await axios.put(
        `${baseUrl}/profile/profile/${profile.id}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      setProfile(response.data);
      setShowEditModal(false);
    } catch (error) {
      if (error.response) {
        console.error('Error saving profile changes:', error.response.data);
      } else {
        console.error('Error saving profile changes:', error.message);
      }
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/authentication/user/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      const userData = response.data;
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${baseUrl}/profile/profile/`, {
        headers: {
          Authorization: `Token ${authToken}`,
          'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        },
      });
      const userProfile = response.data;
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchUserData();
      fetchProfile();
    } else {
        navigate('/homepage') 
   }
  }, [authToken]);

  const handleEdit = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };
  
  return (
    <>
    <div className='main-container mt-5' style={{}}>
      <div style={{ backgroundColor: '#fff', height: '', padding:'20px' }}>
        {user && Object.keys(profile).length > 0 ? (
          <div className="container bootstrap snippets bootdey">
            
            <div className="row" >
              
           
              <div className="profile-nav col-md-8">
                <div className="panel" style={{width:'100%', borderRadius:'5px', border:'none'}}>
                  <div className="user-heading">
                  <h2 className='user-heading mb-4 ' style={{fontFamily:'cursive', fontSize:'25px', fontWeight:'300'}} >
                  {user.username ? <span style={{ textTransform: 'capitalize' }}>{user.username}'s</span> : ''}
                  &nbsp; Profile
                </h2>
                <hr />
                    <div style={{borderRadius:'100%'}} className=''>
                    <img
                      className="rounded-circle text-center "
                      src={`${baseUrl}${profile.profile_pic}`} // Use the full URL
                      style={{width:'200px', height:'200px', border:'none', left: 0}}
                    />

<br />  <br />  

                  <h3 ><span className='text-secondary' style={{color:'#999999', font:'20px Poppins, Arial, sans-serif', margin:'0 0 24px', marginBottom:'1rem', lineHeight:'26px', letterSpacing:'2px'}}>{user.email}</span></h3>


                  </div>
                  
                  </div>
                </div>
              </div>
              <div className="profile-info col-md-6 mx-2" style={{ color: '#d9d9d9' }}>
                <div className="panel" style={{ backgroundColor: '#fff',color:'#999999' }}>
                  <h4>
                    {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : ''}
                  </h4>

                </div>
                <div className="panel" style={{ backgroundColor: '' }}>
                  {/* <p className='text-white'>Username : &nbsp; <span className='text-secondary'>{user.username}</span></p> */}

                  {/* Display Bio */}
                  <p className='bio-graph-heading ' style={{color:'#999999', font:'16px Poppins, Arial, sans-serif', margin:'0 0 24px', marginBottom:'1rem', lineHeight:'26px', color:'#fff', fontWeight:'700'}}>Info</p>
                  <p className='summary-head' style={{color:'#999999', fontWeight:'bold'}}>Community : &nbsp; <span className='text-secondary' style={{color:'#999999', font:'16px Poppins, Arial, sans-serif', margin:'0 0 24px', marginBottom:'1rem', lineHeight:'26px', letterSpacing:'2px'}}>{profile.bio}</span></p>
                  {/* Display Current City */}
                  <p className='summary-head' style={{color:'#999999', fontWeight:'bold'}}>Location : &nbsp; <span className='text-secondary' style={{color:'#999999', font:'16px Poppins, Arial, sans-serif', margin:'0 0 24px', marginBottom:'1rem', lineHeight:'26px', letterSpacing:'2px'}}>{profile.current_city}</span></p>

                </div>
                <ul className="text-secondary" style={{ listStyleType:'none' }}>
                  <p>
                    
                    <button onClick={() => setShowEditModal(true)} className="btn btn-outline-primary" style={{textDecoration:'none'}}>
                    <i className="fa fa-edit"></i> Edit profile
                  </button>
                  </p>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ height: 'auto', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Hang tight...</p>
        )}
      </div>
{/* Profile Edit Modal */}
<Modal show={showEditModal} onHide={() => setShowEditModal(false)} style={{ backgroundColor:'rgb(0,0,0,.7)'}}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add form fields for editing the profile */}
          <div className="form-group">
            <label htmlFor="profile_pic">Profile Picture</label>
            <input
              type="file"
              id="profile_pic"
              className="form-control"
              onChange={(e) => handleEditProfilePic(e.target.files[0])}
            />
            {editedProfilePic && (
              <img src={URL.createObjectURL(editedProfilePic)} alt="Profile Picture Preview" />
            )}
          </div>
        
          <div className="form-group">
            <label htmlFor="bio">Community</label>
            <textarea
              id="bio"
              className="form-control"
              value={editedProfile.bio}
              onChange={(e) => handleEdit('bio', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="current_city">Location</label>
            <input
              type="text"
              id="current_city"
              className="form-control"
              value={editedProfile.current_city}
              onChange={(e) => handleEdit('current_city', e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={saveProfileChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  );
};

export default Profile;
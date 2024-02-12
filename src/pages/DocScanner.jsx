import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from './auth/config';
import Cookies from 'js-cookie';

const BankDashboard = () => {
  const baseUrl = BASE_URL;
  const [profile, setProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const accessToken = Cookies.get('accessToken');
  const [uploadedFile, setUploadedFile] = useState(null);

  const refreshAccessToken = async () => {
    try {
      console.log('fetching token refresh ... ');

      const refreshToken = Cookies.get('refreshToken');

      const response = await axios.post(`${baseUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      Cookies.set('accessToken', newAccessToken);
      await fetchUserData();
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
          navigate('/');
        }
        if (accessToken) {
          const response = await axios.get(`${baseUrl}/auth/user/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const userProfile = response.data;
          setProfile(userProfile);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await refreshAccessToken();
        } else {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleDocumentUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('lc_document', uploadedFile);

      const baseUrl = BASE_URL;

      const response = await axios.post(
        `${baseUrl}/api/letter_of_credits/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-User-ID': userProfile?.user?.id,
            'X-User-Email': userProfile?.user?.email,
          },
        }
      );

      if (response.status === 201) {
        console.log('Document uploaded successfully');
      } else {
        console.error('Error uploading document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);
  };

  return (
    <div className='main-container'>
      <h4 className="text-success mb-4">Upload Document</h4>
      <Form>
        <Form.Group controlId="lcDocument">
          <Form.Label className="text-primary">Choose Document</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => onDrop(e.target.files)}
          />
        </Form.Group>
        <Button
          variant="primary btn-sm mt-3"
          onClick={handleDocumentUpload}
          style={{ width: '30%', fontSize: '15px' }}
        >
          Upload
        </Button>
      </Form>
    </div>
  );
};

export default BankDashboard;

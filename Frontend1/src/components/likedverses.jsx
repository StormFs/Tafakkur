import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './css/LikedVerses.css';
import './css/SharedAnimations.css';


const LikedVerses = () => {
    const [likedVerses, setLikedVerses] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = '/login';
    }
    const handleLike = async (verseNumber, surah_number) => {
        try {
            const response = await axios.post(`http://localhost:5143/api/likes/add`, {
                username: username,
                verse_number: verseNumber,
                surah_number: surah_number
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error adding like:', error);
        }
        setLikedVerses((await axios.get(`http://localhost:5143/api/likedverses/${username}`)).data);
    };

    const toggleLike = async (verseNumber, surah_number) => {
        if (!username) {
            alert('Please login to continue');
            return;
        }
        handleLike(verseNumber, surah_number);
        console.log(likedVerses);
    };


    useEffect(() => {
        const fetchLikedVerses = async () => {
            try {
                const response = await axios.get(`http://localhost:5143/api/likedverses/${username}`);
                console.log(response.data);
                if (!response.data) {
                    throw new Error('Unexpected response format');
                }
                setLikedVerses(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchLikedVerses();
    }, []);



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="liked-verses-container fade-in">
            <Helmet>
                <title>Liked Verses</title>
            </Helmet>
            <Header />
            <h1 className="liked-verses-title" style={{marginTop: '100px'}}>Liked Verses</h1>
            {likedVerses.length > 0 ? (
                <div className="liked-verses-list">
                    {likedVerses.map((verse, index) => (
                        <div 
                            key={verse.id} 
                            className="liked-verse-card"
                            style={{animationDelay: `${index * 0.1}s`}}
                        >
                            <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', alignItems: 'right', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                <h5 style={{ textAlign: 'right' }}>{verse.verse_number}       :       {verse.surah_name_arabic}</h5>
                                <hr style={{ width: '100%' }} />
                                <h4 style={{ textAlign: 'right' }}>{verse.arabic}</h4>
                                <br />
                                <h5 style={{ textAlign: 'right' }}>{verse.english}</h5>
                                <button style={{backgroundColor: 'transparent'}} onClick={() => toggleLike(verse.verse_number, verse.surah_number)}>
                                    {<FaHeart style={{ color: 'red' , backgroundColor: 'transparent'}} />}
                                </button>
                                <button onClick={() => navigate(`/quran/${verse.surah_number}?verse=${verse.verse_number}`)}>
                                    Go to Surah
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>No liked verses yet</p>
                </div>
            )}
        </div>
    )
}

export default LikedVerses;

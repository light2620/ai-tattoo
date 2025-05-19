import React, { useState } from 'react';
import './style.css';
import { useApi } from '../../Api/apiProvider';
import Spinner from '../../utils/Spinner/Spinner';
import { useDispatch } from 'react-redux';
import { setGenratedImagesData } from '../../Redux/Slice/genratedImageSlice';
import { getGeneratedImages } from '../../Api/genratedImagesApi';
const Home = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { post } = useApi();
  const dispatch = useDispatch();

  const handleGenerate = async () => {
    try {
      if (input.trim()) {
        setLoading(true);
        setImageUrl(''); // clear previous image
        const response = await post(
          'https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/generateImage',
          { prompt: input }
        );
        if (response.data.type === 'success') {
          setImageUrl(response.data.imageUrl);
          getGeneratedImages(dispatch, post, setGenratedImagesData);
        }
      } else {
        setImageUrl('');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="dashed-input"
        />
        <button onClick={handleGenerate} className="generate-btn">
          Generate
        </button>
      </div>

      <div className="image-preview">
        {loading ? (
        <div className="loading-container">
          <Spinner />
          <p>Generating image...</p>
        </div>

        ) : imageUrl ? (
          <img src={imageUrl} alt="Generated" />
        ) : (
          <p>No image generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default Home;

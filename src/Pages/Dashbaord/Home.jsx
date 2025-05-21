import { useState } from 'react';
import './style.css';
import { useApi } from '../../Api/apiProvider';
import { getUserDetails } from '../../Api/getUserDataApi';
import { useDispatch } from 'react-redux';
import { setImages, setImageLoading } from '../../Redux/ImagesSlice';
import OptionSelector from '../../utils/OptionSelector/OptionSelector';
import Spinner from '../../utils/Spinner/Spinner';
import { FaDownload } from 'react-icons/fa';

const Home = () => {
  const [input, setInput] = useState('');
  const [quality, setQuality] = useState('simple');
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const { post } = useApi();
  const dispatch = useDispatch();

  const handleGenerate = async () => {
    if (!input.trim()) return;
    try {
      setLoading(true);
      setImageUrl('');
      const response = await post(
        'https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/generateImage',
        { prompt: input, quality }
      );
      if (response.data.type === 'success') {
        setImageUrl(response.data.imageUrl);
        const userData = await getUserDetails(dispatch, post, setImageLoading);
        if (userData) {
          dispatch(setImages(userData.generateImages));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h2 className="home-heading">Tattoo Generator</h2>

      <div className="form-group">
        <input
          type="text"
          placeholder="Describe your tattoo idea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="mode">
            <OptionSelector selected={quality} onChange={setQuality} />
        </div>
        
        <button onClick={handleGenerate}>Generate</button>
      </div>

      {loading && (
        <div className="generating-img-loading ">
          <Spinner />
          <p>Generating...</p>
        </div>
      )}

      {!loading && imageUrl && (
        <div className="image-wrapper">
          <img src={imageUrl} alt="Generated tattoo" />
          <a
            href={imageUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="download-btn"
            title="Download image"
          >
            <FaDownload />
          </a>
        </div>
      )}

      {!loading && !imageUrl && (
        <p className="placeholder">No image generated yet.</p>
      )}
    </div>
  );
};

export default Home;

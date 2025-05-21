import { useState } from 'react';
import './style.css';
import { useApi } from '../../Api/apiProvider';
import Spinner from '../../utils/Spinner/Spinner';
import { getUserDetails } from '../../Api/getUserDataApi';
import { useDispatch } from 'react-redux';
import { setImages, setImageLoading } from '../../Redux/ImagesSlice';
import OptionSelector from '../../utils/OptionSelector/OptionSelector';
import { FaDownload } from 'react-icons/fa';
const Home = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("https://firebasestorage.googleapis.com/v0/b/tattoo-shop-printing-dev.firebasestorage.app/o/tattoos%2F600703dd-832c-4c22-9fd5-7af3d55a20c7.png?alt=media&token=1f6593b1-e5f6-4dab-b932-dd74cafe80de")
  const [quality, setQuality] = useState('simple');
  const { post } = useApi();
  const dispatch = useDispatch();

  const handleGenerate = async () => {
    try {
      if (input.trim()) {
        setLoading(true);
        setImageUrl('');
        const response = await post(
          'https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/generateImage',
          { prompt: input, quality }
        );
        if (response.data.type === 'success') {
          setImageUrl(response.data.imageUrl);
          const userResponse = await getUserDetails(dispatch, post, setImageLoading);
          if (userResponse) {
            dispatch(setImages(userResponse.generateImages));
          }
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
    <div className="home-wrapper">
      <div className="home-content">
        <h2 className="home-title">Tattoo Generator</h2>
        <div className="input-group">
  <input
    type="text"
    placeholder="Describe your tattoo idea..."
    value={input}
    onChange={(e) => setInput(e.target.value)}
    className="custom-input"
  />
  <div>
      <OptionSelector selected={quality} onChange={setQuality} />
  </div>
  
  <button onClick={handleGenerate} className="black-btn">
    Generate
  </button>
  {imageUrl && !loading && (
    <a href={imageUrl} download target="_blank" rel="noopener noreferrer" className="download-btn" title="Download image">
      <FaDownload />
    </a>
  )}
</div>

        <div className="image-preview">
          {loading ? (
            <div className="loading-container">
              <Spinner />
              <p>Generating Tattoo...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt="Generated" />
          ) : (
            <p className="no-image-text">No image generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
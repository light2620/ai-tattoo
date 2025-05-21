import { useState } from 'react';
import './style.css';
import { useApi } from '../../Api/apiProvider';
import { getUserDetails } from '../../Api/getUserDataApi';
import { useDispatch } from 'react-redux';
import { setImages, setImageLoading } from '../../Redux/ImagesSlice';
import OptionSelector from '../../utils/OptionSelector/OptionSelector';
import Spinner from '../../utils/Spinner/Spinner';
import { FaDownload } from 'react-icons/fa';
import ReferenceImages from '../../Components/RefrenceImages/RefrenceImages';
import toast from 'react-hot-toast';
const Home = () => {
  const [input, setInput] = useState('');
  const [openRefrenceImages, setOpenRefrenceImages] = useState(false);
  const [selectedRefrenceImages, setSelectedRefrenceImages] = useState([]);
  const [quality, setQuality] = useState('simple');
  const [loading, setLoading] = useState(false);
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
        {
          prompt: input,
          referenceImages: selectedRefrenceImages,
          mode: quality
        }
      );
      console.log(response)
      if (response.data.type === 'success') {
        setImageUrl(response.data.imageUrl);
        const userData = await getUserDetails(dispatch, post, setImageLoading);
        if (userData) {
          dispatch(setImages(userData.generateImages));
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
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

        <div className="form-options">
        
           <button
            className="reference-btn"
            onClick={() => setOpenRefrenceImages(true)}
          >
           <span className="btn-text">Reference Images</span> 
          </button>
         
          <div className="option-selector">
            <OptionSelector selected={quality} onChange={setQuality} />
          </div>
          

          <button className="btn-generate" onClick={handleGenerate}>
            Generate
          </button>
        </div>
      </div>

      {loading && (
        <div className="generating-img-loading ">
          <Spinner />
          <p>Generating Tattoo...</p>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleGenerate();
              }
            }}
          >
            <FaDownload />
          </a>
        </div>
      )}

      {!loading && !imageUrl && (
        <div>
          <p className="placeholder">No image generated yet.</p>
          {selectedRefrenceImages.length > 0 && <p className="placeholder">{selectedRefrenceImages.length} Refrence Selected</p>}

        </div>



      )}
      {
        openRefrenceImages && <ReferenceImages selectedImages={selectedRefrenceImages} setSelectedImages={setSelectedRefrenceImages} onClose={() => setOpenRefrenceImages(false)} />
      }
    </div>
  );
};

export default Home;

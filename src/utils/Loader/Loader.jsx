import { RotatingLines } from 'react-loader-spinner';
import './style.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <RotatingLines
        visible={true}
        height="96"
        width="96"
        color="#FFCC4A" // ✅ Set the loader color here
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}} 
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;

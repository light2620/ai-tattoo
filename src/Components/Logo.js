
import logo from '../Assets/logo2.png';
import { useNavigate } from 'react-router-dom';
export default function Logo() {
    const navigate = useNavigate();
    return (
           <img src={logo} alt="logo" onClick={() => navigate('/tattoo-ai')} />
    )
}
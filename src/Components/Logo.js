
import logo from '../Assets/Logo.png';
import { useNavigate } from 'react-router-dom';
export default function Logo() {
    const navigate = useNavigate();
    return (
           <img src={logo} alt="logo" onClick={() => navigate('/tattoo-ai')} />
    )
}
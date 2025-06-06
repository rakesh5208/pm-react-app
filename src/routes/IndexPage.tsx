import { useEffect } from 'react'
import { useNavigate } from 'react-router';

const IndexPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        //redirect to home
        navigate('/home');
    }, [navigate]);
    return (
        <div>
            loading...
        </div>
    )
}

export default IndexPage
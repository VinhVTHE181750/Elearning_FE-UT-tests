import { useLocation } from 'react-router';
import Posts from '../../Blog/post/Post';

import Footer from '../../../components/Footer/Footer';
import Header from '../../../components/Header/Header';
import './homepage.css';

export default function Homepage() {
  const location = useLocation();
  console.log(location);
  return (
    <>
      <Header />
      <div className="home">
        <Posts />
        <Footer />
      </div>
    </>
  );
}

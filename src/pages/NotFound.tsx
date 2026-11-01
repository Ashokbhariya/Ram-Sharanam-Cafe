import { Link } from 'react-router-dom';
import { PageHero } from '../components/ui';
export default function NotFound() {
  return (<><PageHero eyebrow="404" title={['PAGE NOT', 'FOUND.']} /><div className="wrap page-body"><Link to="/" className="btn btn--green">Back home</Link></div></>);
}

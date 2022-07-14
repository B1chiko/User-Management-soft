import './App.css';
import AllUsers from './components/AllUsers';
import SingleUser from './components/SingleUser';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router >
      <Routes >
        <Route path="/" element={<AllUsers />} />
        <Route path="SingleUser/:userId" element={<SingleUser />} />
      </Routes>
    </Router>
  );
}
 
export default App;

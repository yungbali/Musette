import AppFlow from './app-flow';
import { store } from './store'
import { Provider } from 'react-redux'
import {Route, Routes,BrowserRouter} from 'react-router-dom';

import './App.css'
import LoginScreen from './components/login';
import SignupScreen from './components/signup';

import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init();

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<AppFlow />} />
        <Route path='/signup' element={<SignupScreen />} />
        <Route path='/login' element={<LoginScreen />} />
      </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App

import './App.css'
import Card  from './components/Card'
import { Provider } from 'react-redux';
import store from './app/store';


function App() {

  return (
    <>
    <Provider store={store}>
      <Card/>
    </Provider>
    </>
  )
}

export default App

import { Provider } from 'react-redux';
import store from './store';
import Header from './components/Header/header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './css/main.global.scss';
import Main from './pages/Main/main';
import { Stats } from './pages/Stats/stats';

function App() {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Header />
				<main>
					<div className="container">
						<Routes>
							<Route path='/' element={<Main />} />
							<Route path='/stats' element={<Stats />} />
						</Routes>
					</div>
				</main>
			</BrowserRouter>
		</Provider>
	);
}

export default App;

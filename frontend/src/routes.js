import { LoginSignup } from './pages/LoginSignup.jsx'
import { HomePage } from './pages/HomePage.jsx';
import { BoardApp } from './pages/BoardApp.jsx';


const routes = [
    {
        path: '/login',
        component: LoginSignup
    },
    {
        path: '/signup',
        component: LoginSignup
    },
    {
        path: '/board/:boardId',
        component: BoardApp
    },
   
    {
        path: '/',
        component: HomePage
    },
];

export default routes;
/* Criando módulo Auth e rota de login */

const Login = () => import('./../views/Login.vue')

export default [
  { path: '/login', component: Login }
]
